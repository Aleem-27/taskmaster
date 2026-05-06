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

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var success = await _authService.RegisterAsync(request.FullName, request.Username, request.Password);
            if (!success)
            {
                return BadRequest("Username is already taken");
            }

            return Ok(new { message = "Registration Successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var result = await _authService.LoginAsync(request.Username, request.Password);
            if (!result.Success)
            {
                return BadRequest("Invalid username or password");
            }

            // Add both tokens to the cookies
            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            };

            var refreshCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.Expiry!.Value
            };

            Response.Cookies.Append("accessToken", result.AccessToken!, accessCookieOptions);
            Response.Cookies.Append("refreshToken", result.RefreshToken!, refreshCookieOptions);

            _logger.LogInformation("Auth cookies issued for user '{Username}'", request.Username);
            return Ok(new { message = "Login successful!" });
        }

        [Authorize]
        [HttpPost("logout")]
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

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                _logger.LogWarning("Refresh attempt with no refresh token cookie");
                return Unauthorized(new { message = "No refresh token provided" });
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);

            if (!result.Success)
            {
                // Clear cookies - token is invalid or expired, force re-login
                var expiredOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };

                Response.Cookies.Append("accessToken", "", expiredOptions);
                Response.Cookies.Append("refreshToken", "", expiredOptions);

                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            // Release both cookies with rotated tokens
            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            };

            var refreshCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = result.Expiry!.Value
            };

            Response.Cookies.Append("accessToken", result.AccessToken!, accessCookieOptions);
            Response.Cookies.Append("refreshToken", result.RefreshToken!, refreshCookieOptions);

            _logger.LogInformation("Access token refreshed and new cookies issued");
            return Ok(new { message = "Token refreshed successfully" });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Profile request received with no identity");
                return Unauthorized();
            }

            var profile = await _authService.GetProfileAsync(username);
            if (profile == null) return NotFound();

            return Ok(profile);
        }
    }
}
