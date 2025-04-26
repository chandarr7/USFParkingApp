using System.Collections.Generic;
using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IParkingSpotRepository : IRepository<ParkingSpot>
    {
        Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double radius);
    }
}