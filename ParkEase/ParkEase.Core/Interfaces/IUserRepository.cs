using ParkEase.Core.Models;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByEmailAsync(string email);
    }
}