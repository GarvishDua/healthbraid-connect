import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";

interface TimeSlotSelectionProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  availability: { time_slots: string[] } | null;
  isLoadingAvailability: boolean;
  onBookAppointment: () => void;
}

export const TimeSlotSelection = ({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  availability,
  isLoadingAvailability,
  onBookAppointment,
}: TimeSlotSelectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
      <Card>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) => date < new Date()}
            className="mb-4"
          />

          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Available Time Slots</h3>
              {isLoadingAvailability ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : availability?.time_slots ? (
                <div className="grid grid-cols-3 gap-2">
                  {availability.time_slots.map((time: string) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => onSelectTime(time)}
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
            disabled={!selectedDate || !selectedTime}
            onClick={onBookAppointment}
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};