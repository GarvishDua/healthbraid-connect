import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Heart, Users } from "lucide-react";

const HelpNow = () => {
  const { needId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: medicalNeed, isLoading } = useQuery({
    queryKey: ['medicalNeed', needId],
    queryFn: async () => {
      console.log('Fetching medical need details...');
      
      // First, fetch the medical need
      const { data: need, error: needError } = await supabase
        .from('medical_needs')
        .select('*')
        .eq('id', needId)
        .single();

      if (needError) {
        console.error('Error fetching medical need:', needError);
        throw needError;
      }

      if (!need) {
        throw new Error('Medical need not found');
      }

      // Then, fetch the associated profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', need.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Combine the data
      const needWithProfile = {
        ...need,
        profile
      };

      console.log('Medical need with profile:', needWithProfile);
      return needWithProfile;
    },
  });

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a donation.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          medical_need_id: needId,
          donor_id: user.id,
          amount: Number(amount),
          message: message || null,
          anonymous: isAnonymous
        });

      if (error) throw error;

      // Update the amount raised
      const { error: updateError } = await supabase
        .from('medical_needs')
        .update({
          amount_raised: medicalNeed!.amount_raised + Number(amount)
        })
        .eq('id', needId);

      if (updateError) throw updateError;

      toast({
        title: "Donation successful",
        description: "Thank you for your generous donation!",
      });

      // Redirect back to the medical need page
      navigate(`/need/${needId}`);
    } catch (error) {
      console.error('Error making donation:', error);
      toast({
        title: "Error",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">Loading medical need details...</div>
        </div>
      </div>
    );
  }

  if (!medicalNeed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">Medical need not found</div>
        </div>
      </div>
    );
  }

  const progressPercentage = (medicalNeed.amount_raised / medicalNeed.amount_needed) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{medicalNeed.title}</h3>
                <p className="text-gray-600 mb-4">{medicalNeed.description}</p>
                <div className="flex items-center mb-2">
                  {medicalNeed.profile?.avatar_url ? (
                    <img 
                      src={medicalNeed.profile.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    {medicalNeed.profile?.first_name} {medicalNeed.profile?.last_name}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>${medicalNeed.amount_raised} of ${medicalNeed.amount_needed}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <form onSubmit={handleDonate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Donation Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message of support"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="anonymous">Make donation anonymous</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Make Donation"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpNow;