import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import React, { Suspense, lazy } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const PricingDashboard = lazy(() => import("./pages/Pricing.tsx"));
const ServicesPage = lazy(() => import("./pages/Services.tsx"));
const InsightsPage = lazy(() => import("./pages/Insights.tsx"));
const AuraIQ = lazy(() => import("./pages/AuraIQ.tsx"));
const GapTuber = lazy(() => import("./pages/GapTuber.tsx"));
const Visioscript = lazy(() => import("./pages/Visioscript.tsx"));
const BusinessZip = lazy(() => import("./pages/BusinessZip.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<PricingDashboard />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/auraiq" element={<AuraIQ />} />
            <Route path="/gaptuber" element={<GapTuber />} />
            <Route path="/visioscript" element={<Visioscript />} />
            <Route path="/businesszip" element={<BusinessZip />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
