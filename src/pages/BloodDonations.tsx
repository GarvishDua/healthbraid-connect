
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, MapPin, CalendarDays, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const BloodDonations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save lives by donating blood. Every donation can help up to three people in need.
          </p>
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
                Locate blood donation centers and mobile blood drives near you.
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
                Book an appointment for your next blood donation.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/schedule-blood-donation">Schedule Now</Link>
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
                Join our regular donor program and help maintain blood supplies.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/regular-donor">Become Regular Donor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodDonations;
