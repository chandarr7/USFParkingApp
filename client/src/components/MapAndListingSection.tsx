import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ParkingSpotItem from "./ParkingSpotItem";
import { ParkingSpot } from "@/types";
import { Map } from "lucide-react";

interface MapAndListingSectionProps {
  parkingSpots: ParkingSpot[];
  isLoading: boolean;
  onReserve: (spot: ParkingSpot) => void;
}

const MapAndListingSection: React.FC<MapAndListingSectionProps> = ({ 
  parkingSpots, 
  isLoading,
  onReserve
}) => {
  const [sortOption, setSortOption] = useState<'distance' | 'price' | 'availability'>('distance');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  
  const sortedSpots = [...parkingSpots].sort((a, b) => {
    if (sortOption === 'distance') {
      return (a.distance || 999) - (b.distance || 999);
    } else if (sortOption === 'price') {
      return a.price - b.price;
    } else {
      return b.available_spots - a.available_spots;
    }
  });
  
  const handleParkingSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };
  
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Map */}
        <div className="lg:col-span-2">
          <Card className="h-96 lg:h-[32rem] overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="bg-neutral-200 h-full w-full flex items-center justify-center">
                {selectedSpot ? (
                  <div className="text-center p-4">
                    <Map className="h-16 w-16 text-neutral-400 mx-auto" />
                    <h3 className="text-lg font-medium mt-2">{selectedSpot.name}</h3>
                    <p className="text-neutral-600">{selectedSpot.address}, {selectedSpot.city}</p>
                    <p className="text-neutral-600 mt-2">
                      ${selectedSpot.price.toFixed(2)}/hr • {selectedSpot.available_spots} spots available
                    </p>
                    {selectedSpot.distance && (
                      <p className="text-neutral-600">{selectedSpot.distance} miles away</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Map className="h-16 w-16 text-neutral-400 mx-auto" />
                    <p className="mt-2 text-neutral-600">Select a parking location to view details</p>
                    <p className="text-sm text-neutral-500">Parking locations will be shown as markers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side: Results List */}
        <div className="lg:col-span-1">
          <Card className="h-96 lg:h-[32rem] flex flex-col">
            <CardHeader className="py-4 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Available Parking Spots</CardTitle>
                <div className="flex items-center">
                  <span className="text-sm text-neutral-600 mr-2">Sort by:</span>
                  <Select 
                    defaultValue={sortOption} 
                    onValueChange={(value) => setSortOption(value as any)}
                  >
                    <SelectTrigger className="h-8 text-sm w-[100px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="availability">Availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto p-2">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="mb-3 p-3 border border-neutral-200 rounded-lg">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : sortedSpots.length > 0 ? (
                sortedSpots.map((spot) => (
                  <ParkingSpotItem 
                    key={spot.id} 
                    spot={spot} 
                    onSelect={() => handleParkingSpotSelect(spot)}
                    onReserve={() => onReserve(spot)}
                    isSelected={selectedSpot?.id === spot.id}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-neutral-600">No parking spots found</p>
                  <p className="text-sm text-neutral-500">Try adjusting your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MapAndListingSection;
