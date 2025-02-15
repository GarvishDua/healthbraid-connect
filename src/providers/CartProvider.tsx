
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  id: string;
  medicine_id: string;
  quantity: number;
  medicine: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

type CartContextType = {
  items: CartItem[];
  addItem: (medicineId: string) => Promise<void>;
  removeItem: (medicineId: string) => Promise<void>;
  updateQuantity: (medicineId: string, quantity: number) => Promise<void>;
  total: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          medicine_id,
          quantity,
          medicine:medicines (
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const typedData = (data || []).map((item: any) => ({
        id: item.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        medicine: {
          name: item.medicine.name,
          price: item.medicine.price,
          image_url: item.medicine.image_url,
        },
      }));
      
      setItems(typedData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (medicineId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if the item exists in the cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('medicine_id', medicineId)
        .single();

      if (existingItem) {
        // If item exists, update the quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', user.id)
          .eq('medicine_id', medicineId);

        if (updateError) throw updateError;
      } else {
        // If item doesn't exist, insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            medicine_id: medicineId,
            quantity: 1
          });

        if (insertError) throw insertError;
      }

      await fetchCart();
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (medicineId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('medicine_id', medicineId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (medicineId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeItem(medicineId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('medicine_id', medicineId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + (item.medicine.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      total,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
