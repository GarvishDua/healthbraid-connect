
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const BloodCenters = () => {
  const { user } = useAuth();

  const { data: centers, isLoading } = useQuery({
    queryKey: ["bloodCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_centers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donation Centers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find a blood donation center near you and help save lives.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {centers?.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{center.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-gray-600">{center.address}</p>
                        <p className="text-gray-600">{center.city}, {center.state} {center.zip_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <p className="text-gray-600">{center.phone}</p>
                    </div>
                    {center.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <p className="text-gray-600">{center.email}</p>
                      </div>
                    )}
                    {center.operating_hours && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          {Object.entries(center.operating_hours as Record<string, string>).map(([day, hours]) => (
                            <p key={day} className="text-gray-600">
                              <span className="font-medium">{day}:</span> {hours}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button 
                      asChild 
                      className="w-full mt-4"
                      variant={center.accepting_donations ? "default" : "secondary"}
                      disabled={!center.accepting_donations}
                    >
                      <Link 
                        to={user ? `/schedule-blood-donation?center=${center.id}` : "/auth"}
                        className="w-full"
                      >
                        {center.accepting_donations 
                          ? "Schedule Donation" 
                          : "Currently Not Accepting Donations"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodCenters;
