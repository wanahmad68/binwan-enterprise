import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripData {
  id: string;
  tripDate: string;
  maintenanceCostRM: string;
  submittedAt: string;
}

export default function TotalMaintenanceCost() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [totalMaintenance, setTotalMaintenance] = useState(0);
  const [tripsWithMaintenance, setTripsWithMaintenance] = useState(0);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    setTrips(savedTrips);
    
    const total = savedTrips.reduce((sum: number, trip: TripData) => 
      sum + (parseFloat(trip.maintenanceCostRM) || 0), 0);
    
    const withMaintenance = savedTrips.filter((trip: TripData) => 
      parseFloat(trip.maintenanceCostRM) > 0).length;
    
    setTotalMaintenance(total);
    setTripsWithMaintenance(withMaintenance);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center ml-4">
            <Wrench className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-700">Total Maintenance Cost</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700">Total Maintenance</CardTitle>
              <CardDescription>Sum of all maintenance costs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">RM {totalMaintenance.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700">Maintenance Events</CardTitle>
              <CardDescription>Number of trips with maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{tripsWithMaintenance}</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Records</CardTitle>
            <CardDescription>Vehicle maintenance cost breakdown</CardDescription>
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
                      <TableHead>Maintenance Cost (RM)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const maintenanceCost = parseFloat(trip.maintenanceCostRM) || 0;
                      const status = maintenanceCost > 0 ? 'Maintenance Done' : 'No maintenance';
                      
                      return (
                        <TableRow key={trip.id}>
                          <TableCell>{new Date(trip.tripDate).toLocaleDateString()}</TableCell>
                          <TableCell>RM {maintenanceCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              maintenanceCost > 0 
                                ? 'bg-blue-100 text-blue-800' 
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