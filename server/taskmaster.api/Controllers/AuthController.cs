using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using taskmaster.api.DTOs;
using taskmaster.api.Repositories;
using taskmaster.api.Services;

namespace taskmaster.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;

        public AuthController(IAuthService authService, IUserRepository userRepository)
        {
            _authService = authService;
            _userRepository = userRepository;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var success = await _authService.RegisterAsync(request.FullName, request.Username, request.Password);
            if (!success) return BadRequest("Username is already taken");

            return Ok(new { message = "Registration Successful!" });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Invalid Credentials.");
            }

            // Generate and update new refresh token
            var accessToken = _authService.CreateAccessToken(user);
            var refreshToken = _authService.GenerateRefreshToken();

            user.RefreshToken = refreshToken.Token;
            user.TokenExpires = refreshToken.Expires;
            await _userRepository.UpdateAsync(user);

            // Append the tokens to cookies
            _authService.SetTokensInCookies(accessToken, refreshToken.Token, refreshToken.Expires);

            return Ok(new { message = "Login successful!" });
        }
    }
}
