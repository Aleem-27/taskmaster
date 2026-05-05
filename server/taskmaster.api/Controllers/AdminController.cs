using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs.Users;
using taskmaster.api.Repositories.Interfaces;

namespace taskmaster.api.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IUserRepository userRepository, ILogger<AdminController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        // GET api/admin/users
        [HttpGet("Users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var result = users.Select(u => new UserProfileDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Username = u.Username,
                Role = u.Role,
                JoinDate = u.JoinDate,
            });

            return Ok(result);
        }

        // PUT api/admin/users/{id}/role
        [HttpPut("Users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, UserRoleUpdateDto request)
        {
            if (request.Role != "User" && request.Role != "Admin")
            {
                _logger.LogWarning("Invalid role '{Role}' specified for user {UserId}", request.Role, id);
                return BadRequest("Invalid role. Must be 'User' or 'Admin'");
            }

            var user = await _userRepository.GetByIdAsync(id);

            if (user is null)
            {
                _logger.LogWarning("Role update failed — user {UserId} not found", id);
                return NotFound();
            }

            var previousRole = user.Role;
            user.Role = request.Role;

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("User '{Username}' role changed from '{PreviousRole}' to '{NewRole}'",
                user.Username, previousRole, request.Role);
            return NoContent();
        }

        // DELETE api/admin/users/{id}
        [HttpDelete("Users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null)
            {
                _logger.LogWarning("Delete failed — user {UserId} not found", id);
                return NotFound();
            }

            await _userRepository.DeleteAsync(id);
            _logger.LogInformation("An Admin deleted user '{Username}' (Id: {UserId})", user.Username, id);
            return NoContent();
        }
    }
}
