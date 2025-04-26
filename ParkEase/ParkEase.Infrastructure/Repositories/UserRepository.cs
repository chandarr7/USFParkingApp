using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;
using System.Threading.Tasks;

namespace ParkEase.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }
        
        public override async Task<User> GetByIdAsync(int id)
        {
            // Include related data when getting a user by ID
            return await _dbSet
                .Include(u => u.Reservations)
                    .ThenInclude(r => r.ParkingSpot)
                .Include(u => u.Favorites)
                    .ThenInclude(f => f.ParkingSpot)
                .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}