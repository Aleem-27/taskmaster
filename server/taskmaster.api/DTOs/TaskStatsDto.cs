using Microsoft.Identity.Client;

namespace taskmaster.api.DTOs
{
    public class TaskStatsDto
    {
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Pending { get; set; }
    }
}
