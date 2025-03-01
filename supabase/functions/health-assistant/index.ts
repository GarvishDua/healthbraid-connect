
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();
    
    console.log('Processing symptoms:', symptoms);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a knowledgeable health assistant. Suggest safe home remedies for symptoms. Format your response in a clear, easy-to-read way. Include a disclaimer about seeking professional medical advice. Focus on evidence-based, generally safe remedies.' 
          },
          { 
            role: 'user', 
            content: `Please suggest some safe home remedies for these symptoms: ${symptoms}` 
          }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated response:', generatedText);

    return new Response(
      JSON.stringify({ 
        response: generatedText 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in health-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate health recommendations. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
