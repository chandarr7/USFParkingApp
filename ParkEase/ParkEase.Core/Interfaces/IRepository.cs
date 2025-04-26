using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IRepository<T> where T : class
    {
        // Create
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        
        // Read
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        
        // Update
        Task<T> UpdateAsync(T entity);
        
        // Delete
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(T entity);
        
        // Additional functionality
        Task<int> CountAsync();
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    }
}