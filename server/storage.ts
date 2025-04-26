import { 
  users, 
  type User, 
  type InsertUser, 
  parkingSpots, 
  type ParkingSpot, 
  type InsertParkingSpot,
  reservations,
  type Reservation,
  type InsertReservation,
  favorites,
  type Favorite,
  type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Parking spot operations
  getParkingSpots(): Promise<ParkingSpot[]>;
  getParkingSpot(id: number): Promise<ParkingSpot | undefined>;
  createParkingSpot(parkingSpot: InsertParkingSpot): Promise<ParkingSpot>;
  updateParkingSpot(id: number, parkingSpot: Partial<InsertParkingSpot>): Promise<ParkingSpot | undefined>;
  deleteParkingSpot(id: number): Promise<boolean>;
  
  // Reservation operations
  getReservations(userId?: number): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
  
  // Favorite operations
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavoritesByUser(userId: number): Promise<ParkingSpot[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;
  isFavorite(userId: number, parkingSpotId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingSpots: Map<number, ParkingSpot>;
  private reservations: Map<number, Reservation>;
  private favorites: Map<number, Favorite>;
  
  private userCurrentId: number;
  private parkingSpotCurrentId: number;
  private reservationCurrentId: number;
  private favoriteCurrentId: number;

  constructor() {
    this.users = new Map();
    this.parkingSpots = new Map();
    this.reservations = new Map();
    this.favorites = new Map();
    
    this.userCurrentId = 1;
    this.parkingSpotCurrentId = 1;
    this.reservationCurrentId = 1;
    this.favoriteCurrentId = 1;
    
    // Add a default user for testing
    this.createUser({
      username: "john.doe",
      password: "password123",
      name: "John Doe",
      email: "john.doe@example.com"
    });
    
    // Add some initial parking spots
    this.createParkingSpot({
      name: "Downtown Parking Garage",
      address: "123 Main Street",
      city: "City Center",
      price: 8.50,
      available_spots: 45,
      distance: 0.3,
      rating: 4.5,
      latitude: 40.7128,
      longitude: -74.0060,
      source: "local",
      external_id: null
    });
    
    this.createParkingSpot({
      name: "City Center Lot",
      address: "456 Park Avenue",
      city: "Downtown",
      price: 5.00,
      available_spots: 12,
      distance: 0.5,
      rating: 4.2,
      latitude: 40.7142,
      longitude: -74.0064,
      source: "local",
      external_id: null
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Parking spot operations
  async getParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values());
  }
  
  async getParkingSpot(id: number): Promise<ParkingSpot | undefined> {
    return this.parkingSpots.get(id);
  }
  
  async createParkingSpot(insertParkingSpot: InsertParkingSpot): Promise<ParkingSpot> {
    const id = this.parkingSpotCurrentId++;
    const parkingSpot: ParkingSpot = { ...insertParkingSpot, id };
    this.parkingSpots.set(id, parkingSpot);
    return parkingSpot;
  }
  
  async updateParkingSpot(id: number, parkingSpotUpdate: Partial<InsertParkingSpot>): Promise<ParkingSpot | undefined> {
    const parkingSpot = this.parkingSpots.get(id);
    if (!parkingSpot) return undefined;
    
    const updatedParkingSpot = { ...parkingSpot, ...parkingSpotUpdate };
    this.parkingSpots.set(id, updatedParkingSpot);
    return updatedParkingSpot;
  }
  
  async deleteParkingSpot(id: number): Promise<boolean> {
    return this.parkingSpots.delete(id);
  }
  
  // Reservation operations
  async getReservations(userId?: number): Promise<Reservation[]> {
    const allReservations = Array.from(this.reservations.values());
    if (userId) {
      return allReservations.filter(reservation => reservation.user_id === userId);
    }
    return allReservations;
  }
  
  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }
  
  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.reservationCurrentId++;
    const created_at = new Date();
    const reservation: Reservation = { ...insertReservation, id, created_at };
    this.reservations.set(id, reservation);
    return reservation;
  }
  
  async updateReservation(id: number, reservationUpdate: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, ...reservationUpdate };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }
  
  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }
  
  // Favorite operations
  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.user_id === userId);
  }
  
  async getFavoritesByUser(userId: number): Promise<ParkingSpot[]> {
    const userFavorites = await this.getFavorites(userId);
    return userFavorites
      .map(favorite => this.parkingSpots.get(favorite.parking_spot_id))
      .filter((spot): spot is ParkingSpot => spot !== undefined);
  }
  
  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteCurrentId++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async deleteFavorite(id: number): Promise<boolean> {
    return this.favorites.delete(id);
  }
  
  async isFavorite(userId: number, parkingSpotId: number): Promise<boolean> {
    return Array.from(this.favorites.values())
      .some(favorite => favorite.user_id === userId && favorite.parking_spot_id === parkingSpotId);
  }
}

export const storage = new MemStorage();
