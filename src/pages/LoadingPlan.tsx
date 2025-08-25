import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  fragile: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface LoadingPlanData {
  timestamp: string;
  truckSpec: {
    model: string;
    length: number;
    width: number;
    height: number;
    maxWeight: number;
  };
  items: CargoItem[];
  plan: {
    step: number;
    item: CargoItem;
    instruction: string;
  }[];
  stats: {
    totalVolume: string;
    totalWeight: string;
    truckVolume: string;
    volumeUtilization: string;
    weightUtilization: string;
    remainingVolume: string;
    remainingWeight: string;
    canFit: boolean;
  };
}

export default function LoadingPlan() {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<LoadingPlanData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('loadingPlan');
    if (savedPlan) {
      setPlanData(JSON.parse(savedPlan));
    }
  }, []);

  const toggleStepCompletion = (step: number) => {
    setCompletedSteps(prev => {
      if (prev.includes(step)) {
        return prev.filter(s => s !== step);
      } else {
        return [...prev, step];
      }
    });
  };

  const exportLoadingInstructions = () => {
    if (!planData) return;

    const instructions = [
      'BINWAN Enterprise - Arahan Pemuatan Lori',
      `Lori: ${planData.truckSpec.model}`,
      `Kapasiti: ${planData.truckSpec.length}' x ${planData.truckSpec.width}' x ${planData.truckSpec.height}'`,
      `Berat Maksimum: ${planData.truckSpec.maxWeight}kg`,
      `Tarikh: ${new Date(planData.timestamp).toLocaleDateString()}`,
      '',
      'ARAHAN PEMUATAN (IKUT TURUTAN):',
      ''
    ];

    planData.plan.forEach(step => {
      instructions.push(`${step.step}. ${step.instruction}`);
      instructions.push(`   - Barang: ${step.item.name}`);
      instructions.push(`   - Saiz: ${step.item.length}' x ${step.item.width}' x ${step.item.height}'`);
      instructions.push(`   - Berat: ${step.item.weight}kg x ${step.item.quantity}`);
      instructions.push('');
    });

    instructions.push('');
    instructions.push('RINGKASAN:');
    instructions.push(`- Jumlah Volume: ${planData.stats.totalVolume} cu ft (${planData.stats.volumeUtilization}%)`);
    instructions.push(`- Jumlah Berat: ${planData.stats.totalWeight}kg (${planData.stats.weightUtilization}%)`);
    instructions.push(`- Status: ${planData.stats.canFit ? 'BOLEH MUAT' : 'MELEBIHI KAPASITI'}`);

    const content = instructions.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BINWAN_Loading_Instructions_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Arahan pemuatan di-download!');
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    toast.success('Progress pemuatan di-reset');
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/cargo-optimizer')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold text-green-700 ml-4">Pelan Pemuatan</h1>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tiada Pelan Pemuatan</h3>
              <p className="text-gray-500 mb-4">
                Sila jana pelan pemuatan terlebih dahulu di Cargo Optimizer
              </p>
              <Button onClick={() => navigate('/cargo-optimizer')} className="bg-green-600 hover:bg-green-700">
                <Package className="h-4 w-4 mr-2" />
                Pergi ke Cargo Optimizer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((completedSteps.length / planData.plan.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/cargo-optimizer')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold text-green-700 ml-4">Pelan Pemuatan Lori</h1>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={resetProgress} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
            <Button onClick={exportLoadingInstructions} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Arahan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Truck Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Maklumat Lori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-800">{planData.truckSpec.model}</div>
                  <div className="text-sm text-green-700">
                    📏 {planData.truckSpec.length}' x {planData.truckSpec.width}' x {planData.truckSpec.height}'
                  </div>
                  <div className="text-sm text-green-700">
                    ⚖️ Max: {planData.truckSpec.maxWeight}kg
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Progress Pemuatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Selesai</span>
                      <span className="font-bold text-green-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {completedSteps.length} / {planData.plan.length} langkah
                    </div>
                  </div>

                  {progressPercentage === 100 && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Pemuatan Selesai!</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capacity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Ringkasan Kapasiti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Volume:</span>
                    <span className="text-sm font-semibold">{planData.stats.volumeUtilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Berat:</span>
                    <span className="text-sm font-semibold">{planData.stats.weightUtilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant={planData.stats.canFit ? 'default' : 'destructive'}>
                      {planData.stats.canFit ? 'BOLEH MUAT' : 'MELEBIHI KAPASITI'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Columns - Loading Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Arahan Pemuatan (Ikut Turutan)</CardTitle>
                <CardDescription>
                  Klik pada setiap langkah untuk menanda sebagai selesai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planData.plan.map((step) => {
                    const isCompleted = completedSteps.includes(step.step);
                    
                    return (
                      <div
                        key={step.step}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => toggleStepCompletion(step.step)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.step}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                                Langkah {step.step}: {step.item.name}
                              </h4>
                              <div className="flex gap-2">
                                <Badge variant={step.item.priority === 'high' ? 'destructive' : step.item.priority === 'medium' ? 'default' : 'secondary'}>
                                  {step.item.priority === 'high' ? 'Tinggi' : step.item.priority === 'medium' ? 'Sederhana' : 'Rendah'}
                                </Badge>
                                {step.item.fragile && (
                                  <Badge variant="outline" className="text-orange-600">
                                    Fragile
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <p className={`text-sm mb-3 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                              {step.instruction}
                            </p>
                            
                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                              <div>
                                <span className="font-medium">Saiz:</span><br />
                                {step.item.length}' x {step.item.width}' x {step.item.height}'
                              </div>
                              <div>
                                <span className="font-medium">Berat:</span><br />
                                {step.item.weight}kg x {step.item.quantity}
                              </div>
                              <div>
                                <span className="font-medium">Volume:</span><br />
                                {(step.item.length * step.item.width * step.item.height * step.item.quantity).toFixed(1)} cu ft
                              </div>
                              <div>
                                <span className="font-medium">Total Berat:</span><br />
                                {(step.item.weight * step.item.quantity).toFixed(1)}kg
                              </div>
                            </div>
                            
                            {step.item.fragile && (
                              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                                ⚠️ <strong>PERHATIAN:</strong> Barang mudah pecah - handle dengan berhati-hati
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Loading Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Tips Pemuatan:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Barang berat diletakkan di ground level terlebih dahulu</li>
                    <li>• Barang fragile dimuat dengan berhati-hati, elakkan tekanan</li>
                    <li>• Susun mengikut turutan untuk akses mudah semasa unloading</li>
                    <li>• Pastikan barang terikat dengan kemas untuk keselamatan</li>
                    <li>• Periksa distribution berat untuk balance lori</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}