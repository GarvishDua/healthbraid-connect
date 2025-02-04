import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface DoctorSelectionProps {
  doctors: (Tables<"doctors"> & {
    hospitals: Tables<"hospitals"> | null;
  })[] | undefined;
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string) => void;
}

export const DoctorSelection = ({
  doctors,
  selectedDoctor,
  onSelectDoctor,
}: DoctorSelectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
      <div className="space-y-4">
        {doctors?.map((doctor) => (
          <Card
            key={doctor.id}
            className={`cursor-pointer transition-colors ${
              selectedDoctor === doctor.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Specialty: {doctor.specialty}</p>
              <p className="text-sm text-gray-600">
                Hospital: {doctor.hospitals?.name}
              </p>
              <p className="text-sm text-gray-600">
                Location: {doctor.hospitals?.location}
              </p>
              <p className="text-sm font-semibold mt-2">
                Consultation Fee: ${doctor.consultation_fee}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};