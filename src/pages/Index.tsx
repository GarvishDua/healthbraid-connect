import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Search, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: medicalNeeds, isLoading } = useQuery({
    queryKey: ['medicalNeeds'],
    queryFn: async () => {
      console.log('Fetching medical needs...');
      const { data: needs, error } = await supabase
        .from('medical_needs')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', 'profiles.id')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medical needs:', error);
        throw error;
      }

      console.log('Medical needs with profiles:', needs);
      return needs;
    },
  });

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

      {/* Medical Needs Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Current Medical Needs</h2>
          {isLoading ? (
            <div className="text-center">Loading medical needs...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {medicalNeeds?.map((need) => (
                <Card key={need.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{need.title}</h3>
                      <p className="text-gray-600 line-clamp-3">{need.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      need.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                      need.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      need.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {need.urgency}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount needed:</span>
                      <span className="font-semibold">${need.amount_needed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount raised:</span>
                      <span className="font-semibold">${need.amount_raised}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min((need.amount_raised / need.amount_needed) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to={`/need/${need.id}`}>
                        <Heart className="mr-2 h-4 w-4" /> Help Now
                      </Link>
                    </Button>
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