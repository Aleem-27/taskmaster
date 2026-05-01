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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepository _userRepository;

        public AuthService(IConfiguration config, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
        }

        public async Task<bool> RegisterAsync(string fullname, string username, string password)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(username);
            if (existingUser != null) return false;

            var user = new User
            {
                FullName = fullname,
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _userRepository.AddAsync(user);
            return true;
        }

        public string CreateAccessToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
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

        public void SetTokensInCookies(string accessToken, string refreshToken, DateTime refreshExpiry)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(15)
            };

            var response = _httpContextAccessor.HttpContext?.Response;

            response?.Cookies.Append("accessToken", accessToken, cookieOptions);
            cookieOptions.Expires = refreshExpiry;
            response?.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
