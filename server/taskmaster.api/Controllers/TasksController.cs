using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: api/Tasks/id
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskReadDto>> GetTaskItem(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found." });
            }

            return Ok(task);
        }

        // GET: api/Tasks/Stats
        [HttpGet("Stats")]
        public async Task<ActionResult<TaskStatsDto>> GetTasksStats()
        {
            return Ok(await _taskService.GetTasksStatsAsync());
        }

        // PUT: api/Tasks/id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskItem(int id, TaskUpdateDto taskUpdateDto)
        {
            var existingTask = await _taskService.GetTaskByIdAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.UpdateTaskAsync(id, taskUpdateDto);
            return NoContent();
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskReadDto>> PostTaskItem(TaskCreateDto taskCreateDto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            var createdTask = await _taskService.CreateTaskAsync(taskCreateDto, userId);

            return CreatedAtAction(nameof(GetTaskItem), new { id = createdTask.Id }, createdTask);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            var existingTask = await _taskService.GetTaskByIdAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.DeleteTaskAsync(id);
            return NoContent();
        }
    }
}
