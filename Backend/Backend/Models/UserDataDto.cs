namespace Backend.Models
{
    public class UserDataDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsAdmin { get; set; }

    }
}
