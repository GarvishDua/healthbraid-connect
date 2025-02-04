import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const AppointmentBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select(`
          *,
          hospitals (
            name,
            location
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const { data: availability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["availability", selectedDoctor, selectedDate],
    enabled: !!selectedDoctor && !!selectedDate,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", selectedDoctor)
        .eq("date", format(selectedDate!, "yyyy-MM-dd"))
        .maybeSingle(); // Changed from .single() to .maybeSingle()
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const bookAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const doctor = doctors?.find(d => d.id === selectedDoctor);
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          doctor_id: selectedDoctor,
          hospital_id: doctor?.hospital_id,
          appointment_date: format(selectedDate, "yyyy-MM-dd"),
          appointment_time: selectedTime,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      // Reset selection
      setSelectedDate(undefined);
      setSelectedDoctor(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    }
  };

  if (isLoadingHospitals || isLoadingDoctors) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
            <div className="space-y-4">
              {doctors?.map((doctor) => (
                <Card 
                  key={doctor.id}
                  className={`cursor-pointer transition-colors ${
                    selectedDoctor === doctor.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Specialty: {doctor.specialty}</p>
                    <p className="text-sm text-gray-600">Hospital: {doctor.hospitals?.name}</p>
                    <p className="text-sm text-gray-600">Location: {doctor.hospitals?.location}</p>
                    <p className="text-sm font-semibold mt-2">
                      Consultation Fee: ${doctor.consultation_fee}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="mb-4"
                />

                {selectedDate && selectedDoctor && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Available Time Slots</h3>
                    {isLoadingAvailability ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : availability?.time_slots ? (
                      <div className="grid grid-cols-3 gap-2">
                        {(availability.time_slots as string[]).map((time: string) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No available slots for this date</p>
                    )}
                  </div>
                )}

                <Button
                  className="w-full mt-6"
                  disabled={!selectedDate || !selectedDoctor || !selectedTime}
                  onClick={bookAppointment}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;