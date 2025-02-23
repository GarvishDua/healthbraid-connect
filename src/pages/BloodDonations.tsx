
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, MapPin, CalendarDays, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const BloodDonations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch blood centers count
  const { data: centerCount } = useQuery({
    queryKey: ["bloodCentersCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("blood_centers")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch if user is a regular donor
  const { data: isRegularDonor } = useQuery({
    queryKey: ["regularDonor", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regular_donors")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save lives by donating blood. Every donation can help up to three people in need.
          </p>
          {!user && (
            <Button asChild className="mt-6">
              <Link to="/auth">Sign in to Start Donating</Link>
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Find Donation Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {centerCount 
                  ? `Browse our network of ${centerCount} blood donation centers and mobile blood drives near you.`
                  : "Locate blood donation centers and mobile blood drives near you."}
              </p>
              <Button asChild className="w-full">
                <Link to="/blood-centers">Find Centers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <CalendarDays className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Schedule Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Book an appointment for your next blood donation at a center near you.
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to schedule a blood donation.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Link to={user ? "/schedule-blood-donation" : "/auth"}>
                  Schedule Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Regular Donor Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {isRegularDonor 
                  ? "You're part of our regular donor program. Thank you for your commitment!"
                  : "Join our regular donor program and help maintain blood supplies."}
              </p>
              {user ? (
                <Button 
                  asChild 
                  variant={isRegularDonor ? "secondary" : "outline"} 
                  className="w-full"
                >
                  <Link to="/regular-donor">
                    {isRegularDonor ? "View Donor Profile" : "Become Regular Donor"}
                  </Link>
                </Button>
              ) : (
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                >
                  <Link to="/auth">Sign in to Join</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Donate Blood?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <Droplet className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Save Lives</h3>
              <p className="text-gray-600">One donation can save up to three lives.</p>
            </div>
            <div>
              <CalendarDays className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Regular Need</h3>
              <p className="text-gray-600">Blood is needed every 2 seconds.</p>
            </div>
            <div>
              <UserPlus className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quick Process</h3>
              <p className="text-gray-600">Donation takes only 10-12 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonations;
