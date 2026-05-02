using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs;
using taskmaster.api.Services;

namespace taskmaster.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthService> _logger;
        public AuthController(IAuthService authService, ILogger<AuthService> logger)
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
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(15)
            };

            Response.Cookies.Append("accessToken", result.AccessToken!, cookieOptions);
            cookieOptions.Expires = result.Expiry!.Value;
            Response.Cookies.Append("refreshToken", result.RefreshToken!, cookieOptions);

            _logger.LogInformation("Auth cookies issued for user '{Username}'", request.Username);
            return Ok(new { message = "Login successful!" });
        }
    }
}
