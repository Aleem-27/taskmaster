using taskmaster.api.DTOs.Tasks;

namespace taskmaster.api.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskReadDto>> GetAllTasksAsync();
        Task<TaskReadDto?> GetTaskByIdAsync(int id);
        Task<IEnumerable<TaskReadDto>> GetTasksByUserIdAsync(int userId);
        Task<TaskStatsDto> GetTasksStatsAsync();
        Task<TaskReadDto> CreateTaskAsync(TaskCreateDto taskCreateDto, int userId);
        Task UpdateTaskAsync(int id, TaskUpdateDto taskUpdateDto);
        Task DeleteTaskAsync(int id);
    }
}
