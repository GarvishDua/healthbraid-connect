import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    id: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    phone: "",
    location: "",
    bio: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (profile) {
      setFormData(profile);
    }
  }, [profile, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile</CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={formData.first_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={formData.last_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
              {isEditing && (
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default Profile;