import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FindHelp = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: medicalNeeds, isLoading } = useQuery({
    queryKey: ['medicalNeeds'],
    queryFn: async () => {
      console.log('Fetching medical needs...');
      // First, fetch all medical needs
      const { data: needs, error: needsError } = await supabase
        .from('medical_needs')
        .select('*')
        .order('created_at', { ascending: false });

      if (needsError) {
        console.error('Error fetching medical needs:', needsError);
        throw needsError;
      }

      // Then, fetch all associated profiles
      const userIds = needs?.map(need => need.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      const needsWithProfiles = needs?.map(need => ({
        ...need,
        profile: profiles?.find(profile => profile.id === need.user_id)
      }));

      console.log('Medical needs with profiles:', needsWithProfiles);
      return needsWithProfiles;
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
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center">
                        {need.profile?.avatar_url ? (
                          <img 
                            src={need.profile.avatar_url} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm text-gray-600">
                          {need.profile?.first_name} {need.profile?.last_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/need/${need.id}`}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button className="flex-1" asChild>
                        <Link to={`/need/${need.id}/donate`}>
                          <Heart className="h-4 w-4 mr-2" />
                          Help Now
                        </Link>
                      </Button>
                    </div>
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