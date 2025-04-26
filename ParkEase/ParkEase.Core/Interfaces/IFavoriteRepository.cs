using ParkEase.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IFavoriteRepository : IRepository<Favorite>
    {
        Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(int userId);
        Task<bool> IsFavoriteAsync(int userId, int parkingSpotId);
        Task<Favorite> GetFavoriteByUserAndParkingSpotAsync(int userId, int parkingSpotId);
    }
}