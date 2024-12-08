namespace Backend.Models
{
    public class SuccessLoginDto
    {
        public string Jwt { get; set; }
        public bool IsAdmin { get; set; }
    }
}
