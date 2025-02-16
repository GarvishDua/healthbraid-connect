import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Search, Calendar, Plus, MapPin, Clock, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/providers/CartProvider";

const getUrgencyColor = (urgency: string) => {
  switch (urgency.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();

  const { data: medicalNeeds, isLoading: isLoadingNeeds } = useQuery({
    queryKey: ['medicalNeeds'],
    queryFn: async () => {
      console.log('Fetching medical needs...');
      const { data: needs, error: needsError } = await supabase
        .from('medical_needs')
        .select('*')
        .order('created_at', { ascending: false });

      if (needsError) {
        console.error('Error fetching medical needs:', needsError);
        throw needsError;
      }

      const userIds = needs?.map(need => need.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      const needsWithProfiles = needs?.map(need => ({
        ...need,
        profile: profiles?.find(profile => profile.id === need.user_id)
      }));

      console.log('Medical needs with profiles:', needsWithProfiles);
      return needsWithProfiles;
    },
  });

  const { data: medicines, isLoading: isLoadingMedicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = async (medicineId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await addItem(medicineId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navigation />
      
      <section className="pt-10 md:pt-20 pb-16 md:pb-32 px-4 text-center">
        <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
          Bridging the Gap in
          <span className="text-primary-600"> Healthcare Access</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Connect with donors, NGOs, and healthcare providers to receive the medical care you deserve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          {user ? (
            <>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/create-need">
                  <Plus className="mr-2 h-5 w-5" /> Post Medical Need
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/ai-assistant">
                  <Search className="mr-2 h-5 w-5" /> AI Health Assistant
                </Link>
              </Button>
            </>
          ) : (
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/auth">
                <Search className="mr-2 h-5 w-5" /> Sign In to Get Started
              </Link>
            </Button>
          )}
        </div>
      </section>

      {user && (
        <section className="py-12 md:py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center sm:text-left">Current Medical Needs</h2>
              <Button asChild>
                <Link to="/find-help">View All Needs</Link>
              </Button>
            </div>
            
            {isLoadingNeeds ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading medical needs...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicalNeeds?.slice(0, 6).map((need) => (
                  <Card key={need.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold mb-2">{need.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{need.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>Posted {new Date(need.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={`${getUrgencyColor(need.urgency)} whitespace-nowrap`}>
                          {need.urgency}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-3 mb-4 text-sm md:text-base">{need.description}</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">
                            ${need.amount_raised.toLocaleString()} of ${need.amount_needed.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={(need.amount_raised / need.amount_needed) * 100} 
                          className="h-2"
                        />
                        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                          <div className="flex items-center">
                            {need.profile?.avatar_url ? (
                              <img 
                                src={need.profile.avatar_url} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <Users className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                            <span className="text-sm text-gray-600">
                              {need.profile?.first_name} {need.profile?.last_name}
                            </span>
                          </div>
                          <Button asChild size="sm">
                            <Link to={`/need/${need.id}/donate`}>
                              <Heart className="mr-2 h-4 w-4" /> Help Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center sm:text-left">Medical Store</h2>
            <Button asChild>
              <Link to="/medical-store">View All Products</Link>
            </Button>
          </div>

          {isLoadingMedicines ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {medicines?.slice(0, 4).map((medicine) => (
                <Card key={medicine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    {medicine.image_url ? (
                      <img
                        src={medicine.image_url}
                        alt={medicine.name}
                        className="w-full h-36 md:h-48 object-cover rounded-md mb-4"
                      />
                    ) : (
                      <div className="w-full h-36 md:h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold line-clamp-1">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{medicine.description}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-lg font-bold">${medicine.price}</span>
                        <Badge variant={medicine.in_stock ? "default" : "secondary"}>
                          {medicine.in_stock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => handleAddToCart(medicine.id)}
                        disabled={!medicine.in_stock}
                        className="w-full mt-2"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">How HealthBridge Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Register and connect with verified healthcare providers and donors in your area.
              </p>
            </Card>
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule</h3>
              <p className="text-gray-600">
                Book appointments with healthcare providers and track your medical journey.
              </p>
            </Card>
            <Card className="p-6">
              <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Care</h3>
              <p className="text-gray-600">
                Get the medical care you need through our network of verified providers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8">
            {user 
              ? "Create a medical need or help others in our community."
              : "Join our community of donors and healthcare providers helping those in need."
            }
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="bg-white text-primary-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                <Link to="/create-need">
                  <Plus className="mr-2 h-5 w-5" /> Create Medical Need
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto"
              >
                <Link to="/find-help">
                  <Heart className="mr-2 h-5 w-5" /> Help Others
                </Link>
              </Button>
            </div>
          ) : (
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="bg-white text-primary-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              <Link to="/auth">Get Started Today</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
