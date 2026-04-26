using taskmaster.api.DTOs;
using taskmaster.api.Models;
using taskmaster.api.Repositories;

namespace taskmaster.api.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository) => _repository = repository;

        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
        {
            var tasks = await _repository.GetAllAsync();
            return tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate
            });
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id)
        {
            var t = await _repository.GetByIdAsync(id);
            return t == null ? null : new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate
            };
        }

        public async Task<TaskDto> CreateTaskAsync(TaskDto taskDto)
        {
            var task = new TaskItem
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Priority = taskDto.Priority,
                Status = taskDto.Status,
                DueDate = taskDto.DueDate
            };

            await _repository.AddAsync(task);
            taskDto.Id = task.Id;
            return taskDto;
        }

        public async Task UpdateTaskAsync(int id, TaskDto taskDto)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return;

            existingTask.Title = taskDto.Title;
            existingTask.Description = taskDto.Description;
            existingTask.Priority = taskDto.Priority;
            existingTask.Status = taskDto.Status;
            existingTask.DueDate = taskDto.DueDate;

            await _repository.UpdateAsync(existingTask);
        }

        public async Task DeleteTaskAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
