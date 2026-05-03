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
                DueDate = t.DueDate
            });
        }

        public async Task<TaskReadDto?> GetTaskByIdAsync(int id)
        {
            var t = await _repository.GetByIdAsync(id);
            return t == null ? null : new TaskReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate
            };
        }

        public async Task<IEnumerable<TaskReadDto>> GetTasksByUserIdAsync(int userId)
        {
            var tasks = await _repository.GetByUserIdAsync(userId);
            return tasks.Select(t => new TaskReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate
            });
        }

        public async Task<TaskStatsDto> GetTasksStatsAsync()
        {
            return await _repository.GetStatsAsync();
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
                DueDate = task.DueDate
            };
        }

        public async Task UpdateTaskAsync(int id, TaskUpdateDto taskUpdateDto)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return;

            existingTask.Title = taskUpdateDto.Title;
            existingTask.Description = taskUpdateDto.Description;
            existingTask.Priority = taskUpdateDto.Priority;
            existingTask.Status = taskUpdateDto.Status;
            existingTask.DueDate = taskUpdateDto.DueDate;

            await _repository.UpdateAsync(existingTask);
        }

        public async Task DeleteTaskAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
