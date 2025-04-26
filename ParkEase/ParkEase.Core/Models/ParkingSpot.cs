using System.Collections.Generic;

namespace ParkEase.Core.Models
{
    public class ParkingSpot
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal Price { get; set; }
        public int AvailableSpots { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? Distance { get; set; }
        public double? Rating { get; set; }
        public string Source { get; set; }
        public string ExternalId { get; set; }
        
        // Navigation properties
        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
        
        public ParkingSpot()
        {
            Reservations = new List<Reservation>();
            Favorites = new List<Favorite>();
        }
    }
}