using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;

namespace ParkEase.Infrastructure.Repositories
{
    public class ParkingSpotRepository : Repository<ParkingSpot>, IParkingSpotRepository
    {
        public ParkingSpotRepository(ParkEaseDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double radius)
        {
            // In a real application, this would use a spatial query or call a geocoding service
            // For this example, we'll just filter by city and sort by distance (if available)
            var spots = await _dbSet
                .Where(p => p.City.Contains(location) || p.Address.Contains(location))
                .ToListAsync();

            // If we have coordinates, we could calculate actual distances
            // Here we're just using the distance field if it's already populated
            return spots.OrderBy(p => p.Distance ?? double.MaxValue);
        }
    }
}