import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { label: "Medical Needs Funded", value: "1,000+" },
    { label: "Total Donations", value: "$2M+" },
    { label: "Active Donors", value: "5,000+" },
    { label: "Success Rate", value: "95%" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe everyone deserves access to quality healthcare, regardless of their financial situation."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Building a network of donors, healthcare providers, and volunteers to support those in need."
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Every donation is tracked and verified to ensure it reaches those who need it most."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Making healthcare accessible to communities around the world through our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HealthBridge</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bridging the gap between those in need of medical care and those who want to help.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of donors and healthcare providers helping those in need.
            Every contribution brings us closer to making healthcare accessible for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/find-help">Browse Medical Needs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/create-need">Create Medical Need</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;