import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  tollPaidRM: string;
  startPoint: string;
  dropoffPoint: string;
  submittedAt: string;
}

export default function TotalPaidToll() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [totalToll, setTotalToll] = useState(0);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    setTrips(savedTrips);
    
    const total = savedTrips.reduce((sum: number, trip: TripData) => 
      sum + (parseFloat(trip.tollPaidRM) || 0), 0);
    
    setTotalToll(total);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <Receipt className="h-6 w-6 text-yellow-600 mr-2" />
            <h1 className="text-2xl font-bold text-yellow-700">Total Paid Toll</h1>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-700">Total Toll Expenses</CardTitle>
            <CardDescription>Sum of all toll payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600">RM {totalToll.toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Toll Payment Records</CardTitle>
            <CardDescription>Detailed breakdown of toll expenses</CardDescription>
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
                      <TableHead>Route</TableHead>
                      <TableHead>Toll Amount (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const tollAmount = parseFloat(trip.tollPaidRM) || 0;
                      const route = `${trip.startPoint || 'N/A'} → ${trip.dropoffPoint || 'N/A'}`;
                      
                      return (
                        <TableRow key={trip.id}>
                          <TableCell>{new Date(trip.tripDate).toLocaleDateString()}</TableCell>
                          <TableCell>{route}</TableCell>
                          <TableCell>RM {tollAmount.toFixed(2)}</TableCell>
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