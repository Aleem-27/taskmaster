using taskmaster.api.DTOs.Tasks;

namespace taskmaster.api.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskReadDto>> GetAllTasksAsync();
        Task<TaskReadDto?> GetTaskByIdAndUserIdAsync(int id, int userId);
        Task<IEnumerable<TaskReadDto>> GetAllTasksByUserIdAsync(int userId);
        Task<TaskStatsDto> GetTotalTasksStatsAsync();
        Task<TaskStatsDto> GetTasksStatByUserIdAsync(int userId);
        Task<TaskReadDto> CreateTaskAsync(TaskCreateDto taskCreateDto, int userId);
        Task UpdateTaskAsync(int id, TaskUpdateDto taskUpdateDto, int userId);
        Task DeleteTaskAsync(int id, int userId);
    }
}
