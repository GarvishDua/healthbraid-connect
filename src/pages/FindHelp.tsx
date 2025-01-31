import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FindHelp = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: medicalNeeds, isLoading } = useQuery({
    queryKey: ['medicalNeeds'],
    queryFn: async () => {
      const { data: needs, error } = await supabase
        .from('medical_needs')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return needs;
    },
  });

  const filteredNeeds = medicalNeeds?.filter(need =>
    need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    need.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Medical Help</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through medical needs in your area and help make a difference in someone's life.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="flex gap-4">
            <Input
              placeholder="Search by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Loading medical needs...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNeeds?.map((need) => (
              <Card key={need.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{need.title}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      need.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                      need.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      need.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {need.urgency}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{need.description}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{need.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount needed:</span>
                      <span className="font-medium">${need.amount_needed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount raised:</span>
                      <span className="font-medium">${need.amount_raised}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min((need.amount_raised / need.amount_needed) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to={`/need/${need.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindHelp;