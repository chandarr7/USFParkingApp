import { useState } from "react";
import SearchSection from "@/components/SearchSection";
import MapAndListingSection from "@/components/MapAndListingSection";
import ParkingTrends from "@/components/ParkingTrends";
import ReservationModal from "@/components/ReservationModal";
import { useReservationModal } from "@/hooks/useReservationModal";
import { useQuery } from "@tanstack/react-query";
import { ParkingSpot, SearchParams } from "@/types";
import { searchParkingSpots } from "@/lib/api";

const Home = () => {
  const {
    isOpen: isReservationModalOpen,
    selectedParkingSpot,
    reservationData,
    onOpen,
    onClose,
    setSelectedParkingSpot,
    setReservationData
  } = useReservationModal();
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: "",
    date: new Date().toISOString().split('T')[0],
    radius: "1"
  });
  
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const { data: parkingSpots = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/parking-spots/search', searchParams],
    queryFn: () => searchParkingSpots(searchParams),
    enabled: searchPerformed
  });
  
  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setSearchPerformed(true);
    await refetch();
  };
  
  const handleReserve = (spot: ParkingSpot) => {
    setSelectedParkingSpot(spot);
    onOpen();
  };
  
  return (
    <>
      <SearchSection onSearch={handleSearch} />
      
      {searchPerformed && (
        <MapAndListingSection 
          parkingSpots={parkingSpots}
          isLoading={isLoading}
          onReserve={handleReserve}
        />
      )}
      
      <ParkingTrends />
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={onClose}
        parkingSpot={selectedParkingSpot}
        initialData={reservationData}
      />
    </>
  );
};

export default Home;
