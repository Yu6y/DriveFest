namespace Backend.Models
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public string Username { get; set; }
        public string UserPic { get; set; }
        public int UserId { get; set; }
    }
}
