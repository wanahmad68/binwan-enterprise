import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FuelIcon, TrendingUp, Receipt, UtensilsCrossed, Wrench, Calendar } from 'lucide-react';

export default function Reports() {
  const navigate = useNavigate();

  const reportButtons = [
    {
      title: 'Total Diesel Added',
      description: 'View total diesel consumption',
      icon: FuelIcon,
      path: '/reports/total-diesel-added',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      title: 'Diesel Consumption (km/l)',
      description: 'Calculate fuel efficiency',
      icon: TrendingUp,
      path: '/reports/diesel-consumption',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: 'Total Paid Toll',
      description: 'Summary of toll expenses',
      icon: Receipt,
      path: '/reports/total-paid-toll',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Daily Meal Costs',
      description: 'Track meal expenses',
      icon: UtensilsCrossed,
      path: '/reports/daily-meal-costs',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Total Maintenance Cost',
      description: 'Vehicle maintenance summary',
      icon: Wrench,
      path: '/reports/total-maintenance-cost',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Monthly Report',
      description: 'Comprehensive monthly overview',
      icon: Calendar,
      path: '/reports/monthly-report',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-purple-700 ml-4">Reports</h1>
        </div>

        {/* Report Cards */}
        <div className="space-y-3">
          {reportButtons.map((report, index) => {
            const IconComponent = report.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(report.path)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className={`w-full ${report.color}`} onClick={() => navigate(report.path)}>
                    View Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}