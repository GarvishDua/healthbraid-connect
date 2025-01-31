import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  initialData: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    location: string | null;
    bio: string | null;
  };
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        .eq('id', formData.id);

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

  return (
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
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
        {isEditing && (
          <Button type="submit">
            Save Changes
          </Button>
        )}
      </div>
    </form>
  );
};