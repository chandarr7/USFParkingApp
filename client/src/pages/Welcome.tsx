import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart3, MapPin } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with background image */}
      <div className="relative flex flex-col items-center justify-center text-center py-24 px-4 bg-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div className="absolute inset-0 bg-[url('/parking-background.jpg')] bg-cover bg-center opacity-40 z-0"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">USF Parking Monitor</h1>
          <p className="text-xl mb-10">
            This prototype web application is designed to help students, faculty, and staff view available 
            parking spaces across the USF campus in real time. While real-time data integration is a 
            future enhancement, this version presents the foundational structure for CRUD operations 
            and data display.
          </p>
          
          <Link href="/home">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg shadow-lg">
              🚀 Explore Visualizations
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            🚗 Key Features (Planned)
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Live updates on parking availability</h3>
                <p className="text-gray-600 mt-1">Real-time information about available parking spots in each lot.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Parking lot zones and names</h3>
                <p className="text-gray-600 mt-1">Clear identification of different parking areas across campus.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Data visualization for parking trends</h3>
                <p className="text-gray-600 mt-1">Analytics to help understand peak hours and plan accordingly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;