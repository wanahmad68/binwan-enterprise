import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  startMileage: string;
  endMileage: string;
  dieselAddedRM: string;
  dieselAddedLitre: string;
  tollPaidRM: string;
  mealsRM: string;
  maintenanceCostRM: string;
  paymentReceived: string;
  submittedAt: string;
}

interface MonthlyData {
  month: string;
  tripCount: number;
  totalDistance: number;
  totalDieselCost: number;
  totalDieselLitres: number;
  totalToll: number;
  totalMeals: number;
  totalMaintenance: number;
  totalPaymentReceived: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
}

export default function MonthlyReport() {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalSummary, setTotalSummary] = useState<MonthlyData>({
    month: 'Total',
    tripCount: 0,
    totalDistance: 0,
    totalDieselCost: 0,
    totalDieselLitres: 0,
    totalToll: 0,
    totalMeals: 0,
    totalMaintenance: 0,
    totalPaymentReceived: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0
  });

  useEffect(() => {
    const savedTrips: TripData[] = JSON.parse(localStorage.getItem('tripData') || '[]');
    
    // Group trips by month
    const monthlyGroups: { [key: string]: TripData[] } = {};
    
    savedTrips.forEach(trip => {
      const date = new Date(trip.tripDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(trip);
    });

    // Calculate monthly summaries
    const monthlySummaries: MonthlyData[] = [];
    const overallTotals = {
      tripCount: 0,
      totalDistance: 0,
      totalDieselCost: 0,
      totalDieselLitres: 0,
      totalToll: 0,
      totalMeals: 0,
      totalMaintenance: 0,
      totalPaymentReceived: 0,
      totalExpenses: 0,
      grossProfit: 0,
      netProfit: 0
    };

    Object.entries(monthlyGroups).forEach(([monthKey, trips]) => {
      const date = new Date(monthKey + '-01');
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      const monthlyStats = {
        month: monthName,
        tripCount: trips.length,
        totalDistance: 0,
        totalDieselCost: 0,
        totalDieselLitres: 0,
        totalToll: 0,
        totalMeals: 0,
        totalMaintenance: 0,
        totalPaymentReceived: 0,
        totalExpenses: 0,
        grossProfit: 0,
        netProfit: 0
      };

      trips.forEach(trip => {
        const distance = (parseFloat(trip.endMileage) || 0) - (parseFloat(trip.startMileage) || 0);
        const dieselCost = parseFloat(trip.dieselAddedRM) || 0;
        const dieselLitres = parseFloat(trip.dieselAddedLitre) || 0;
        const toll = parseFloat(trip.tollPaidRM) || 0;
        const meals = parseFloat(trip.mealsRM) || 0;
        const maintenance = parseFloat(trip.maintenanceCostRM) || 0;
        const payment = parseFloat(trip.paymentReceived) || 0;

        monthlyStats.totalDistance += distance > 0 ? distance : 0;
        monthlyStats.totalDieselCost += dieselCost;
        monthlyStats.totalDieselLitres += dieselLitres;
        monthlyStats.totalToll += toll;
        monthlyStats.totalMeals += meals;
        monthlyStats.totalMaintenance += maintenance;
        monthlyStats.totalPaymentReceived += payment;
      });

      monthlyStats.totalExpenses = monthlyStats.totalDieselCost + monthlyStats.totalToll + monthlyStats.totalMeals + monthlyStats.totalMaintenance;
      monthlyStats.grossProfit = monthlyStats.totalPaymentReceived;
      monthlyStats.netProfit = monthlyStats.grossProfit - monthlyStats.totalExpenses;

      // Add to overall totals
      overallTotals.tripCount += monthlyStats.tripCount;
      overallTotals.totalDistance += monthlyStats.totalDistance;
      overallTotals.totalDieselCost += monthlyStats.totalDieselCost;
      overallTotals.totalDieselLitres += monthlyStats.totalDieselLitres;
      overallTotals.totalToll += monthlyStats.totalToll;
      overallTotals.totalMeals += monthlyStats.totalMeals;
      overallTotals.totalMaintenance += monthlyStats.totalMaintenance;
      overallTotals.totalPaymentReceived += monthlyStats.totalPaymentReceived;
      overallTotals.totalExpenses += monthlyStats.totalExpenses;
      overallTotals.grossProfit += monthlyStats.grossProfit;
      overallTotals.netProfit += monthlyStats.netProfit;

      monthlySummaries.push(monthlyStats);
    });

    // Sort by month (newest first)
    monthlySummaries.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

    setMonthlyData(monthlySummaries);
    setTotalSummary({
      month: 'Overall Total',
      ...overallTotals
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <Calendar className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold text-purple-700">Monthly Report</h1>
          </div>
        </div>

        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">RM {totalSummary.totalPaymentReceived.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 text-sm">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">RM {totalSummary.totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 text-sm">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {totalSummary.netProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className={`text-2xl font-bold ${totalSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  RM {totalSummary.netProfit.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 text-sm">Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{totalSummary.tripCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Comprehensive monthly financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No trip data available</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Distance (km)</TableHead>
                      <TableHead>Revenue (RM)</TableHead>
                      <TableHead>Expenses (RM)</TableHead>
                      <TableHead>Net Profit (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((month, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell>{month.tripCount}</TableCell>
                        <TableCell>{month.totalDistance.toFixed(0)}</TableCell>
                        <TableCell>RM {month.totalPaymentReceived.toFixed(2)}</TableCell>
                        <TableCell>RM {month.totalExpenses.toFixed(2)}</TableCell>
                        <TableCell className={month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          RM {month.netProfit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Expense Breakdown */}
        {monthlyData.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
              <CardDescription>Monthly expense distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Diesel (RM)</TableHead>
                      <TableHead>Toll (RM)</TableHead>
                      <TableHead>Meals (RM)</TableHead>
                      <TableHead>Maintenance (RM)</TableHead>
                      <TableHead>Total (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((month, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell>RM {month.totalDieselCost.toFixed(2)}</TableCell>
                        <TableCell>RM {month.totalToll.toFixed(2)}</TableCell>
                        <TableCell>RM {month.totalMeals.toFixed(2)}</TableCell>
                        <TableCell>RM {month.totalMaintenance.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">RM {month.totalExpenses.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}