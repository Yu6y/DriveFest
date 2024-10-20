namespace Backend.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content {  get; set; }
        public DateTime Timestamp { get; set; }
        public string Username { get; set; }
        public string UserPic {  get; set; }
        public int UserId { get; set; }

        public virtual User User {  get; set; }
        public int  EventDescriptionId {  get; set; }
        public virtual EventDescription EventDescription {  get; set; }
    }
}
