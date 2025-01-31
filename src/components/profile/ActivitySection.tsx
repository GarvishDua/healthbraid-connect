import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ActivitySection = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Activity</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Medical Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/create-need">Create New Medical Need</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/find-help">Browse Medical Needs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};