import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const MedicalStore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [manualOrder, setManualOrder] = useState({
    medicines: "",
    quantity: "",
    address: "",
  });

  const handlePrescriptionUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!prescriptionFile) {
      toast({
        title: "Error",
        description: "Please upload a prescription",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = prescriptionFile.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("prescriptions")
        .upload(filePath, prescriptionFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("prescriptions").insert({
        user_id: user.id,
        prescription_url: filePath,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Prescription uploaded successfully. We'll verify and process your order soon.",
      });
      setPrescriptionFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("medicine_orders").insert({
        user_id: user.id,
        medicine_details: {
          medicines: manualOrder.medicines,
          quantity: manualOrder.quantity,
        },
        delivery_address: manualOrder.address,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order placed successfully",
      });
      setManualOrder({ medicines: "", quantity: "", address: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Medical Store</h1>
            <p className="mb-4">Please login to access the medical store</p>
            <Button onClick={() => navigate("/auth")}>Login</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Medical Store</h1>
          <Tabs defaultValue="prescription">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescription">Upload Prescription</TabsTrigger>
              <TabsTrigger value="manual">Manual Order</TabsTrigger>
            </TabsList>

            <TabsContent value="prescription">
              <form onSubmit={handlePrescriptionUpload} className="space-y-6">
                <div>
                  <Label htmlFor="prescription">Upload Prescription</Label>
                  <Input
                    id="prescription"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload Prescription"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="manual">
              <form onSubmit={handleManualOrder} className="space-y-6">
                <div>
                  <Label htmlFor="medicines">Medicine Names</Label>
                  <Textarea
                    id="medicines"
                    required
                    value={manualOrder.medicines}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, medicines: e.target.value })
                    }
                    placeholder="Enter medicine names (one per line)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    required
                    value={manualOrder.quantity}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, quantity: e.target.value })
                    }
                    placeholder="Enter quantity needed"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    required
                    value={manualOrder.address}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, address: e.target.value })
                    }
                    placeholder="Enter your delivery address"
                    className="mt-2"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default MedicalStore;