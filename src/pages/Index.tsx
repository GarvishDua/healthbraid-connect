import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Search, Calendar, Plus, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

// Helper function to determine urgency color
const getUrgencyColor = (urgency: string) => {
  switch (urgency.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const { data: medicalNeeds, isLoading: isLoadingNeeds } = useQuery({
    queryKey: ['medicalNeeds'],
    queryFn: async () => {
      console.log('Fetching medical needs...');
      const { data: needs, error: needsError } = await supabase
        .from('medical_needs')
        .select('*')
        .order('created_at', { ascending: false });

      if (needsError) {
        console.error('Error fetching medical needs:', needsError);
        throw needsError;
      }

      const userIds = needs?.map(need => need.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      const needsWithProfiles = needs?.map(need => ({
        ...need,
        profile: profiles?.find(profile => profile.id === need.user_id)
      }));

      console.log('Medical needs with profiles:', needsWithProfiles);
      return needsWithProfiles;
    },
  });

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
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Bridging the Gap in
          <span className="text-primary-600"> Healthcare Access</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with donors, NGOs, and healthcare providers to receive the medical care you deserve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button size="lg" asChild>
              <Link to="/create-need">
                <Plus className="mr-2 h-5 w-5" /> Post Medical Need
              </Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/auth">
                <Search className="mr-2 h-5 w-5" /> Get Started
              </Link>
            </Button>
          )}
          <Button size="lg" variant="outline" asChild>
            <Link to="/give-help">
              <Heart className="mr-2 h-5 w-5" /> Give Help
            </Link>
          </Button>
        </div>
      </section>

      {/* AI Health Assistant Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Health Assistant</h2>
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
      </section>

      {/* Medical Needs Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Current Medical Needs</h2>
            <Button asChild>
              <Link to="/find-help">View All Needs</Link>
            </Button>
          </div>
          
          {isLoadingNeeds ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading medical needs...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {medicalNeeds?.slice(0, 6).map((need) => (
                <Card key={need.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{need.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{need.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Posted {new Date(need.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <Badge className={`${getUrgencyColor(need.urgency)}`}>
                        {need.urgency}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-3 mb-4">{need.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          ${need.amount_raised.toLocaleString()} of ${need.amount_needed.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(need.amount_raised / need.amount_needed) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                          {need.profile?.avatar_url ? (
                            <img 
                              src={need.profile.avatar_url} 
                              alt="Profile" 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                              <Users className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <span className="text-sm text-gray-600">
                            {need.profile?.first_name} {need.profile?.last_name}
                          </span>
                        </div>
                        <Button asChild>
                          <Link to={`/need/${need.id}`}>
                            <Heart className="mr-2 h-4 w-4" /> Help Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How HealthBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Register and connect with verified healthcare providers and donors in your area.
              </p>
            </Card>
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule</h3>
              <p className="text-gray-600">
                Book appointments with healthcare providers and track your medical journey.
              </p>
            </Card>
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Care</h3>
              <p className="text-gray-600">
                Get the medical care you need through our network of verified providers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join our community of donors and healthcare providers helping those in need.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-primary-600 hover:bg-gray-100">
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;