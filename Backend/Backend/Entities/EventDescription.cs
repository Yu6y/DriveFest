namespace Backend.Entities
{
    public class EventDescription
    {
        public int Id { get; set; }               
        public string Address { get; set; }       
        public string Description { get; set; }   
        public int EventId { get; set; }
       
        public virtual Event Event { get; set; }          
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}
