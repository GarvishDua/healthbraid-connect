
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Heart, Calendar, Shield, Trophy, Star, Gift, Award } from "lucide-react";
import { Link } from "react-router-dom";

const DONATION_TIERS = [
  {
    name: "Friend",
    amount: 25,
    benefits: [
      { icon: Heart, text: "Monthly impact report" },
      { icon: Calendar, text: "Newsletter subscription" },
    ],
  },
  {
    name: "Supporter",
    amount: 50,
    benefits: [
      { icon: Heart, text: "Monthly impact report" },
      { icon: Calendar, text: "Newsletter subscription" },
      { icon: Shield, text: "Donor recognition badge" },
    ],
  },
  {
    name: "Champion",
    amount: 100,
    benefits: [
      { icon: Heart, text: "Monthly impact report" },
      { icon: Calendar, text: "Newsletter subscription" },
      { icon: Shield, text: "Silver donor recognition badge" },
      { icon: Trophy, text: "Quarterly virtual meetups" },
      { icon: Gift, text: "Exclusive donor updates" },
    ],
  },
  {
    name: "Guardian",
    amount: 250,
    benefits: [
      { icon: Heart, text: "Monthly impact report" },
      { icon: Calendar, text: "Newsletter subscription" },
      { icon: Shield, text: "Gold donor recognition badge" },
      { icon: Trophy, text: "Monthly virtual meetups" },
      { icon: Gift, text: "Priority donor updates" },
      { icon: Star, text: "Annual appreciation event" },
    ],
  },
  {
    name: "Benefactor",
    amount: 500,
    benefits: [
      { icon: Heart, text: "Monthly impact report" },
      { icon: Calendar, text: "Newsletter subscription" },
      { icon: Shield, text: "Platinum donor recognition badge" },
      { icon: Trophy, text: "Monthly virtual meetups" },
      { icon: Gift, text: "VIP donor updates" },
      { icon: Star, text: "VIP appreciation events" },
      { icon: Award, text: "Personal impact coordinator" },
    ],
  },
];

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

  const getCurrentTier = (amount: number) => {
    return DONATION_TIERS.reduce((prev, current) => {
      return amount >= current.amount ? current : prev;
    }, DONATION_TIERS[0]);
  };

  const handleSubscribe = () => {
    const tier = getCurrentTier(selectedAmount);
    toast({
      title: `Thank you for becoming a ${tier.name}!`,
      description: `Your monthly donation of $${selectedAmount} will help save lives.`,
    });
  };

  const currentTier = getCurrentTier(selectedAmount);

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
            <Card className="mb-8">
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
                      {DONATION_TIERS.map((tier) => (
                        <div key={tier.amount}>
                          <RadioGroupItem
                            value={tier.amount.toString()}
                            id={`amount-${tier.amount}`}
                            className="peer hidden"
                          />
                          <Label
                            htmlFor={`amount-${tier.amount}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                          >
                            <span className="text-sm font-medium mb-1">{tier.name}</span>
                            <span className="text-2xl font-bold">${tier.amount}</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Your Benefits as a {currentTier.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                      <benefit.icon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-medium">{benefit.text}</p>
                    </div>
                  ))}
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
