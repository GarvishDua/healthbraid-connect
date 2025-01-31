import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const GiveHelp = () => {
  const ways = [
    {
      title: "Make a Donation",
      description: "Support medical needs directly through secure donations. Every contribution makes a difference.",
      icon: Heart,
      link: "/find-help",
      buttonText: "Browse Medical Needs"
    },
    {
      title: "Volunteer Locally",
      description: "Help patients in your area with transportation, care support, or other assistance.",
      icon: MapPin,
      link: "/volunteer",
      buttonText: "Find Opportunities"
    },
    {
      title: "Organize Fundraisers",
      description: "Create and manage fundraising events to support medical needs in your community.",
      icon: Calendar,
      link: "/create-fundraiser",
      buttonText: "Start Fundraising"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ways to Give Help</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to contribute to making healthcare accessible for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ways.map((way) => (
            <Card key={way.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                  <way.icon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-xl">{way.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{way.description}</p>
                <Button className="w-full" asChild>
                  <Link to={way.link}>{way.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Medical Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you're facing medical expenses that you can't afford, we're here to help.
            Create a medical need and connect with donors who want to support you.
          </p>
          <Button size="lg" asChild>
            <Link to="/create-need">Create Medical Need</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiveHelp;