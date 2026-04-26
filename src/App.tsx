import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { PageShell } from "@/components/layout/PageShell";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Vastu from "./pages/Vastu";
import VastuReport from "./pages/VastuReport";
import Numerology from "./pages/Numerology";
import NumerologyReport from "./pages/NumerologyReport";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseDetail from "./pages/CourseDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PageShell>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/vastu" element={<Vastu />} />
              <Route path="/vastu/report" element={<VastuReport />} />
              <Route path="/numerology" element={<Numerology />} />
              <Route path="/numerology/report" element={<NumerologyReport />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/checkout/:slug" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageShell>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
