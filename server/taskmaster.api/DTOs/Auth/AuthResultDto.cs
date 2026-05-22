namespace taskmaster.api.DTOs.Auth
{
    public class AuthResultDto
    {
        public bool Success { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? Expiry { get; set; }
    }
}