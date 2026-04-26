using System.ComponentModel.DataAnnotations;

namespace taskmaster.api.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "Pending";
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}