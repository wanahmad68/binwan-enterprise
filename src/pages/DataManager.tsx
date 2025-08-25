import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DataManagerComponent from '@/components/DataManager';

export default function DataManager() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Data Management</h1>
            <p className="text-gray-600">Backup, restore, and sync your trip data</p>
          </div>
        </div>

        {/* Data Manager Component */}
        <DataManagerComponent />
      </div>
    </div>
  );
}