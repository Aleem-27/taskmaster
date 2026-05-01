namespace taskmaster.api.DTOs
{
    public class RegisterDto
    {
        public required string FullName { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
