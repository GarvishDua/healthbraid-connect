
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Info, ClipboardList, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const OrganDonations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organ Donations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn about organ donation and how you can help save lives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Learn About Organ Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Understand the organ donation process and its impact.
              </p>
              <Button asChild className="w-full">
                <Link to="/organ-donation-info">Learn More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Register as Donor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Sign up to become an organ donor and save lives.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register-organ-donor">Register Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Speak to a Coordinator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Get in touch with our organ donation coordinators for guidance.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/organ-coordinator">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganDonations;
