import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const HelpNow = () => {
  const { needId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: medicalNeed, isLoading } = useQuery({
    queryKey: ['medicalNeed', needId],
    queryFn: async () => {
      console.log('Fetching medical need details...');
      const { data: need, error } = await supabase
        .from('medical_needs')
        .select('*, profiles:user_id(first_name, last_name)')
        .eq('id', needId)
        .single();

      if (error) {
        console.error('Error fetching medical need:', error);
        throw error;
      }

      console.log('Medical need details:', need);
      return need;
    },
  });

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a donation.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_id: user.id,
          medical_need_id: needId,
          amount: parseFloat(amount),
          message: message || null,
          anonymous: isAnonymous,
        });

      if (error) throw error;

      toast({
        title: "Thank you for your donation!",
        description: "Your support means a lot to those in need.",
      });

      navigate(`/need/${needId}`);
    } catch (error: any) {
      toast({
        title: "Error making donation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!medicalNeed) {
    return <div className="text-center py-12">Medical need not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{medicalNeed.title}</h2>
              <p className="text-gray-600">{medicalNeed.description}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>${medicalNeed.amount_raised} of ${medicalNeed.amount_needed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((medicalNeed.amount_raised / medicalNeed.amount_needed) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleDonate} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Amount ($)
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message of support"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>

              <Button type="submit" className="w-full">
                Confirm Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpNow;