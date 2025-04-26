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
    public class ReservationRepository : Repository<Reservation>, IReservationRepository
    {
        public ReservationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<Reservation> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public override async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetReservationsByUserIdAsync(int userId)
        {
            return await _dbSet
                .Include(r => r.ParkingSpot)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.Date)
                .ThenBy(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetReservationsByParkingSpotIdAsync(int parkingSpotId)
        {
            return await _dbSet
                .Include(r => r.User)
                .Where(r => r.ParkingSpotId == parkingSpotId)
                .OrderBy(r => r.Date)
                .ThenBy(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetReservationsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .Where(r => r.Date >= startDate && r.Date <= endDate)
                .OrderBy(r => r.Date)
                .ThenBy(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetActiveReservationsAsync()
        {
            var today = DateTime.Today;
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .Where(r => r.Date >= today && r.Status == "confirmed")
                .OrderBy(r => r.Date)
                .ThenBy(r => r.StartTime)
                .ToListAsync();
        }
    }
}