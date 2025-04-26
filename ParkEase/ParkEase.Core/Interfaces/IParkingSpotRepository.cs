using ParkEase.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IParkingSpotRepository : IRepository<ParkingSpot>
    {
        Task<IEnumerable<ParkingSpot>> SearchParkingSpotsAsync(string location, double radius);
        Task<IEnumerable<ParkingSpot>> GetParkingSpotsByIdsAsync(IEnumerable<int> ids);
        Task<IEnumerable<ParkingSpot>> GetFavoritesByUserIdAsync(int userId);
    }
}