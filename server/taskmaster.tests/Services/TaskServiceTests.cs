using FluentAssertions;
using Moq;
using taskmaster.api.DTOs.Tasks;
using taskmaster.api.Models;
using taskmaster.api.Repositories.Interfaces;
using taskmaster.api.Services.Implementations;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.tests.Services
{
    public class TaskServiceTests
    {
        private readonly Mock<ITaskRepository> _mockRepo;
        private readonly ITaskService _sut;

        public TaskServiceTests()
        {
            _mockRepo = new Mock<ITaskRepository>();
            _sut = new TaskService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllTasksAsync_ShouldReturnMappedDtos_WhenTasksExist()
        {
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<TaskItem>
            {
                new() { Id = 1, Title = "Task A", Priority = "High", Status = "Pending", UserId = 1 },
                new() { Id = 2, Title = "Task B", Priority = "Low",  Status = "Completed", UserId = 2 }
            });

            var result = await _sut.GetAllTasksAsync();

            result.Should().HaveCount(2);
            result.Should().ContainSingle(t => t.Title == "Task A");
        }

        [Fact]
        public async Task GetAllTasksAsync_ShouldReturnEmpty_WhenNoTasksExist()
        {
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<TaskItem>());

            var result = await _sut.GetAllTasksAsync();

            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAllTasksByUserIdAsync_ShouldReturnOnlyUserTasks()
        {
            _mockRepo.Setup(r => r.GetAllByUserIdAsync(1)).ReturnsAsync(new List<TaskItem>
            {
                new() { Id = 1, Title = "My Task", Priority = "Medium", Status = "Pending", UserId = 1 }
            });

            var result = await _sut.GetAllTasksByUserIdAsync(1);

            result.Should().HaveCount(1);
            result.First().Title.Should().Be("My Task");
        }

        [Fact]
        public async Task GetAllTasksByUserIdAsync_ShouldReturnEmpty_WhenUserHasNoTasks()
        {
            _mockRepo.Setup(r => r.GetAllByUserIdAsync(99)).ReturnsAsync(new List<TaskItem>());

            var result = await _sut.GetAllTasksByUserIdAsync(99);

            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetTaskByIdAndUserIdAsync_ShouldReturnDto_WhenTaskBelongsToUser()
        {
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, 1))
                .ReturnsAsync(new TaskItem { Id = 1, Title = "My Task", Priority = "High", Status = "Pending", UserId = 1 });

            var result = await _sut.GetTaskByIdAndUserIdAsync(1, 1);

            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Title.Should().Be("My Task");
        }

        [Fact]
        public async Task GetTaskByIdAndUserIdAsync_ShouldReturnNull_WhenTaskDoesNotBelongToUser()
        {
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, 99))
                .ReturnsAsync((TaskItem?)null);

            var result = await _sut.GetTaskByIdAndUserIdAsync(1, 99);

            result.Should().BeNull();
        }

        [Fact]
        public async Task CreateTaskAsync_ShouldReturnDto_WithCorrectUserIdAndFields()
        {
            _mockRepo.Setup(r => r.AddAsync(It.IsAny<TaskItem>()))
                .Callback<TaskItem>(t => t.Id = 10)
                .Returns(Task.CompletedTask);

            var dto = new TaskCreateDto { Title = "New Task", Priority = "High", DueDate = DateTime.UtcNow };

            var result = await _sut.CreateTaskAsync(dto, userId: 1);

            result.Id.Should().Be(10);
            result.Title.Should().Be("New Task");
            _mockRepo.Verify(r => r.AddAsync(It.Is<TaskItem>(t =>
                t.Title == "New Task" && t.UserId == 1
            )), Times.Once);
        }

        [Fact]
        public async Task UpdateTaskAsync_ShouldUpdateFields_WhenTaskBelongsToUser()
        {
            var existing = new TaskItem { Id = 1, Title = "Old", Priority = "Low", Status = "Pending", UserId = 1 };
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, 1)).ReturnsAsync(existing);
            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<TaskItem>(), 1)).Returns(Task.CompletedTask);

            var updateDto = new TaskUpdateDto { Title = "Updated", Priority = "High", Status = "Completed", DueDate = DateTime.UtcNow };
            await _sut.UpdateTaskAsync(1, updateDto, userId: 1);

            _mockRepo.Verify(r => r.UpdateAsync(It.Is<TaskItem>(t =>
                t.Title == "Updated" &&
                t.Priority == "High" &&
                t.Status == "Completed"
            ), 1), Times.Once);
        }

        [Fact]
        public async Task UpdateTaskAsync_ShouldDoNothing_WhenTaskDoesNotBelongToUser()
        {
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, 99)).ReturnsAsync((TaskItem?)null);

            await _sut.UpdateTaskAsync(1, new TaskUpdateDto(), userId: 99);

            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<TaskItem>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task DeleteTaskAsync_ShouldCallRepository_WithUserIdFilter()
        {
            _mockRepo.Setup(r => r.DeleteAsync(1, 1)).Returns(Task.CompletedTask);

            await _sut.DeleteTaskAsync(1, userId: 1);

            _mockRepo.Verify(r => r.DeleteAsync(1, 1), Times.Once);
        }

        [Fact]
        public async Task AdminDeleteTaskAsync_ShouldCallRepository_WithoutUserIdFilter()
        {
            _mockRepo.Setup(r => r.DeleteAsync(5)).Returns(Task.CompletedTask);

            await _sut.AdminDeleteTaskAsync(5);

            _mockRepo.Verify(r => r.DeleteAsync(5), Times.Once);
        }

        [Fact]
        public async Task GetTasksStatByUserIdAsync_ShouldReturnStats_ForUser()
        {
            var stats = new TaskStatsDto { Completed = 2, InProgress = 1, Pending = 3 };
            _mockRepo.Setup(r => r.GetStatsByUserIdAsync(1)).ReturnsAsync(stats);

            var result = await _sut.GetTasksStatByUserIdAsync(1);

            result.Completed.Should().Be(2);
            result.InProgress.Should().Be(1);
            result.Pending.Should().Be(3);
        }

        [Fact]
        public async Task GetTotalTasksStatsAsync_ShouldReturnAggregatedStats()
        {
            var stats = new TaskStatsDto { Completed = 10, InProgress = 5, Pending = 8 };
            _mockRepo.Setup(r => r.GetTotalStatsAsync()).ReturnsAsync(stats);

            var result = await _sut.GetTotalTasksStatsAsync();

            result.Completed.Should().Be(10);
            result.InProgress.Should().Be(5);
            result.Pending.Should().Be(8);
        }
    }
}