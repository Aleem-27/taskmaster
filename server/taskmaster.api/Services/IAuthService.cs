using taskmaster.api.Models;

namespace taskmaster.api.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string fullname, string username, string password);
        Task<AuthResultDto> LoginAsync(string username, string password);
        string CreateAccessToken(User user);
        (string Token, DateTime Expires) GenerateRefreshToken();
    }
}
