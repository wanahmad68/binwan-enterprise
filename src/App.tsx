import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import CargoOptimizer from './pages/CargoOptimizer';
import LoadingPlan from './pages/LoadingPlan';
import DataManager from './pages/DataManager';
import InvoiceBilling from './pages/InvoiceBilling';
import DailyTripForm from './pages/DailyTripForm';
import Reports from './pages/Reports';
import TotalDieselAdded from './pages/reports/TotalDieselAdded';
import DieselConsumption from './pages/reports/DieselConsumption';
import TotalPaidToll from './pages/reports/TotalPaidToll';
import DailyMealCosts from './pages/reports/DailyMealCosts';
import TotalMaintenanceCost from './pages/reports/TotalMaintenanceCost';
import MonthlyReport from './pages/reports/MonthlyReport';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data-manager" element={<DataManager />} />
          <Route path="/invoice-billing" element={<InvoiceBilling />} />
          <Route path="/daily-trip-form" element={<DailyTripForm />} />
          <Route path="/cargo-optimizer" element={<CargoOptimizer />} />
          <Route path="/loading-plan" element={<LoadingPlan />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/total-diesel-added" element={<TotalDieselAdded />} />
          <Route path="/reports/diesel-consumption" element={<DieselConsumption />} />
          <Route path="/reports/total-paid-toll" element={<TotalPaidToll />} />
          <Route path="/reports/daily-meal-costs" element={<DailyMealCosts />} />
          <Route path="/reports/total-maintenance-cost" element={<TotalMaintenanceCost />} />
          <Route path="/reports/monthly-report" element={<MonthlyReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
