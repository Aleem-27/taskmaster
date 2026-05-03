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

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int UserId => int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetMyTasks()
        {
            var tasks = await _taskService.GetAllTasksByUserIdAsync(UserId);
            return Ok(tasks);
        }

        // GET: api/Tasks/id
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskReadDto>> GetMyTaskItem(int id)
        {
            var task = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (task == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found." });
            }

            return Ok(task);
        }

        // GET: api/Tasks/Stats
        [HttpGet("Stats")]
        public async Task<ActionResult<TaskStatsDto>> GetMyTotalTasksStats()
        {
            return Ok(await _taskService.GetTasksStatByUserIdAsync(UserId));
        }

        // PUT: api/Tasks/id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMyTaskitem(int id, TaskUpdateDto taskUpdateDto)
        {
            var existingTask = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.UpdateTaskAsync(id, taskUpdateDto, UserId);
            return NoContent();
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskReadDto>> CreateMyTaskItem(TaskCreateDto taskCreateDto)
        {
            var createdTask = await _taskService.CreateTaskAsync(taskCreateDto, UserId);

            return CreatedAtAction(nameof(GetMyTaskItem), new { id = createdTask.Id }, createdTask);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyTaskItem(int id)
        {
            var existingTask = await _taskService.GetTaskByIdAndUserIdAsync(id, UserId);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.DeleteTaskAsync(id, UserId);
            return NoContent();
        }
    }
}
