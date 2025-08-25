import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Cloud, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trip {
  id: string;
  date: string;
  truckNumber: string;
  driverName: string;
  startLocation: string;
  endLocation: string;
  startKm: number;
  endKm: number;
  dieselAdded: number;
  dieselCost: number;
  tollPaid: number;
  mealCost: number;
  maintenanceCost: number;
}

export default function DataManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const tripData = JSON.parse(localStorage.getItem('tripData') || '[]');
      
      if (tripData.length === 0) {
        toast({
          title: "Tiada Data",
          description: "Tiada data perjalanan untuk di-export.",
          variant: "destructive"
        });
        setIsExporting(false);
        return;
      }

      // CSV Headers
      const headers = [
        'Date', 'Start Point', 'Pickup Point', 'Dropoff Point', 
        'Start Mileage (KM)', 'End Mileage (KM)', 'Distance (KM)', 
        'Diesel Added (RM)', 'Diesel Added (L)', 'Toll Paid (RM)', 
        'Meals (RM)', 'Maintenance Cost (RM)', 'Payment Received (RM)', 'Total Expenses (RM)'
      ];

      // CSV Rows
      const rows = tripData.map((trip: any) => {
        const startMileage = parseFloat(trip.startMileage) || 0;
        const endMileage = parseFloat(trip.endMileage) || 0;
        const distance = endMileage - startMileage;
        const dieselCost = parseFloat(trip.dieselAddedRM) || 0;
        const tollCost = parseFloat(trip.tollPaidRM) || 0;
        const mealsCost = parseFloat(trip.mealsRM) || 0;
        const maintenanceCost = parseFloat(trip.maintenanceCostRM) || 0;
        const totalExpenses = dieselCost + tollCost + mealsCost + maintenanceCost;

        return [
          trip.tripDate || '',
          trip.startPoint || '',
          trip.pickupPoint || '',
          trip.dropoffPoint || '',
          startMileage,
          endMileage,
          distance,
          dieselCost.toFixed(2),
          parseFloat(trip.dieselAddedLitre || '0').toFixed(2),
          tollCost.toFixed(2),
          mealsCost.toFixed(2),
          maintenanceCost.toFixed(2),
          parseFloat(trip.paymentReceived || '0').toFixed(2),
          totalExpenses.toFixed(2)
        ];
      });

      // Create CSV content
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `BINWAN_Enterprise_Trips_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Berjaya",
        description: `Berjaya export ${tripData.length} rekod perjalanan ke fail CSV.`,
      });

    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          throw new Error('Invalid CSV format');
        }

        // Skip header row
        const dataLines = lines.slice(1).filter(line => line.trim());
        
        const importedTrips: Trip[] = dataLines.map((line, index) => {
          const values = line.split(',').map(val => val.replace(/"/g, '').trim());
          
          if (values.length < 13) {
            throw new Error(`Invalid data format at row ${index + 2}`);
          }

          return {
            id: `imported-${Date.now()}-${index}`,
            date: values[0],
            truckNumber: values[1],
            driverName: values[2],
            startLocation: values[3],
            endLocation: values[4],
            startKm: parseInt(values[5]) || 0,
            endKm: parseInt(values[6]) || 0,
            dieselAdded: parseFloat(values[8]) || 0,
            dieselCost: parseFloat(values[9]) || 0,
            tollPaid: parseFloat(values[10]) || 0,
            mealCost: parseFloat(values[11]) || 0,
            maintenanceCost: parseFloat(values[12]) || 0,
          };
        });

        // Get existing trips  
        const existingTrips = JSON.parse(localStorage.getItem('tripData') || '[]');
        
        // Convert imported trips to match our data structure
        const convertedTrips = importedTrips.map((trip: any) => ({
          id: `imported-${Date.now()}-${Math.random()}`,
          tripDate: trip.date,
          startPoint: trip.startLocation,
          pickupPoint: '',
          dropoffPoint: trip.endLocation, 
          startMileage: trip.startKm.toString(),
          endMileage: trip.endKm.toString(),
          dieselAddedRM: trip.dieselCost.toString(),
          dieselAddedLitre: trip.dieselAdded.toString(),
          tollPaidRM: trip.tollPaid.toString(),
          mealsRM: trip.mealCost.toString(),
          maintenanceCostRM: trip.maintenanceCost.toString(),
          paymentReceived: '0',
          submittedAt: new Date().toISOString()
        }));
        
        // Merge with existing trips
        const allTrips = [...existingTrips, ...convertedTrips];
        localStorage.setItem('tripData', JSON.stringify(allTrips));

        toast({
          title: "Import Berjaya",
          description: `Berjaya import ${importedTrips.length} rekod perjalanan dari fail CSV.`,
        });

      } catch (error) {
        toast({
          title: "Import Gagal",
          description: "Gagal import fail CSV. Sila periksa format fail.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const getDataStats = () => {
    const tripData = JSON.parse(localStorage.getItem('tripData') || '[]');
    return {
      totalTrips: tripData.length,
      oldestDate: tripData.length > 0 ? tripData.reduce((oldest: any, trip: any) => 
        trip.tripDate < oldest ? trip.tripDate : oldest, tripData[0].tripDate) : 'Tiada Data',
      newestDate: tripData.length > 0 ? tripData.reduce((newest: any, trip: any) => 
        trip.tripDate > newest ? trip.tripDate : newest, tripData[0].tripDate) : 'Tiada Data'
    };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6">
      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            Data Overview
          </CardTitle>
          <CardDescription>Current data storage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTrips}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-green-600">{stats.oldestDate}</div>
              <div className="text-sm text-gray-600">Oldest Record</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-green-600">{stats.newestDate}</div>
              <div className="text-sm text-gray-600">Latest Record</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Export/Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data Backup & Restore
          </CardTitle>
          <CardDescription>
            Export your data to CSV files for backup, or import previously exported data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={exportToCSV}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </Button>
            
            <div className="flex-1">
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                disabled={isImporting}
                className="hidden"
                id="csv-import"
              />
              <label htmlFor="csv-import" className="w-full">
                <Button 
                  variant="outline"
                  disabled={isImporting}
                  className="w-full cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? 'Importing...' : 'Import from CSV'}
                  </span>
                </Button>
              </label>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Export regularly to backup your data. CSV files can be opened in Excel or Google Sheets.
          </div>
        </CardContent>
      </Card>

      {/* Supabase Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Cloud Database (Supabase)
          </CardTitle>
          <CardDescription>
            Sync your data to the cloud for automatic backup and multi-device access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>🚀 Coming Next:</strong> Cloud synchronization will be available once you connect to Supabase.
              <br />
              Click the Supabase button in the top-right corner to get started with free cloud storage.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}