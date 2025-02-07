
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Heart, Users, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const MedicalNeedDetails = () => {
  const { needId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{medicalNeed.title}</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm ${
                medicalNeed.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                medicalNeed.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                medicalNeed.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {medicalNeed.urgency}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-600">{medicalNeed.description}</p>

              <div className="flex items-center">
                {medicalNeed.profile?.avatar_url ? (
                  <img 
                    src={medicalNeed.profile.avatar_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {medicalNeed.profile?.first_name} {medicalNeed.profile?.last_name}
                  </div>
                  <div className="text-sm text-gray-500">Requester</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{medicalNeed.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount needed:</span>
                  <span className="font-medium">${medicalNeed.amount_needed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount raised:</span>
                  <span className="font-medium">${medicalNeed.amount_raised}</span>
                </div>

                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-sm text-gray-500 text-center">
                    {progressPercentage.toFixed(1)}% of goal reached
                  </div>
                </div>

                {medicalNeed.medical_proof_url && (
                  <div className="space-y-2">
                    <div className="font-medium">Medical Proof</div>
                    <img 
                      src={medicalNeed.medical_proof_url} 
                      alt="Medical Proof" 
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                <Button className="w-full" asChild>
                  <Link to={`/need/${needId}/donate`}>
                    <Heart className="h-4 w-4 mr-2" />
                    Help Now
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalNeedDetails;
