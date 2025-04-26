import { pgTable, text, serial, integer, boolean, timestamp, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  price: doublePrecision("price").notNull(),
  available_spots: integer("available_spots").notNull(),
  distance: doublePrecision("distance"),
  rating: doublePrecision("rating"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  source: text("source").notNull(), // 'api' or 'local'
  external_id: text("external_id"), // ID from external API if applicable
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  parking_spot_id: integer("parking_spot_id").notNull(),
  date: timestamp("date").notNull(),
  start_time: text("start_time").notNull(),
  duration: integer("duration").notNull(),
  vehicle_type: text("vehicle_type").notNull(),
  license_plate: text("license_plate").notNull(),
  total_price: doublePrecision("total_price").notNull(),
  status: text("status").notNull(), // 'confirmed', 'pending', 'cancelled'
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  parking_spot_id: integer("parking_spot_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertParkingSpotSchema = createInsertSchema(parkingSpots).omit({ id: true });
export const insertReservationSchema = createInsertSchema(reservations).omit({ id: true, created_at: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Search schema
export const searchSchema = z.object({
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  radius: z.string().min(1, "Radius is required"),
});

export type SearchParams = z.infer<typeof searchSchema>;
