using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs.Auth;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.api.Controllers
{ 
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var success = await _authService.RegisterAsync(request.FullName, request.Username, request.Password);
            if (!success)
            {
                return BadRequest("Username is already taken");
            }

            return Ok(new { message = "Registration Successful!" });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var result = await _authService.LoginAsync(request.Username, request.Password);
            if (!result.Success)
            {
                return BadRequest("Invalid username or password");
            }

            // Add both tokens to the cookies
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(15)
            };

            Response.Cookies.Append("accessToken", result.AccessToken!, cookieOptions);
            cookieOptions.Expires = result.Expiry!.Value;
            Response.Cookies.Append("refreshToken", result.RefreshToken!, cookieOptions);

            _logger.LogInformation("Auth cookies issued for user '{Username}'", request.Username);
            return Ok(new { message = "Login successful!" });
        }

        [Authorize]
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            var username = User.Identity?.Name;

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1) // expire immediately
            };

            Response.Cookies.Append("accessToken", "", cookieOptions);
            Response.Cookies.Append("refreshToken", "", cookieOptions);

            if (!string.IsNullOrEmpty(username))
                await _authService.LogoutAsync(username);

            _logger.LogInformation("Logout endpoint called, cookies cleared for user '{Username}'", username ?? "unknown");
            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpGet("Profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var profile = await _authService.GetProfileAsync(username);
            if (profile == null) return NotFound();

            return Ok(profile);
        }
    }
}
