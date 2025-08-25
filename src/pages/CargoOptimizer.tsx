import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Trash2, Calculator, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CargoItem {
  id: string;
  name: string;
  length: number; // kaki
  width: number;  // kaki
  height: number; // kaki
  weight: number; // kg
  quantity: number;
  fragile: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TruckSpec {
  model: string;
  length: number; // kaki
  width: number;  // kaki
  height: number; // kaki
  maxWeight: number; // kg
}

export default function CargoOptimizer() {
  const navigate = useNavigate();
  
  // Truck specifications - Isuzu/Hicom Single Axle
  const truckSpec: TruckSpec = {
    model: 'Isuzu/Hicom Single Axle',
    length: 10,
    width: 6,
    height: 6.5,
    maxWeight: 2000
  };

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    quantity: '1',
    fragile: false,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const addCargoItem = () => {
    if (!newItem.name || !newItem.length || !newItem.width || !newItem.height || !newItem.weight) {
      toast.error('Sila isi semua maklumat barang');
      return;
    }

    const item: CargoItem = {
      id: Date.now().toString(),
      name: newItem.name,
      length: parseFloat(newItem.length),
      width: parseFloat(newItem.width),
      height: parseFloat(newItem.height),
      weight: parseFloat(newItem.weight),
      quantity: parseInt(newItem.quantity),
      fragile: newItem.fragile,
      priority: newItem.priority
    };

    setCargoItems(prev => [...prev, item]);
    
    // Reset form
    setNewItem({
      name: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      quantity: '1',
      fragile: false,
      priority: 'medium'
    });

    toast.success(`${item.name} ditambah ke senarai cargo`);
  };

  const removeCargoItem = (id: string) => {
    setCargoItems(prev => prev.filter(item => item.id !== id));
    toast.success('Barang dipadamkan dari senarai');
  };

  const calculateTotalStats = () => {
    const totalVolume = cargoItems.reduce((sum, item) => 
      sum + (item.length * item.width * item.height * item.quantity), 0
    );
    const totalWeight = cargoItems.reduce((sum, item) => 
      sum + (item.weight * item.quantity), 0
    );
    const truckVolume = truckSpec.length * truckSpec.width * truckSpec.height;
    
    return {
      totalVolume: totalVolume.toFixed(2),
      totalWeight: totalWeight.toFixed(2),
      truckVolume: truckVolume.toFixed(2),
      volumeUtilization: ((totalVolume / truckVolume) * 100).toFixed(1),
      weightUtilization: ((totalWeight / truckSpec.maxWeight) * 100).toFixed(1),
      remainingVolume: (truckVolume - totalVolume).toFixed(2),
      remainingWeight: (truckSpec.maxWeight - totalWeight).toFixed(2),
      canFit: totalVolume <= truckVolume && totalWeight <= truckSpec.maxWeight
    };
  };

  const generateLoadingPlan = () => {
    if (cargoItems.length === 0) {
      toast.error('Tiada barang untuk disusun');
      return;
    }

    // Sort by priority (high first), then by weight (heavy first), then by size (large first)
    const sortedItems = [...cargoItems].sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      const aWeight = a.weight * a.quantity;
      const bWeight = b.weight * b.quantity;
      if (aWeight !== bWeight) {
        return bWeight - aWeight; // Heavy first
      }
      
      const aVolume = a.length * a.width * a.height * a.quantity;
      const bVolume = b.length * b.width * b.height * b.quantity;
      return bVolume - aVolume; // Large first
    });

    const stats = calculateTotalStats();
    if (!stats.canFit) {
      toast.error('Cargo melebihi kapasiti lori!');
      return;
    }

    // Generate loading sequence
    const loadingPlan = sortedItems.map((item, index) => ({
      step: index + 1,
      item: item,
      instruction: generateLoadingInstruction(item, index, sortedItems)
    }));

    // Save loading plan for visualization
    localStorage.setItem('loadingPlan', JSON.stringify({
      timestamp: new Date().toISOString(),
      truckSpec,
      items: cargoItems,
      plan: loadingPlan,
      stats
    }));

    toast.success('Pelan pemuatan dijana! Lihat tab "Pelan Pemuatan"');
  };

  const generateLoadingInstruction = (item: CargoItem, index: number, allItems: CargoItem[]) => {
    let instruction = `Muat ${item.quantity}x ${item.name}`;
    
    // Priority rules: Heavy items bottom, fragile items last
    if (item.weight * item.quantity > 100) {
      instruction += ' - BARANG BERAT: Letakkan di ground level dahulu untuk stability';
    } else if (item.fragile) {
      instruction += ' - FRAGILE: Muat terakhir, letakkan di atas, elakkan tekanan';
    } else if (item.priority === 'high') {
      instruction += ' - PRIORITY tinggi, susun dengan accessible';
    } else if (item.name.toLowerCase().includes('palet')) {
      instruction += ' - PALET: Letakkan sebagai base platform untuk item lain';
    } else if (item.name.toLowerCase().includes('kotak')) {
      instruction += ' - KOTAK: Boleh stack, pastikan alignment yang betul';
    } else if (index === 0) {
      instruction += ' - Letakkan di bahagian belakang (near rear doors) untuk easy access';
    } else {
      instruction += ' - Susun mengikut size dan weight distribution';
    }
    
    return instruction;
  };

  const exportCargoData = () => {
    if (cargoItems.length === 0) {
      toast.error('Tiada data cargo untuk di-export');
      return;
    }

    const stats = calculateTotalStats();
    const exportData = {
      truckModel: truckSpec.model,
      truckCapacity: `${truckSpec.length}' x ${truckSpec.width}' x ${truckSpec.height}'`,
      maxWeight: `${truckSpec.maxWeight}kg`,
      totalItems: cargoItems.length,
      totalVolume: `${stats.totalVolume} cubic feet`,
      totalWeight: `${stats.totalWeight}kg`,
      utilizationRate: `${stats.volumeUtilization}%`,
      status: stats.canFit ? 'BOLEH MUAT' : 'MELEBIHI KAPASITI',
      items: cargoItems.map(item => ({
        name: item.name,
        dimensions: `${item.length}' x ${item.width}' x ${item.height}'`,
        weight: `${item.weight}kg`,
        quantity: item.quantity,
        totalVolume: (item.length * item.width * item.height * item.quantity).toFixed(2) + ' cubic feet',
        totalWeight: (item.weight * item.quantity) + 'kg',
        priority: item.priority,
        fragile: item.fragile ? 'Ya' : 'Tidak'
      }))
    };

    // Convert to CSV
    const csvHeaders = [
      'Item Name', 'Dimensions (L x W x H)', 'Unit Weight', 'Quantity', 
      'Total Volume', 'Total Weight', 'Priority', 'Fragile'
    ];
    
    const csvRows = cargoItems.map(item => [
      item.name,
      `${item.length}' x ${item.width}' x ${item.height}'`,
      `${item.weight}kg`,
      item.quantity,
      `${(item.length * item.width * item.height * item.quantity).toFixed(2)} cu ft`,
      `${(item.weight * item.quantity)}kg`,
      item.priority.toUpperCase(),
      item.fragile ? 'Ya' : 'Tidak'
    ]);

    const csvContent = [
      ['BINWAN Enterprise - Cargo Loading Plan'],
      ['Truck Model:', truckSpec.model],
      ['Truck Capacity:', `${truckSpec.length}' x ${truckSpec.width}' x ${truckSpec.height}' (${stats.truckVolume} cu ft)`],
      ['Max Weight:', `${truckSpec.maxWeight}kg`],
      ['Total Volume Used:', `${stats.totalVolume} cu ft (${stats.volumeUtilization}%)`],
      ['Total Weight:', `${stats.totalWeight}kg (${stats.weightUtilization}%)`],
      ['Status:', stats.canFit ? 'BOLEH MUAT' : 'MELEBIHI KAPASITI'],
      [''],
      csvHeaders,
      ...csvRows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BINWAN_Cargo_Plan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Cargo plan di-export ke CSV!');
  };

  const stats = calculateTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-green-700 ml-4 flex items-center">
            <Package className="h-8 w-8 mr-3" />
            Cargo Space Optimizer
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Items */}
          <div className="lg:col-span-1 space-y-6">
            {/* Truck Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Spesifikasi Lori</CardTitle>
                <CardDescription>Kapasiti maksimum lori BINWAN</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-800">{truckSpec.model}</div>
                  <div className="text-sm text-green-700">
                    📏 {truckSpec.length}' x {truckSpec.width}' x {truckSpec.height}' (Single Axle)
                  </div>
                  <div className="text-sm text-green-700">
                    ⚖️ Max: {truckSpec.maxWeight}kg
                  </div>
                  <div className="text-sm text-green-700">
                    📦 Volume: {stats.truckVolume} cubic feet
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Item */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Tambah Barang</CardTitle>
                <CardDescription>Masukkan maklumat barang untuk dimuat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Nama Barang</Label>
                  <Input
                    id="itemName"
                    placeholder="cth: Kotak Elektronik, Palet Kayu, Perabot"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Jenis cargo: Kotak, Palet, Loose items, Mixed cargo
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="length">Panjang (kaki)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={newItem.length}
                      onChange={(e) => setNewItem(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Lebar (kaki)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={newItem.width}
                      onChange={(e) => setNewItem(prev => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Tinggi (kaki)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={newItem.height}
                      onChange={(e) => setNewItem(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="weight">Berat (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={newItem.weight}
                      onChange={(e) => setNewItem(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Kuantiti</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Keutamaan</Label>
                  <select 
                    id="priority"
                    className="w-full p-2 border rounded-md"
                    value={newItem.priority}
                    onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sederhana</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fragile"
                    checked={newItem.fragile}
                    onChange={(e) => setNewItem(prev => ({ ...prev, fragile: e.target.checked }))}
                  />
                  <Label htmlFor="fragile">Barang Mudah Pecah</Label>
                </div>

                <Button onClick={addCargoItem} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Barang
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Items List */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Senarai Barang ({cargoItems.length})</CardTitle>
                <CardDescription>Barang-barang yang akan dimuat</CardDescription>
              </CardHeader>
              <CardContent>
                {cargoItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada barang ditambah</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cargoItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-green-800">{item.name}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCargoItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📏 {item.length}' x {item.width}' x {item.height}'</div>
                          <div>⚖️ {item.weight}kg x {item.quantity} = {(item.weight * item.quantity).toFixed(1)}kg</div>
                          <div>📦 Volume: {(item.length * item.width * item.height * item.quantity).toFixed(2)} cu ft</div>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                            {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sederhana' : 'Rendah'}
                          </Badge>
                          {item.fragile && (
                            <Badge variant="outline" className="text-orange-600">
                              Fragile
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Capacity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Analisis Kapasiti</CardTitle>
                <CardDescription>Penggunaan ruang dan berat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Volume Utilization */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Penggunaan Volume</span>
                    <span className={parseFloat(stats.volumeUtilization) > 100 ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {stats.volumeUtilization}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${parseFloat(stats.volumeUtilization) > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(parseFloat(stats.volumeUtilization), 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {stats.totalVolume} / {stats.truckVolume} cubic feet
                  </div>
                </div>

                {/* Weight Utilization */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Penggunaan Berat</span>
                    <span className={parseFloat(stats.weightUtilization) > 100 ? 'text-red-600 font-bold' : 'text-blue-600'}>
                      {stats.weightUtilization}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${parseFloat(stats.weightUtilization) > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(parseFloat(stats.weightUtilization), 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {stats.totalWeight}kg / {truckSpec.maxWeight}kg
                  </div>
                </div>

                {/* Status */}
                <div className={`p-3 rounded-lg text-center font-semibold ${
                  stats.canFit ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {stats.canFit ? '✅ BOLEH MUAT' : '❌ MELEBIHI KAPASITI'}
                </div>

                {/* Remaining Capacity */}
                {stats.canFit && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Baki Kapasiti:</div>
                    <div className="text-xs text-blue-700">
                      📦 Volume: {stats.remainingVolume} cu ft
                    </div>
                    <div className="text-xs text-blue-700">
                      ⚖️ Berat: {stats.remainingWeight}kg
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Tindakan</CardTitle>
                <CardDescription>Jana pelan dan analisis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={generateLoadingPlan}
                  disabled={cargoItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Jana Pelan Pemuatan
                </Button>

                <Button 
                  onClick={() => navigate('/loading-plan')}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Pelan Pemuatan
                </Button>

                <Button 
                  onClick={exportCargoData}
                  disabled={cargoItems.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export ke CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}