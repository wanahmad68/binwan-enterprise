import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart3, Truck, Database, Receipt, Package } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="./assets/logo_green.png" 
              alt="BINWAN Enterprise Logo" 
              className="h-12 w-12 mr-3 object-contain"
              onError={(e) => {
                console.error('Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-3xl font-bold text-blue-800">BINWAN Enterprise</h1>
          </div>
          <p className="text-gray-600">Logistics Management System</p>
        </div>

        {/* Main Menu Cards */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/daily-trip-form')}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <FileText className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-700">Daily Trip Form</CardTitle>
              <CardDescription>Record your daily trip details</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/daily-trip-form')}>
                Start New Trip
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reports')}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <BarChart3 className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-700">Reports</CardTitle>
              <CardDescription>View detailed reports and analytics</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/reports')}>
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/data-manager')}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <Database className="h-12 w-12 text-orange-600" />
              </div>
              <CardTitle className="text-xl text-orange-700">Data Management</CardTitle>
              <CardDescription>Backup, restore & sync your data</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/data-manager')}>
                Manage Data
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/invoice-billing')}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <Receipt className="h-12 w-12 text-teal-600" />
              </div>
              <CardTitle className="text-xl text-teal-700">Print Invoice & Cash Bill</CardTitle>
              <CardDescription>Generate invoices and cash bills for trips</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => navigate('/invoice-billing')}>
                Create Invoice
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/cargo-optimizer')}>
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                <Package className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-700">Cargo Space Optimizer</CardTitle>
              <CardDescription>Optimize truck loading & space utilization</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/cargo-optimizer')}>
                Optimize Loading
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>All amounts in Malaysian Ringgit (RM)</p>
        </div>
      </div>
    </div>
  );
}