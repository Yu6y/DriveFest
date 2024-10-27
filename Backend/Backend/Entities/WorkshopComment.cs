namespace Backend.Entities
{
    public class WorkshopComment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public string Username { get; set; }
        public string UserPic { get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; }
        public int WorkshopDescriptionId { get; set; }
        public virtual WorkshopDescription WorkshopDescription { get; set; }
    }
}
