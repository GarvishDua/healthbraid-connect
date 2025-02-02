import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";

const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

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
    try {
      const response = await supabase.functions.invoke('health-assistant', {
        body: { symptoms },
      });

      if (response.error) throw response.error;

      setRecommendation(response.data.response);
      toast({
        title: "Recommendations generated",
        description: "Here are some suggested home remedies for your symptoms.",
      });
    } catch (error: any) {
      console.error('Error getting AI recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">AI Health Assistant</h1>
          <p className="text-gray-600">
            Get personalized home remedy suggestions for your symptoms. 
            Remember: This is not a replacement for professional medical advice.
          </p>
        </div>

        <Card className="p-6">
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
                  Generating recommendations...
                </div>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>

          {recommendation && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold mb-2">Recommended Home Remedies:</h3>
              <div className="whitespace-pre-line text-gray-700">
                {recommendation}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;