import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateNeed from "./pages/CreateNeed";
import FindHelp from "./pages/FindHelp";
import GiveHelp from "./pages/GiveHelp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import HelpNow from "./pages/HelpNow";
import AIAssistant from "./pages/AIAssistant";
import VolunteerLocally from "./pages/VolunteerLocally";
import OrganizeFundraisers from "./pages/OrganizeFundraisers";
import MedicalStore from "./pages/MedicalStore";
import AppointmentBooking from "./pages/AppointmentBooking";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create-need" element={<CreateNeed />} />
              <Route path="/find-help" element={<FindHelp />} />
              <Route path="/give-help" element={<GiveHelp />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/need/:needId/donate" element={<HelpNow />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/volunteer" element={<VolunteerLocally />} />
              <Route path="/create-fundraiser" element={<OrganizeFundraisers />} />
              <Route path="/medical-store" element={<MedicalStore />} />
              <Route path="/book-appointment" element={<AppointmentBooking />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;