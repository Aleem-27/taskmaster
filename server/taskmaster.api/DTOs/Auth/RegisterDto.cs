namespace taskmaster.api.DTOs.Auth
{
    public class RegisterDto
    {
        public required string FullName { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
