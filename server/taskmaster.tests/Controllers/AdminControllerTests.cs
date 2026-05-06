using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using taskmaster.api.Controllers;
using taskmaster.api.DTOs.Users;
using taskmaster.api.Models;
using taskmaster.api.Repositories.Interfaces;

namespace taskmaster.tests.Controllers
{
    public class AdminControllerTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<ILogger<AdminController>> _mockLogger;
        private readonly AdminController _sut;

        public AdminControllerTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _mockLogger = new Mock<ILogger<AdminController>>();
            _sut = new AdminController(_mockUserRepo.Object, _mockLogger.Object);

            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturn200_WithMappedDtos()
        {
            _mockUserRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<User>
            {
                new() { Id = 1, FullName = "Aleem Khan", Username = "aleem", Role = "User", JoinDate = DateTime.UtcNow },
                new() { Id = 2, FullName = "Admin User", Username = "admin", Role = "Admin", JoinDate = DateTime.UtcNow }
            });

            var result = await _sut.GetAllUsers();

            var ok = result.Should().BeOfType<OkObjectResult>().Subject;
            var users = ok.Value.Should().BeAssignableTo<IEnumerable<UserProfileDto>>().Subject;
            users.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturn200_WithEmptyList_WhenNoUsersExist()
        {
            _mockUserRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<User>());

            var result = await _sut.GetAllUsers();

            var ok = result.Should().BeOfType<OkObjectResult>().Subject;
            var users = ok.Value.Should().BeAssignableTo<IEnumerable<UserProfileDto>>().Subject;
            users.Should().BeEmpty();
        }

        [Fact]
        public async Task UpdateUserRole_ShouldReturn204_WhenRoleIsValid()
        {
            var user = new User { Id = 1, Username = "aleem", Role = "User" };
            _mockUserRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(user);
            _mockUserRepo.Setup(r => r.UpdateAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _sut.UpdateUserRole(1, new UserRoleUpdateDto { Role = "Admin" });

            result.Should().BeOfType<NoContentResult>();
            _mockUserRepo.Verify(r => r.UpdateAsync(It.Is<User>(u => u.Role == "Admin")), Times.Once);
        }

        [Fact]
        public async Task UpdateUserRole_ShouldReturn400_WhenRoleIsInvalid()
        {
            var result = await _sut.UpdateUserRole(1, new UserRoleUpdateDto { Role = "SuperAdmin" });

            result.Should().BeOfType<BadRequestObjectResult>()
                .Which.StatusCode.Should().Be(400);

            _mockUserRepo.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task UpdateUserRole_ShouldReturn404_WhenUserNotFound()
        {
            _mockUserRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((User?)null);

            var result = await _sut.UpdateUserRole(99, new UserRoleUpdateDto { Role = "Admin" });

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteUser_ShouldReturn204_WhenUserExists()
        {
            var user = new User { Id = 1, Username = "aleem" };
            _mockUserRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(user);
            _mockUserRepo.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);

            var result = await _sut.DeleteUser(1);

            result.Should().BeOfType<NoContentResult>();
            _mockUserRepo.Verify(r => r.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturn404_WhenUserNotFound()
        {
            _mockUserRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((User?)null);

            var result = await _sut.DeleteUser(99);

            result.Should().BeOfType<NotFoundResult>();
            _mockUserRepo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
        }
    }
}