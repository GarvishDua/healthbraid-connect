import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/providers/CartProvider";
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, isLoading } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (medicineId: string, currentQuantity: number, increment: boolean) => {
    try {
      const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
      if (newQuantity < 1) {
        await removeItem(medicineId);
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart",
        });
        return;
      }
      await updateQuantity(medicineId, newQuantity);
      toast({
        title: "Quantity updated",
        description: "The item quantity has been updated",
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (medicineId: string) => {
    try {
      await removeItem(medicineId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        
        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/medical-store")}>
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    {item.medicine.image_url ? (
                      <img
                        src={item.medicine.image_url}
                        alt={item.medicine.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.medicine.name}</h3>
                      <p className="text-gray-600">${item.medicine.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.medicine_id, item.quantity, false)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.medicine_id, item.quantity, true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item.medicine_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 h-fit">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/medical-store")}
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;