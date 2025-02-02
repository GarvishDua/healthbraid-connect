import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Gift, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrganizeFundraisers = () => {
  const { toast } = useToast();

  const handleCreateFundraiser = () => {
    toast({
      title: "Coming Soon",
      description: "Fundraiser creation will be available soon. Thank you for your interest!",
    });
  };

  const fundraiserTypes = [
    {
      title: "Community Events",
      description: "Organize local events like walks, runs, or community gatherings to raise funds.",
      icon: Users,
      examples: ["Charity Walks", "Sports Tournaments", "Community Fairs"]
    },
    {
      title: "Virtual Fundraisers",
      description: "Create online fundraising campaigns and virtual events for broader reach.",
      icon: Calendar,
      examples: ["Live Streams", "Online Auctions", "Virtual Concerts"]
    },
    {
      title: "Donation Drives",
      description: "Coordinate targeted donation campaigns for specific medical needs.",
      icon: Gift,
      examples: ["Medical Equipment", "Medicine Support", "Treatment Funds"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organize Fundraisers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create meaningful fundraising events to support medical needs in your community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {fundraiserTypes.map((type) => (
            <Card key={type.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                  <type.icon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2">
                  <p className="font-medium text-sm text-gray-700">Popular formats:</p>
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    {type.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
                <Button onClick={handleCreateFundraiser} className="w-full mt-6">
                  Start Planning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start your fundraising journey today and help make healthcare accessible for those in need.
          </p>
          <Button size="lg" onClick={handleCreateFundraiser}>
            Create Fundraiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizeFundraisers;