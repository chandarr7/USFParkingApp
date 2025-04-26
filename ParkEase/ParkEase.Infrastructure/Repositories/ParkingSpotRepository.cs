using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParkEase.Infrastructure.Repositories
{
    public class ParkingSpotRepository : Repository<ParkingSpot>, IParkingSpotRepository
    {
        public ParkingSpotRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<ParkingSpot> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Reservations)
                .Include(p => p.Favorites)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<ParkingSpot>> GetParkingSpotsByIdsAsync(IEnumerable<int> ids)
        {
            return await _dbSet
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();
        }

        public async Task<IEnumerable<ParkingSpot>> SearchParkingSpotsAsync(string location, double radius)
        {
            // This is a simplified implementation. In a real-world scenario, 
            // you would need to use geographic coordinates and calculate the distance
            // between the current location and each parking spot.
            
            // For this example, we're just doing a basic filter on city or address
            var query = _dbSet.AsQueryable();
            
            if (!string.IsNullOrEmpty(location))
            {
                location = location.ToLower();
                query = query.Where(p => 
                    p.City.ToLower().Contains(location) || 
                    p.Address.ToLower().Contains(location));
            }
            
            // In a real implementation, we would filter spots within the given radius
            // using latitude and longitude
            
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<ParkingSpot>> GetFavoritesByUserIdAsync(int userId)
        {
            // Get parking spots that have been favorited by the user
            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.ParkingSpot)
                .Select(f => f.ParkingSpot)
                .ToListAsync();
        }
    }
}