using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ParkEase.Core.Interfaces;
using ParkEase.Infrastructure.Data;
using ParkEase.Infrastructure.Repositories;

namespace ParkEase.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Register DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            // Register repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IParkingSpotRepository, ParkingSpotRepository>();
            services.AddScoped<IReservationRepository, ReservationRepository>();
            services.AddScoped<IFavoriteRepository, FavoriteRepository>();

            return services;
        }
    }
}