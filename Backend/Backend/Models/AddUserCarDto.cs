namespace Backend.Models
{
    public class AddUserCarDto
    {
        public string Name { get; set; }
        public IFormFile? PhotoUrl { get; set; }
    }
}
