using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParkEase.Infrastructure.Repositories
{
    public class FavoriteRepository : Repository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<Favorite> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(f => f.User)
                .Include(f => f.ParkingSpot)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public override async Task<IEnumerable<Favorite>> GetAllAsync()
        {
            return await _dbSet
                .Include(f => f.User)
                .Include(f => f.ParkingSpot)
                .ToListAsync();
        }

        public async Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(int userId)
        {
            return await _dbSet
                .Include(f => f.ParkingSpot)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> IsFavoriteAsync(int userId, int parkingSpotId)
        {
            return await _dbSet
                .AnyAsync(f => f.UserId == userId && f.ParkingSpotId == parkingSpotId);
        }

        public async Task<Favorite> GetFavoriteByUserAndParkingSpotAsync(int userId, int parkingSpotId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ParkingSpotId == parkingSpotId);
        }
    }
}