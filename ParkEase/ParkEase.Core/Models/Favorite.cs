namespace ParkEase.Core.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotId { get; set; }
        
        // Navigation properties
        public User User { get; set; }
        public ParkingSpot ParkingSpot { get; set; }
    }
}