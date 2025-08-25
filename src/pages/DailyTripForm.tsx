import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TripData {
  tripDate: string;
  startMileage: string;
  startPoint: string;
  pickupPoint: string;
  dropoffPoint: string;
  endMileage: string;
  dieselAddedRM: string;
  dieselAddedLitre: string;
  tollPaidRM: string;
  mealsRM: string;
  maintenanceCostRM: string;
  paymentReceived: string;
}

export default function DailyTripForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripData>({
    tripDate: '',
    startMileage: '',
    startPoint: '',
    pickupPoint: '',
    dropoffPoint: '',
    endMileage: '',
    dieselAddedRM: '',
    dieselAddedLitre: '',
    tollPaidRM: '',
    mealsRM: '',
    maintenanceCostRM: '',
    paymentReceived: ''
  });

  const handleInputChange = (field: keyof TripData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.tripDate || !formData.startMileage || !formData.endMileage) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get existing trips from localStorage
    const existingTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
    
    // Add new trip with timestamp
    const newTrip = {
      ...formData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    
    existingTrips.push(newTrip);
    localStorage.setItem('tripData', JSON.stringify(existingTrips));
    
    toast.success('Trip data saved successfully!');
    
    // Reset form
    setFormData({
      tripDate: '',
      startMileage: '',
      startPoint: '',
      pickupPoint: '',
      dropoffPoint: '',
      endMileage: '',
      dieselAddedRM: '',
      dieselAddedLitre: '',
      tollPaidRM: '',
      mealsRM: '',
      maintenanceCostRM: '',
      paymentReceived: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-green-700 ml-4">Daily Trip Form</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Trip Details</CardTitle>
            <CardDescription>Fill in your daily trip information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tripDate">Trip Date *</Label>
                <Input
                  id="tripDate"
                  type="date"
                  value={formData.tripDate}
                  onChange={(e) => handleInputChange('tripDate', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startMileage">Start Mileage *</Label>
                  <Input
                    id="startMileage"
                    type="number"
                    placeholder="km"
                    value={formData.startMileage}
                    onChange={(e) => handleInputChange('startMileage', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endMileage">End Mileage *</Label>
                  <Input
                    id="endMileage"
                    type="number"
                    placeholder="km"
                    value={formData.endMileage}
                    onChange={(e) => handleInputChange('endMileage', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startPoint">Start Point</Label>
                <Input
                  id="startPoint"
                  placeholder="Starting location"
                  value={formData.startPoint}
                  onChange={(e) => handleInputChange('startPoint', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pickupPoint">Pick-up Point</Label>
                <Input
                  id="pickupPoint"
                  placeholder="Pick-up location"
                  value={formData.pickupPoint}
                  onChange={(e) => handleInputChange('pickupPoint', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dropoffPoint">Drop-off Point</Label>
                <Input
                  id="dropoffPoint"
                  placeholder="Drop-off location"
                  value={formData.dropoffPoint}
                  onChange={(e) => handleInputChange('dropoffPoint', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dieselAddedRM">Diesel Added (RM)</Label>
                  <Input
                    id="dieselAddedRM"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.dieselAddedRM}
                    onChange={(e) => handleInputChange('dieselAddedRM', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dieselAddedLitre">Diesel Added (Litre)</Label>
                  <Input
                    id="dieselAddedLitre"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.dieselAddedLitre}
                    onChange={(e) => handleInputChange('dieselAddedLitre', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tollPaidRM">Toll Paid (RM)</Label>
                <Input
                  id="tollPaidRM"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.tollPaidRM}
                  onChange={(e) => handleInputChange('tollPaidRM', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mealsRM">Meals (RM)</Label>
                <Input
                  id="mealsRM"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.mealsRM}
                  onChange={(e) => handleInputChange('mealsRM', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maintenanceCostRM">Maintenance Cost (RM)</Label>
                <Input
                  id="maintenanceCostRM"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.maintenanceCostRM}
                  onChange={(e) => handleInputChange('maintenanceCostRM', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="paymentReceived">Payment Received (RM)</Label>
                <Input
                  id="paymentReceived"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.paymentReceived}
                  onChange={(e) => handleInputChange('paymentReceived', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Submit Trip Data
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}