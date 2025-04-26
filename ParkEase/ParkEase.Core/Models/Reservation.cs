using System;

namespace ParkEase.Core.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotId { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public int Duration { get; set; }
        public string VehicleType { get; set; }
        public string LicensePlate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } // 'confirmed', 'pending', 'cancelled'
        public DateTime CreatedAt { get; set; }
        
        // Navigation properties
        public User User { get; set; }
        public ParkingSpot ParkingSpot { get; set; }
    }
}