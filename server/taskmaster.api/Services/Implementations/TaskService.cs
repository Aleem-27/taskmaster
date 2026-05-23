using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Models;
using taskmaster.api.Repositories.Interfaces;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.api.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository) => _repository = repository;

        public async Task<IEnumerable<TaskReadDto>> GetAllTasksAsync()
        {
            var tasks = await _repository.GetAllAsync();
            return tasks.Select(t => new TaskReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt,
                UserId = t.UserId,
                OwnerUsername = t.User?.Username
            });
        }

        public async Task<TaskReadDto?> GetTaskByIdAndUserIdAsync(int id, int userId)
        {
            var t = await _repository.GetByIdAndUserIdAsync(id, userId);
            return t == null ? null : new TaskReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt
            };
        }

        public async Task<IEnumerable<TaskReadDto>> GetAllTasksByUserIdAsync(int userId)
        {
            var tasks = await _repository.GetAllByUserIdAsync(userId);
            return tasks.Select(t => new TaskReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt
            });
        }

        public async Task<TaskStatsDto> GetTotalTasksStatsAsync()
        {
            return await _repository.GetTotalStatsAsync();
        }

        public async Task<TaskStatsDto> GetTasksStatByUserIdAsync(int userId)
        {
            return await _repository.GetStatsByUserIdAsync(userId);
        }

        public async Task<TaskReadDto> CreateTaskAsync(TaskCreateDto taskCreateDto, int userId)
        {
            var task = new TaskItem
            {
                Title = taskCreateDto.Title,
                Description = taskCreateDto.Description,
                Priority = taskCreateDto.Priority,
                DueDate = taskCreateDto.DueDate,
                UserId = userId
            };

            await _repository.AddAsync(task);

            return new TaskReadDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                Status = task.Status,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt
            };
        }

        public async Task UpdateTaskAsync(int id, TaskUpdateDto taskUpdateDto, int userId)
        {
            var existingTask = await _repository.GetByIdAndUserIdAsync(id, userId);
            if (existingTask == null) return;

            existingTask.Title = taskUpdateDto.Title;
            existingTask.Description = taskUpdateDto.Description;
            existingTask.Priority = taskUpdateDto.Priority;
            existingTask.Status = taskUpdateDto.Status;
            existingTask.DueDate = taskUpdateDto.DueDate;

            await _repository.UpdateAsync(existingTask, userId);
        }

        public async Task DeleteTaskAsync(int id, int userId)
        {
            await _repository.DeleteAsync(id, userId);
        }

        public async Task AdminDeleteTaskAsync(int id)
        { 
            await _repository.DeleteAsync(id);
        }
    }
}
