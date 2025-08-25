import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  mealsRM: string;
  submittedAt: string;
}

export default function DailyMealCosts() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [averageDaily, setAverageDaily] = useState(0);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    setTrips(savedTrips);
    
    const total = savedTrips.reduce((sum: number, trip: TripData) => 
      sum + (parseFloat(trip.mealsRM) || 0), 0);
    
    setTotalMeals(total);
    setAverageDaily(savedTrips.length > 0 ? total / savedTrips.length : 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <UtensilsCrossed className="h-6 w-6 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-green-700">Daily Meal Costs</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700">Total Meal Expenses</CardTitle>
              <CardDescription>Sum of all meal costs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">RM {totalMeals.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700">Average Daily</CardTitle>
              <CardDescription>Average per trip</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">RM {averageDaily.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Expense Records</CardTitle>
            <CardDescription>Daily meal cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No trip data available</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Meal Cost (RM)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const mealCost = parseFloat(trip.mealsRM) || 0;
                      const status = mealCost > 0 ? 'Recorded' : 'No meals';
                      
                      return (
                        <TableRow key={trip.id}>
                          <TableCell>{new Date(trip.tripDate).toLocaleDateString()}</TableCell>
                          <TableCell>RM {mealCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              mealCost > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}