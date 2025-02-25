
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, PiggyBank, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const MonetaryDonations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Monetary Donations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your financial support can make a significant difference in someone's healthcare journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>One-Time Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Make a single contribution to directly support medical needs.
              </p>
              <Button asChild className="w-full">
                <Link to="/find-help">Browse Medical Needs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Most Popular
            </div>
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Monthly Giving Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Join our community of monthly donors and unlock exclusive benefits with different tiers.
              </p>
              <Button asChild variant="default" className="w-full">
                <Link to="/monthly-giving">Start Monthly Giving</Link>
              </Button>
              <div className="mt-4 text-sm text-gray-500">
                <p>Benefits include:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Recognition badges</li>
                  <li>Exclusive events</li>
                  <li>Impact reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <PiggyBank className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle>Medical Fund</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Contribute to our general medical fund to help multiple patients.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/medical-fund">Support Medical Fund</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonetaryDonations;
