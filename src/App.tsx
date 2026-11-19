import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const TestimoniesPage = lazy(() => import("./pages/TestimoniesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-[50svh]" aria-label="Loading page" />}><Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/testimonies" element={<TestimoniesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes></Suspense>
        </BrowserRouter>
      </MotionConfig>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
