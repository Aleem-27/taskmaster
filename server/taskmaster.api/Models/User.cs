using System.ComponentModel.DataAnnotations;

namespace taskmaster.api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";

        public DateTime JoinDate { get; set; } = DateTime.Now;

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? TokenCreated { get; set; }
        public DateTime? TokenExpires { get; set; }
    }
}