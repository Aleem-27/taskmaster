using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using taskmaster.api.DTOs.Users;
using taskmaster.api.Models;
using taskmaster.api.Repositories.Interfaces;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.api.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration config, IUserRepository userRepository, ILogger<AuthService> logger)
        {
            _config = config;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<bool> RegisterAsync(string fullname, string username, string password)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(username);
            if (existingUser != null)
            {
                _logger.LogWarning("Registeration failed - username '{Username}' is already taken", username);
                return false;
            }

            var user = new User
            {
                FullName = fullname,
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _userRepository.AddAsync(user);

            _logger.LogInformation("New user registered: '{Username}'", username);
            return true;
        }

        public async Task<AuthResultDto> LoginAsync(string username, string password)
        { 
            var existingUser = await _userRepository.GetByUsernameAsync(username);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(password, existingUser.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for username '{Username}'", username);
                return new AuthResultDto { Success = false };
            }

            var accessToken = CreateAccessToken(existingUser);
            var refreshToken = GenerateRefreshToken();

            existingUser.RefreshToken = refreshToken.Token;
            existingUser.TokenExpires = refreshToken.Expires;
            existingUser.TokenCreated = DateTime.UtcNow;

            await _userRepository.UpdateAsync(existingUser);

            _logger.LogInformation("User '{Username}' logged in successfully", username);
            return new AuthResultDto
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                Expiry = refreshToken.Expires
            };
        }

        public async Task LogoutAsync(string username)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
            {
                _logger.LogWarning("Logout attempted for unknown username '{Username}'", username);
                return;
            }

            user.RefreshToken = null;
            user.TokenExpires = null;
            user.TokenCreated = null;

            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("User '{Username}' logged out, refresh token invalidated", username);
        }

        public async Task<AuthResultDto> RefreshTokenAsync(string refreshToken)
        {
            var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                _logger.LogWarning("Refresh token validation failed - no token found");
                return new AuthResultDto
                {
                    Success = false,
                };
            }

            if (user.TokenExpires < DateTime.UtcNow)
            {
                _logger.LogWarning("Refresh token expired for user '{Username}'", user.Username);
                return new AuthResultDto
                {
                    Success = false
                };
            }

            // Issue new access token
            var newAccessToken = CreateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Rotate the refresh token - invalidate old one, issue new one
            user.RefreshToken = newRefreshToken.Token;
            user.TokenExpires = newRefreshToken.Expires;
            user.TokenCreated = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("Refresh token rotated for user '{Username}'", user.Username);

            return new AuthResultDto
            {
                Success = true,
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token,
                Expiry = newRefreshToken.Expires
            };
        }

        public async Task<UserProfileDto?> GetProfileAsync(string username)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
            {
                _logger.LogWarning("Profile request failed — user '{Username}' not found", username);
                return null;
            }

            _logger.LogInformation("Profile retrieved for user '{Username}'", username);
            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Username = user.Username,
                Role = user.Role,
                JoinDate = user.JoinDate,
            };
        }

        public string CreateAccessToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:Token"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public (string Token, DateTime Expires) GenerateRefreshToken()
        {
            return (
                Token: Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires: DateTime.UtcNow.AddDays(7)
            );
        }
    }
}
