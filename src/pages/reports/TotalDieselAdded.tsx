import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FuelIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  dieselAddedRM: string;
  dieselAddedLitre: string;
  submittedAt: string;
}

export default function TotalDieselAdded() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [totalRM, setTotalRM] = useState(0);
  const [totalLitres, setTotalLitres] = useState(0);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    setTrips(savedTrips);
    
    const totalCostRM = savedTrips.reduce((sum: number, trip: TripData) => 
      sum + (parseFloat(trip.dieselAddedRM) || 0), 0);
    const totalVolumeLitres = savedTrips.reduce((sum: number, trip: TripData) => 
      sum + (parseFloat(trip.dieselAddedLitre) || 0), 0);
    
    setTotalRM(totalCostRM);
    setTotalLitres(totalVolumeLitres);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <FuelIcon className="h-6 w-6 text-red-600 mr-2" />
            <h1 className="text-2xl font-bold text-red-700">Total Diesel Added</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700">Total Cost</CardTitle>
              <CardDescription>Total diesel expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">RM {totalRM.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700">Total Volume</CardTitle>
              <CardDescription>Total diesel consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{totalLitres.toFixed(2)} L</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Diesel Records</CardTitle>
            <CardDescription>Detailed breakdown of diesel purchases</CardDescription>
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
                      <TableHead>Cost (RM)</TableHead>
                      <TableHead>Volume (L)</TableHead>
                      <TableHead>Price/L (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const cost = parseFloat(trip.dieselAddedRM) || 0;
                      const volume = parseFloat(trip.dieselAddedLitre) || 0;
                      const pricePerLitre = volume > 0 ? cost / volume : 0;
                      
                      return (
                        <TableRow key={trip.id}>
                          <TableCell>{new Date(trip.tripDate).toLocaleDateString()}</TableCell>
                          <TableCell>RM {cost.toFixed(2)}</TableCell>
                          <TableCell>{volume.toFixed(2)} L</TableCell>
                          <TableCell>RM {pricePerLitre.toFixed(2)}</TableCell>
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