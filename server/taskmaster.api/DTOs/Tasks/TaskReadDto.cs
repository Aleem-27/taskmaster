namespace taskmaster.api.DTOs.Tasks
{
    public class TaskReadDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public DateTime DueDate { get; set; } 
    }
}
