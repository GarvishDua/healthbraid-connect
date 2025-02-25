
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Heart, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const DONATION_AMOUNTS = [25, 50, 100, 250, 500];

const MonthlyGiving = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value));
    }
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscription initiated",
      description: `Your monthly donation of $${selectedAmount} is being processed.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Monthly Giving Program</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of monthly donors and make a lasting impact on healthcare accessibility.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Monthly Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <RadioGroup
                    defaultValue={selectedAmount.toString()}
                    onValueChange={(value) => {
                      setSelectedAmount(parseInt(value));
                      setCustomAmount("");
                    }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {DONATION_AMOUNTS.map((amount) => (
                        <div key={amount}>
                          <RadioGroupItem
                            value={amount.toString()}
                            id={`amount-${amount}`}
                            className="peer hidden"
                          />
                          <Label
                            htmlFor={`amount-${amount}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                          >
                            <span className="text-2xl font-bold">${amount}</span>
                            <span className="text-sm text-muted-foreground">per month</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="custom-amount">Custom Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="custom-amount"
                        type="text"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSubscribe} className="w-full" size="lg">
                    Subscribe Monthly <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Give Monthly?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-primary mt-1" />
                  <p className="text-sm">Provide consistent support to those in need of medical care</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <p className="text-sm">Convenient automatic monthly contributions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <p className="text-sm">100% of your donation goes directly to medical care</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">
                  Need help? Contact our donor support team at{" "}
                  <a href="mailto:support@example.com" className="text-primary hover:underline">
                    support@example.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Prefer to make a one-time donation?{" "}
            <Link to="/monetary-donations" className="text-primary hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyGiving;
