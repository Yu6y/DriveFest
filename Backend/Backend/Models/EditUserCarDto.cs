namespace Backend.Models
{
    public class EditUserCarDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IFormFile? PhotoUrl { get; set; }
    }
}
