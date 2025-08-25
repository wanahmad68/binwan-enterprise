import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  startMileage: string;
  endMileage: string;
  dieselAddedLitre: string;
  submittedAt: string;
}

export default function DieselConsumption() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [averageConsumption, setAverageConsumption] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalFuel, setTotalFuel] = useState(0);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    setTrips(savedTrips);
    
    let totalKm = 0;
    let totalLitres = 0;
    
    savedTrips.forEach((trip: TripData) => {
      const distance = (parseFloat(trip.endMileage) || 0) - (parseFloat(trip.startMileage) || 0);
      const fuel = parseFloat(trip.dieselAddedLitre) || 0;
      
      if (distance > 0) totalKm += distance;
      if (fuel > 0) totalLitres += fuel;
    });
    
    setTotalDistance(totalKm);
    setTotalFuel(totalLitres);
    setAverageConsumption(totalLitres > 0 ? totalKm / totalLitres : 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
            <h1 className="text-2xl font-bold text-orange-700">Diesel Consumption</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700">Average Consumption</CardTitle>
              <CardDescription>Fuel efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{averageConsumption.toFixed(2)} km/L</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700">Total Distance</CardTitle>
              <CardDescription>Kilometers traveled</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{totalDistance.toFixed(0)} km</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700">Total Fuel</CardTitle>
              <CardDescription>Litres consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{totalFuel.toFixed(2)} L</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Consumption Details</CardTitle>
            <CardDescription>Individual trip fuel efficiency</CardDescription>
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
                      <TableHead>Distance (km)</TableHead>
                      <TableHead>Fuel (L)</TableHead>
                      <TableHead>Consumption (km/L)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const distance = (parseFloat(trip.endMileage) || 0) - (parseFloat(trip.startMileage) || 0);
                      const fuel = parseFloat(trip.dieselAddedLitre) || 0;
                      const consumption = fuel > 0 ? distance / fuel : 0;
                      
                      return (
                        <TableRow key={trip.id}>
                          <TableCell>{new Date(trip.tripDate).toLocaleDateString()}</TableCell>
                          <TableCell>{distance.toFixed(0)} km</TableCell>
                          <TableCell>{fuel.toFixed(2)} L</TableCell>
                          <TableCell>{consumption.toFixed(2)} km/L</TableCell>
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