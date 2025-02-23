import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { format } from "date-fns";
import { Calendar, Clock, DropletIcon } from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegularDonor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBloodType, setSelectedBloodType] = useState<string>();

  const { data: donorProfile } = useQuery({
    queryKey: ["regularDonor", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regular_donors")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    }
  });

  const { data: appointments } = useQuery({
    queryKey: ["bloodDonationAppointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_donation_appointments")
        .select(`
          *,
          blood_centers (
            name,
            address,
            city,
            state
          )
        `)
        .eq("user_id", user?.id)
        .order("appointment_date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const becomeDonorMutation = useMutation({
    mutationFn: async () => {
      if (!selectedBloodType || !user) {
        throw new Error("Please select your blood type");
      }

      const { error } = await supabase
        .from("regular_donors")
        .insert({
          user_id: user.id,
          blood_type: selectedBloodType,
          status: "active"
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Regular Donor Program!",
        description: "Your profile has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["regularDonor"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Regular Donor Program</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {donorProfile 
              ? "Thank you for being a regular blood donor!"
              : "Join our regular donor program and help save lives regularly."}
          </p>
        </div>

        {donorProfile ? (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Donor Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <DropletIcon className="h-5 w-5 text-primary" />
                  <span className="font-medium">Blood Type:</span> {donorProfile.blood_type}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Member Since:</span> {format(new Date(donorProfile.created_at), "MMMM d, yyyy")}
                </div>
                {donorProfile.last_donation_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">Last Donation:</span> {format(new Date(donorProfile.last_donation_date), "MMMM d, yyyy")}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="font-medium">Total Donations:</div>
                  <div className="bg-primary text-white px-3 py-1 rounded-full">
                    {donorProfile.donation_count || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments?.filter(apt => new Date(apt.appointment_date) > new Date()).map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{appointment.blood_centers.name}</h4>
                              <p className="text-sm text-gray-600">
                                {appointment.blood_centers.address}, {appointment.blood_centers.city}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {format(new Date(appointment.appointment_date), "MMMM d, yyyy")}
                              </div>
                              <div className="text-sm text-gray-600">
                                {format(new Date(appointment.appointment_date), "h:mm a")}
                              </div>
                            </div>
                          </div>
                          {appointment.special_notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              Note: {appointment.special_notes}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!appointments || appointments.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No upcoming appointments</p>
                      <Button asChild className="mt-4">
                        <Link to="/blood-centers">Schedule a Donation</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Become a Regular Donor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Your Blood Type</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {BLOOD_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant={selectedBloodType === type ? "default" : "outline"}
                      onClick={() => setSelectedBloodType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full"
                disabled={!selectedBloodType}
                onClick={() => becomeDonorMutation.mutate()}
              >
                Join Regular Donor Program
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegularDonor;
