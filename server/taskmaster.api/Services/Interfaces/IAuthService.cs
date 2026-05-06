using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using taskmaster.api.DTOs.Users;
using taskmaster.api.Models;

namespace taskmaster.api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string fullname, string username, string password);
        Task<AuthResultDto> LoginAsync(string username, string password);
        Task LogoutAsync(string username);
        Task<AuthResultDto> RefreshTokenAsync(string refreshToken);
        Task<UserProfileDto?> GetProfileAsync(string username);
        string CreateAccessToken(User user);
        (string Token, DateTime Expires) GenerateRefreshToken();
    }
}
