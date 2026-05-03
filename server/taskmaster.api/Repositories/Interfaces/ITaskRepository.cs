using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Models;

namespace taskmaster.api.Repositories.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAndUserIdAsync(int id, int userId);
        Task<IEnumerable<TaskItem>> GetAllByUserIdAsync(int userId);
        Task<TaskStatsDto> GetTotalStatsAsync();
        Task<TaskStatsDto> GetStatsByUserIdAsync(int userId);
        Task AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task, int userId);
        Task DeleteAsync(int id, int userId);
    }
}
