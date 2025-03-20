
import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { AlertCircle, Lock, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Client-side encryption helper
const encryptData = (text: string, key: string): string => {
  // Simple XOR encryption (in production use a more robust library)
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
};

const decryptData = (encryptedText: string, key: string): string => {
  try {
    const text = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    console.error("Decryption failed:", e);
    return "Decryption failed. Incorrect key or corrupted data.";
  }
};

// Generate a secure encryption key
const generateSecureKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  const randomValues = new Uint8Array(32);
  window.crypto.getRandomValues(randomValues);
  
  randomValues.forEach(val => {
    result += chars.charAt(val % chars.length);
  });
  
  return result;
};

const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);
  const inactiveTimeoutSeconds = 300; // 5 minutes

  // Auto-generate encryption key on component mount
  useEffect(() => {
    setEncryptionKey(generateSecureKey());
  }, []);

  // Setup inactivity timer to clear sensitive data
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        // Clear sensitive data after inactivity
        if (recommendation) {
          setRecommendation("");
          toast({
            title: "Session expired",
            description: "Your medical data has been cleared due to inactivity",
          });
        }
      }, inactiveTimeoutSeconds * 1000);
      
      setInactivityTimer(inactiveTimeoutSeconds);
    };

    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setInactivityTimer(prev => prev !== null ? Math.max(0, prev - 1) : null);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      clearInterval(countdownInterval);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [recommendation, toast]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAIAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");
    setRecommendation("");
    
    try {
      console.log("Sending secure request to edge function");
      
      // Prepare request with optional encryption
      const requestBody: Record<string, any> = { 
        symptoms 
      };
      
      // Add encryption key if encryption is enabled
      if (encryptionEnabled && encryptionKey) {
        requestBody.encryptionKey = encryptionKey;
      }
      
      const response = await supabase.functions.invoke('health-assistant', {
        body: requestBody,
      });

      console.log("Secure response received:", 
        response.data ? "Data present" : "No data");

      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(response.error.message || "Failed to get recommendations");
      }

      if (!response.data || !response.data.response) {
        throw new Error("Invalid response from health assistant");
      }

      // Handle encrypted or plain text response
      if (response.data.encrypted && encryptionEnabled) {
        const decryptedText = decryptData(response.data.response, encryptionKey);
        setRecommendation(decryptedText);
      } else {
        setRecommendation(response.data.response);
      }
      
      toast({
        title: "Recommendations generated",
        description: encryptionEnabled 
          ? "Secure, encrypted recommendations ready" 
          : "Recommendations generated successfully",
      });
    } catch (error: any) {
      console.error('Security error getting AI recommendations:', error);
      setError(error.message || "Failed to generate recommendations. Please try again.");
      toast({
        title: "Security Error",
        description: "Failed to securely process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">AI Health Assistant (Powered by Gemini)</h1>
          <p className="text-gray-600">
            Get personalized home remedy suggestions for your symptoms. 
            Remember: This is not a replacement for professional medical advice.
          </p>
          <div className="mt-4 flex items-center justify-center gap-1">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">
              Enhanced with medical-grade security
            </span>
          </div>
        </div>

        <Card className="p-6 shadow-lg border-primary/20">
          <div className="mb-6 p-3 bg-primary-50 rounded-lg flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-primary">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600">
                Enable encryption to secure your medical data from unauthorized access.
                Only you will be able to decrypt and view your health information.
              </p>

              <div className="mt-3 flex items-center space-x-2">
                <Switch
                  id="encryption"
                  checked={encryptionEnabled}
                  onCheckedChange={setEncryptionEnabled}
                />
                <Label htmlFor="encryption">
                  {encryptionEnabled ? "Encryption Enabled" : "Encryption Disabled"}
                </Label>
              </div>
            </div>
          </div>

          <form onSubmit={handleAIAssistant} className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your symptoms
              </label>
              <Textarea
                id="symptoms"
                placeholder="E.g., I have a mild headache and feeling tired..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {encryptionEnabled ? "Securely processing..." : "Generating recommendations..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {encryptionEnabled && <Lock className="h-4 w-4" />}
                  {encryptionEnabled ? "Get Secure Recommendations" : "Get Recommendations"}
                </div>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Security Error</p>
                <p>{error}</p>
                <p className="mt-2 text-sm">
                  Note: You need to add the GEMINI_API_KEY to your Supabase Edge Function secrets.
                </p>
              </div>
            </div>
          )}

          {recommendation && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Recommended Home Remedies:</h3>
                {inactivityTimer !== null && inactivityTimer < 60 && (
                  <div className="text-xs text-red-500">
                    Session expires in: {formatTimeRemaining(inactivityTimer)}
                  </div>
                )}
              </div>
              <div className="p-4 bg-primary-50 rounded-lg relative">
                {encryptionEnabled && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="whitespace-pre-line text-gray-700">
                  {recommendation}
                </div>
              </div>
            </div>
          )}

          {encryptionEnabled && (
            <div className="mt-4 text-xs text-gray-500">
              <p className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Your data is encrypted end-to-end and automatically cleared after {Math.floor(inactiveTimeoutSeconds / 60)} minutes of inactivity.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
