namespace taskmaster.api.DTOs.Users
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? FullName { get; set; }
        public string? Role { get; set; }
        public DateTime? JoinDate { get; set; }
    }
}
