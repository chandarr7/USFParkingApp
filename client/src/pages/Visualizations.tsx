import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data for visualizations
const initialCapacityData = [
  { name: 'Collins Garage', capacity: 200, available: 75 },
  { name: 'Laurel Drive', capacity: 150, available: 32 },
  { name: 'Crescent Hill', capacity: 180, available: 120 },
  { name: 'Leroy Collins', capacity: 250, available: 90 },
  { name: 'Sun Dome', capacity: 300, available: 210 },
];

const initialUsageByTypeData = [
  { name: 'Students', value: 65 },
  { name: 'Faculty', value: 25 },
  { name: 'Visitors', value: 10 },
];

const initialAvailabilityTrendData = [
  { time: '8am', available: 180 },
  { time: '10am', available: 120 },
  { time: '12pm', available: 60 },
  { time: '2pm', available: 80 },
  { time: '4pm', available: 100 },
  { time: '6pm', available: 150 },
];

// COLORS for the charts
const COLORS = ['#006747', '#D9F2EA', '#404040', '#8884d8', '#83a6ed'];
const CHART_GREEN = '#006747';

const Visualizations = () => {
  const [capacityData, setCapacityData] = useState(initialCapacityData);
  const [usageByTypeData, setUsageByTypeData] = useState(initialUsageByTypeData);
  const [availabilityTrendData, setAvailabilityTrendData] = useState(initialAvailabilityTrendData);
  
  // States for CRUD operations
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState<string>('capacity');
  const [formData, setFormData] = useState<any>({});
  
  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle add new data point
  const handleAddData = () => {
    if (selectedChart === 'capacity') {
      const newData = {
        name: formData.name,
        capacity: parseInt(formData.capacity) || 0,
        available: parseInt(formData.available) || 0
      };
      setCapacityData([...capacityData, newData]);
    } else if (selectedChart === 'usage') {
      const newData = {
        name: formData.name,
        value: parseInt(formData.value) || 0
      };
      setUsageByTypeData([...usageByTypeData, newData]);
    } else if (selectedChart === 'trend') {
      const newData = {
        time: formData.time,
        available: parseInt(formData.available) || 0
      };
      setAvailabilityTrendData([...availabilityTrendData, newData]);
    }
    
    setIsAddDialogOpen(false);
    setFormData({});
  };
  
  // Handle edit data point
  const handleEditData = () => {
    if (selectedChart === 'capacity') {
      const updatedData = capacityData.map(item => 
        item.name === selectedItem.name ? {
          ...item,
          name: formData.name || item.name,
          capacity: parseInt(formData.capacity) || item.capacity,
          available: parseInt(formData.available) || item.available
        } : item
      );
      setCapacityData(updatedData);
    } else if (selectedChart === 'usage') {
      const updatedData = usageByTypeData.map(item => 
        item.name === selectedItem.name ? {
          ...item,
          name: formData.name || item.name,
          value: parseInt(formData.value) || item.value
        } : item
      );
      setUsageByTypeData(updatedData);
    } else if (selectedChart === 'trend') {
      const updatedData = availabilityTrendData.map(item => 
        item.time === selectedItem.time ? {
          ...item,
          time: formData.time || item.time,
          available: parseInt(formData.available) || item.available
        } : item
      );
      setAvailabilityTrendData(updatedData);
    }
    
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData({});
  };
  
  // Handle delete data point
  const handleDeleteData = (itemToDelete: any) => {
    if (selectedChart === 'capacity') {
      const updatedData = capacityData.filter(item => item.name !== itemToDelete.name);
      setCapacityData(updatedData);
    } else if (selectedChart === 'usage') {
      const updatedData = usageByTypeData.filter(item => item.name !== itemToDelete.name);
      setUsageByTypeData(updatedData);
    } else if (selectedChart === 'trend') {
      const updatedData = availabilityTrendData.filter(item => item.time !== itemToDelete.time);
      setAvailabilityTrendData(updatedData);
    }
  };
  
  const openAddDialog = (chartType: string) => {
    setSelectedChart(chartType);
    setIsAddDialogOpen(true);
    setFormData({});
  };
  
  const openEditDialog = (item: any, chartType: string) => {
    setSelectedChart(chartType);
    setSelectedItem(item);
    setFormData(item);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#006747] mb-4">Parking Data Visualizations</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This page provides an overview of parking trends and usage across the campus using dynamic visualizations. 
            The interactive charts below display parking lot capacity vs. availability, usage distribution among 
            students, faculty, and visitors, and how availability changes throughout the day. This visualization 
            layer helps guide future development of real-time monitoring systems.
          </p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="capacity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="capacity">Capacity vs. Availability</TabsTrigger>
              <TabsTrigger value="usage">Usage by Type</TabsTrigger>
              <TabsTrigger value="trend">Availability Trend</TabsTrigger>
            </TabsList>
            
            {/* Capacity vs. Availability Tab */}
            <TabsContent value="capacity">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Capacity vs. Availability</CardTitle>
                      <CardDescription>
                        Comparing total capacity and available spaces across parking lots
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => openAddDialog('capacity')}
                      className="bg-[#006747] text-white hover:bg-[#00593e]"
                    >
                      Add Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={capacityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="capacity" name="Total Capacity" fill={CHART_GREEN} />
                        <Bar dataKey="available" name="Available Spaces" fill="#D9F2EA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Data Table</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parking Lot</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {capacityData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.capacity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.available}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button 
                                  variant="ghost" 
                                  className="text-[#006747] hover:text-[#00593e] mr-2"
                                  onClick={() => openEditDialog(item, 'capacity')}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteData(item)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Usage by Type Tab */}
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Usage by Type</CardTitle>
                      <CardDescription>
                        Distribution of parking usage among students, faculty, and visitors
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => openAddDialog('usage')}
                      className="bg-[#006747] text-white hover:bg-[#00593e]"
                    >
                      Add Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usageByTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {usageByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Data Table</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {usageByTypeData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.value}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button 
                                  variant="ghost" 
                                  className="text-[#006747] hover:text-[#00593e] mr-2"
                                  onClick={() => openEditDialog(item, 'usage')}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteData(item)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Availability Trend Tab */}
            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Availability Trend</CardTitle>
                      <CardDescription>
                        How parking availability changes throughout the day
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => openAddDialog('trend')}
                      className="bg-[#006747] text-white hover:bg-[#00593e]"
                    >
                      Add Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={availabilityTrendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="available" name="Available Spaces" stroke={CHART_GREEN} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Data Table</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Spaces</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {availabilityTrendData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.time}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.available}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button 
                                  variant="ghost" 
                                  className="text-[#006747] hover:text-[#00593e] mr-2"
                                  onClick={() => openEditDialog(item, 'trend')}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteData(item)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Data Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Data Point</DialogTitle>
            <DialogDescription>
              Enter the details for the new data point.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedChart === 'capacity' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Parking Lot</Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={formData.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity</Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.capacity || ''} 
                    onChange={(e) => handleInputChange('capacity', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">Available</Label>
                  <Input 
                    id="available" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.available || ''} 
                    onChange={(e) => handleInputChange('available', e.target.value)} 
                  />
                </div>
              </>
            )}
            
            {selectedChart === 'usage' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">User Type</Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={formData.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">Percentage</Label>
                  <Input 
                    id="value" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.value || ''} 
                    onChange={(e) => handleInputChange('value', e.target.value)} 
                  />
                </div>
              </>
            )}
            
            {selectedChart === 'trend' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">Time</Label>
                  <Input 
                    id="time" 
                    className="col-span-3" 
                    value={formData.time || ''} 
                    onChange={(e) => handleInputChange('time', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">Available Spaces</Label>
                  <Input 
                    id="available" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.available || ''} 
                    onChange={(e) => handleInputChange('available', e.target.value)} 
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddData} className="bg-[#006747] text-white hover:bg-[#00593e]">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Data Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Point</DialogTitle>
            <DialogDescription>
              Update the details for this data point.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedChart === 'capacity' && selectedItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Parking Lot</Label>
                  <Input 
                    id="edit-name" 
                    className="col-span-3" 
                    value={formData.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-capacity" className="text-right">Capacity</Label>
                  <Input 
                    id="edit-capacity" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.capacity || ''} 
                    onChange={(e) => handleInputChange('capacity', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-available" className="text-right">Available</Label>
                  <Input 
                    id="edit-available" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.available || ''} 
                    onChange={(e) => handleInputChange('available', e.target.value)} 
                  />
                </div>
              </>
            )}
            
            {selectedChart === 'usage' && selectedItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">User Type</Label>
                  <Input 
                    id="edit-name" 
                    className="col-span-3" 
                    value={formData.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-value" className="text-right">Percentage</Label>
                  <Input 
                    id="edit-value" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.value || ''} 
                    onChange={(e) => handleInputChange('value', e.target.value)} 
                  />
                </div>
              </>
            )}
            
            {selectedChart === 'trend' && selectedItem && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-time" className="text-right">Time</Label>
                  <Input 
                    id="edit-time" 
                    className="col-span-3" 
                    value={formData.time || ''} 
                    onChange={(e) => handleInputChange('time', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-available" className="text-right">Available Spaces</Label>
                  <Input 
                    id="edit-available" 
                    type="number" 
                    className="col-span-3" 
                    value={formData.available || ''} 
                    onChange={(e) => handleInputChange('available', e.target.value)} 
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditData} className="bg-[#006747] text-white hover:bg-[#00593e]">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Visualizations;