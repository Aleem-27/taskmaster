using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService taskService, ILogger<TasksController> logger)
        {
            _taskService = taskService;
            _logger = logger;
        }

        private int UserId => int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetMyTasks()
        {
            return Ok(await _taskService.GetAllTasksByUserIdAsync(UserId));
        }

        // GET: api/Tasks/id
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskReadDto>> GetMyTask(int id)
        {
            var task = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (task == null)
            {
                _logger.LogWarning("Task {TaskId} not found for user {UserId}", id, UserId);
                return NotFound(new { message = $"Task with ID {id} not found." });
            }

            return Ok(task);
        }

        // GET: api/Tasks/Stats
        [HttpGet("stats")]
        public async Task<ActionResult<TaskStatsDto>> GetMyStats()
        {
            return Ok(await _taskService.GetTasksStatByUserIdAsync(UserId));
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskReadDto>> CreateMyTask(TaskCreateDto taskCreateDto)
        {
            var createdTask = await _taskService.CreateTaskAsync(taskCreateDto, UserId);
            _logger.LogInformation("Task {TaskId} created by user {UserId}", createdTask.Id, UserId);
            return CreatedAtAction(nameof(GetMyTask), new { id = createdTask.Id }, createdTask);
        }

        // PUT: api/Tasks/id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMyTask(int id, TaskUpdateDto taskUpdateDto)
        {
            var existingTask = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (existingTask == null)
            {
                _logger.LogWarning("Update failed — task {TaskId} not found for user {UserId}", id, UserId);
                return NotFound();
            }

            await _taskService.UpdateTaskAsync(id, taskUpdateDto, UserId);
            _logger.LogInformation("Task {TaskId} updated by user {UserId}", id, UserId);
            return NoContent();
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyTask(int id)
        {
            var existingTask = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (existingTask == null)
            {
                _logger.LogWarning("Delete failed — task {TaskId} not found for user {UserId}", id, UserId);
                return NotFound();
            }

            await _taskService.DeleteTaskAsync(id, UserId);
            _logger.LogInformation("Task {TaskId} deleted by user {UserId}", id, UserId);
            return NoContent();
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetAllTasks()
        {
            return Ok(await _taskService.GetAllTasksAsync());
        }

        [HttpGet("admin/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TaskStatsDto>> GetTotalStats()
        {
            return Ok(await _taskService.GetTotalTasksStatsAsync());
        }

        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteTask(int id)
        {
            await _taskService.AdminDeleteTaskAsync(id);
            _logger.LogInformation("An Admin deleted task {TaskId}", id);
            return NoContent();
        }
    }
}
