using taskmaster.api.DTOs;
using taskmaster.api.Models;

namespace taskmaster.api.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId);
        Task<TaskStatsDto> GetStatsAsync();
        Task AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task);
        Task DeleteAsync(int id);
    }
}
