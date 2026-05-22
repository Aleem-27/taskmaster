namespace taskmaster.api.DTOs.Tasks
{
    public class TaskCreateDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(1);
    }
}
