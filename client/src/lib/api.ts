import { apiRequest } from "./queryClient";
import type { 
  ParkingSpot, 
  Reservation, 
  Favorite, 
  SearchParams,
  EnrichedReservation
} from "@/types";

// Parking Spots
export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  const res = await apiRequest("GET", "/api/parking-spots", undefined);
  return res.json();
}

export async function fetchParkingSpot(id: number): Promise<ParkingSpot> {
  const res = await apiRequest("GET", `/api/parking-spots/${id}`, undefined);
  return res.json();
}

export async function searchParkingSpots(params: SearchParams): Promise<ParkingSpot[]> {
  const res = await apiRequest("POST", "/api/parking-spots/search", params);
  return res.json();
}

// Reservations
export async function fetchReservations(userId?: number): Promise<EnrichedReservation[]> {
  const queryString = userId ? `?userId=${userId}` : '';
  const res = await apiRequest("GET", `/api/reservations${queryString}`, undefined);
  return res.json();
}

export async function fetchReservation(id: number): Promise<EnrichedReservation> {
  const res = await apiRequest("GET", `/api/reservations/${id}`, undefined);
  return res.json();
}

export interface CreateReservationData {
  user_id: number;
  parking_spot_id: number;
  date: string;
  start_time: string;
  duration: number;
  vehicle_type: string;
  license_plate: string;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export async function createReservation(data: CreateReservationData): Promise<Reservation> {
  const res = await apiRequest("POST", "/api/reservations", data);
  return res.json();
}

export async function updateReservation(id: number, data: Partial<CreateReservationData>): Promise<Reservation> {
  const res = await apiRequest("PUT", `/api/reservations/${id}`, data);
  return res.json();
}

export async function deleteReservation(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/reservations/${id}`, undefined);
}

// Favorites
export async function fetchFavorites(userId: number = 1): Promise<ParkingSpot[]> {
  const res = await apiRequest("GET", `/api/favorites?userId=${userId}`, undefined);
  return res.json();
}

export async function addFavorite(userId: number, parkingSpotId: number): Promise<Favorite> {
  const res = await apiRequest("POST", "/api/favorites", { user_id: userId, parking_spot_id: parkingSpotId });
  return res.json();
}

export async function removeFavorite(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/favorites/${id}`, undefined);
}
