
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
];

const ScheduleBloodDonation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const centerId = searchParams.get("center");
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bloodType, setBloodType] = useState<string>("");
  const [specialNotes, setSpecialNotes] = useState("");

  const { data: center } = useQuery({
    queryKey: ["bloodCenter", centerId],
    enabled: !!centerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_centers")
        .select("*")
        .eq("id", centerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTime || !user || !centerId) {
        throw new Error("Missing required fields");
      }

      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const { error } = await supabase
        .from("blood_donation_appointments")
        .insert({
          user_id: user.id,
          center_id: centerId,
          appointment_date: appointmentDate.toISOString(),
          blood_type: bloodType || null,
          special_notes: specialNotes || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Scheduled",
        description: "Your blood donation appointment has been scheduled successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["bloodDonationAppointments"] });
      navigate("/regular-donor");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (!center) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Center Not Found</h1>
          <Button asChild>
            <Link to="/blood-centers">Return to Centers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule Blood Donation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule your appointment at {center.name}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Select Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Blood Type (Optional)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {BLOOD_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant={bloodType === type ? "default" : "outline"}
                      onClick={() => setBloodType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Special Notes (Optional)</Label>
                <Textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Any medical conditions or special requirements..."
                  className="mt-2"
                />
              </div>

              <Button
                className="w-full"
                disabled={!selectedDate || !selectedTime}
                onClick={() => scheduleMutation.mutate()}
              >
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBloodDonation;
