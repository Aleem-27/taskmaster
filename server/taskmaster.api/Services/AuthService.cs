using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using taskmaster.api.Models;
using taskmaster.api.Repositories;

namespace taskmaster.api.Services
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

            _logger.LogInformation("User '{Username} logged in successfully", username);
            return new AuthResultDto
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                Expiry = refreshToken.Expires
            };
        }

        public string CreateAccessToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:Token"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public (string Token, DateTime Expires) GenerateRefreshToken()
        {
            return (
                Token: Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires: DateTime.Now.AddDays(7)
            );
        }
    }
}
