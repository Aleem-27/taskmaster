using Microsoft.EntityFrameworkCore;
using taskmaster.api.Data;
using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Models;
using taskmaster.api.Repositories.Interfaces;

namespace taskmaster.api.Repositories.Implementations
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context) 
        { 
            _context = context; 
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAndUserIdAsync(int id, int userId)
        {
            return await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<IEnumerable<TaskItem>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<TaskStatsDto> GetTotalStatsAsync()
        {
            var stats = await _context.Tasks
                .GroupBy(t => 1)
                .Select(g => new TaskStatsDto
                {
                    Completed = g.Count(t => t.Status == "Completed"),
                    InProgress = g.Count(t => t.Status == "In Progress"),
                    Pending = g.Count(t => t.Status == "Pending")
                })
                .FirstOrDefaultAsync();

            return stats ?? new TaskStatsDto();
        }

        public async Task<TaskStatsDto> GetStatsByUserIdAsync(int userId)
        {
            var stats = await _context.Tasks
                .Where(t => t.UserId == userId)
                .GroupBy(t => 1)
                .Select(g => new TaskStatsDto
                {
                    Completed = g.Count(t => t.Status == "Completed"),
                    InProgress = g.Count(t => t.Status == "In Progress"),
                    Pending = g.Count(t => t.Status == "Pending")
                })
                .FirstOrDefaultAsync();

            return stats ?? new TaskStatsDto();
        }

        public async Task AddAsync(TaskItem task)
        {
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TaskItem task, int userId)
        {
            var t = await GetByIdAndUserIdAsync(task.Id, userId);
            if (task != null)
            {
                _context.Tasks.Update(task);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var task = await GetByIdAndUserIdAsync(id, userId);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
    }
}