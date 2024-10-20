using Backend.Entities;

namespace Backend.Models
{
    public class EventDescDto : EventDto
    { 
        public int EventDescId { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
