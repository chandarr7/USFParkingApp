using ParkEase.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IReservationRepository : IRepository<Reservation>
    {
        Task<IEnumerable<Reservation>> GetReservationsByUserIdAsync(int userId);
        Task<IEnumerable<Reservation>> GetReservationsByParkingSpotIdAsync(int parkingSpotId);
        Task<IEnumerable<Reservation>> GetReservationsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Reservation>> GetActiveReservationsAsync();
    }
}