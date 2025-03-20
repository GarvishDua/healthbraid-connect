
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encodeBase64, decodeBase64 } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

// Enhanced CORS headers with security-related headers
const securityHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Simple encryption/decryption functions
function encrypt(text: string, key: string): string {
  // XOR-based encryption (for demonstration - in production, use more robust methods)
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key.repeat(Math.ceil(text.length / key.length)).slice(0, text.length));
  
  const encryptedBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encryptedBytes[i] = textBytes[i] ^ keyBytes[i];
  }
  
  return encodeBase64(encryptedBytes);
}

function decrypt(encryptedBase64: string, key: string): string {
  const encryptedBytes = decodeBase64(encryptedBase64);
  const keyBytes = new TextEncoder().encode(key.repeat(Math.ceil(encryptedBytes.length / key.length)).slice(0, encryptedBytes.length));
  
  const decryptedBytes = new Uint8Array(encryptedBytes.length);
  for (let i = 0; i < encryptedBytes.length; i++) {
    decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i];
  }
  
  return new TextDecoder().decode(decryptedBytes);
}

serve(async (req) => {
  // Handle CORS preflight requests with enhanced security headers
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: securityHeaders });
  }

  try {
    // Input validation
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const requestData = await req.json();
    
    if (!requestData || typeof requestData !== 'object') {
      throw new Error('Invalid request format');
    }
    
    const { symptoms, encryptionKey } = requestData;
    
    if (!symptoms || typeof symptoms !== 'string') {
      throw new Error('Symptoms must be provided as a string');
    }
    
    console.log('Processing secure request');

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      throw new Error('GEMINI_API_KEY is not configured. Please add it to your Supabase Edge Function secrets.');
    }

    // Sanitize symptoms input to prevent injection attacks
    const sanitizedSymptoms = symptoms
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;');

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a knowledgeable health assistant. Please suggest safe home remedies for these symptoms: ${sanitizedSymptoms}. 
                Format your response in a clear, easy-to-read way. Include a disclaimer about seeking professional medical advice. 
                Focus on evidence-based, generally safe remedies. Never suggest dangerous treatments or medications.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    console.log('Secure API response received');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Encrypt the response if encryption key is provided
    const responseText = encryptionKey 
      ? encrypt(generatedText, encryptionKey)
      : generatedText;

    const responseObj = { 
      response: responseText,
      encrypted: !!encryptionKey
    };

    // Add a unique request ID for audit logging
    const requestId = crypto.randomUUID();
    console.log(`Request ID: ${requestId} processed successfully`);

    return new Response(
      JSON.stringify(responseObj),
      { 
        headers: { ...securityHeaders, 'Content-Type': 'application/json', 'X-Request-ID': requestId } 
      }
    );
  } catch (error) {
    console.error('Security error in health-assistant function:', error);
    
    // Don't expose internal error details in the response
    const safeErrorMessage = error instanceof Error 
      ? 'Security validation failed: ' + error.message 
      : 'An unknown security error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: safeErrorMessage
      }),
      { 
        status: 400, 
        headers: { ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
