using taskmaster.api.DTOs;

namespace taskmaster.api.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllTasksAsync();
        Task<TaskDto?> GetTaskByIdAsync(int id);
        Task<TaskDto> CreateTaskAsync(TaskDto taskDto);
        Task UpdateTaskAsync(int id, TaskDto taskDto);
        Task DeleteTaskAsync(int id);
    }
}
