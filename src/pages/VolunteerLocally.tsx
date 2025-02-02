import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VolunteerLocally = () => {
  const { toast } = useToast();

  const handleVolunteerSignup = () => {
    toast({
      title: "Coming Soon",
      description: "Volunteer registration will be available soon. Thank you for your interest!",
    });
  };

  const opportunities = [
    {
      title: "Patient Transportation",
      description: "Help patients get to their medical appointments safely and on time.",
      commitment: "4-8 hours/week",
      location: "Your local area",
      icon: Users
    },
    {
      title: "Care Support",
      description: "Assist patients with daily activities and provide companionship.",
      commitment: "6-12 hours/week",
      location: "Various locations",
      icon: Clock
    },
    {
      title: "Local Coordination",
      description: "Help coordinate local support activities and volunteer teams.",
      commitment: "8-10 hours/week",
      location: "Community centers",
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make a difference in your community by volunteering your time and skills to help those in need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                  <opportunity.icon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-xl">{opportunity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {opportunity.commitment}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {opportunity.location}
                  </p>
                </div>
                <Button onClick={handleVolunteerSignup} className="w-full mt-4">
                  Sign Up
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our network of volunteers and help make healthcare accessible for everyone in your community.
          </p>
          <Button size="lg" onClick={handleVolunteerSignup}>
            Become a Volunteer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerLocally;