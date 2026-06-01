using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using taskmaster.api.Controllers;
using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.tests.Controllers
{
    public class TasksControllerTests
    {
        private readonly Mock<ITaskService> _mockTaskService;
        private readonly Mock<ILogger<TasksController>> _mockLogger;
        private readonly TasksController _sut;

        public TasksControllerTests()
        {
            _mockTaskService = new Mock<ITaskService>();
            _mockLogger = new Mock<ILogger<TasksController>>();
            _sut = new TasksController(_mockTaskService.Object, _mockLogger.Object);

            SetAuthenticatedUser(userId: 1, username: "aleem", role: "User");
        }

        private void SetAuthenticatedUser(int userId, string username, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetMyTasks_ShouldReturn200_WithUserTasks()
        {
            _mockTaskService.Setup(s => s.GetAllTasksByUserIdAsync(1))
                .ReturnsAsync(new List<TaskReadDto>
                {
                    new() { Id = 1, Title = "Task A" },
                    new() { Id = 2, Title = "Task B" }
                });

            var result = await _sut.GetMyTasks();

            result.Result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetMyTask_ShouldReturn200_WhenTaskExists()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(1, 1))
                .ReturnsAsync(new TaskReadDto { Id = 1, Title = "Task A" });

            var result = await _sut.GetMyTask(1);

            result.Result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetMyTask_ShouldReturn404_WhenTaskNotFound()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(99, 1))
                .ReturnsAsync((TaskReadDto?)null);

            var result = await _sut.GetMyTask(99);

            result.Result.Should().BeOfType<NotFoundObjectResult>()
                .Which.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task CreateMyTask_ShouldReturn201_WithCreatedTask()
        {
            var createDto = new TaskCreateDto { Title = "New Task", Description = "Test Description",  Priority = "High", DueDate = DateTime.UtcNow };
            _mockTaskService.Setup(s => s.CreateTaskAsync(createDto, 1))
                .ReturnsAsync(new TaskReadDto { Id = 5, Title = "New Task" });

            var result = await _sut.CreateMyTask(createDto);

            result.Result.Should().BeOfType<CreatedAtActionResult>()
                .Which.StatusCode.Should().Be(201);
        }

        [Fact]
        public async Task UpdateMyTask_ShouldReturn204_WhenTaskUpdated()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(1, 1))
                .ReturnsAsync(new TaskReadDto { Id = 1 });
            _mockTaskService.Setup(s => s.UpdateTaskAsync(1, It.IsAny<TaskUpdateDto>(), 1))
                .Returns(Task.CompletedTask);

            var result = await _sut.UpdateMyTask(1, new TaskUpdateDto
            {
                Title = "Test Title",
                Description = "Test Description",
                Priority = "Medium",
                Status = "Pending",
                DueDate = DateTime.UtcNow
            });

            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task UpdateMyTask_ShouldReturn404_WhenTaskNotFound()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(99, 1))
                .ReturnsAsync((TaskReadDto?)null);

            var result = await _sut.UpdateMyTask(99, new TaskUpdateDto
            {
                Title = "Test Title",
                Description = "Test Description",
                Priority = "Medium",
                Status = "Pending",
                DueDate = DateTime.UtcNow
            });

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteMyTask_ShouldReturn204_WhenTaskDeleted()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(1, 1))
                .ReturnsAsync(new TaskReadDto { Id = 1 });
            _mockTaskService.Setup(s => s.DeleteTaskAsync(1, 1))
                .Returns(Task.CompletedTask);

            var result = await _sut.DeleteMyTask(1);

            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task DeleteMyTask_ShouldReturn404_WhenTaskNotFound()
        {
            _mockTaskService.Setup(s => s.GetTaskByIdAndUserIdAsync(99, 1))
                .ReturnsAsync((TaskReadDto?)null);

            var result = await _sut.DeleteMyTask(99);

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetAllTasks_ShouldReturn200_WithAllTasks()
        {
            _mockTaskService.Setup(s => s.GetAllTasksAsync())
                .ReturnsAsync(new List<TaskReadDto>
                {
                    new() { Id = 1, Title = "Task A" },
                    new() { Id = 2, Title = "Task B" }
                });

            var result = await _sut.GetAllTasks();

            result.Result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task AdminDeleteTask_ShouldReturn204_WhenTaskDeleted()
        {
            _mockTaskService.Setup(s => s.AdminDeleteTaskAsync(1))
                .Returns(Task.CompletedTask);

            var result = await _sut.AdminDeleteTask(1);

            result.Should().BeOfType<NoContentResult>();
            _mockTaskService.Verify(s => s.AdminDeleteTaskAsync(1), Times.Once);
        }
    }
}