namespace Backend.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public EventDto? FollowedEvent { get; set; }
        public string UserPic { get; set; }
    }
}
