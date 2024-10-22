using Microsoft.Identity.Client;

namespace Backend.Models
{
    public class RegistrationError
    {
        public Dictionary<string, string> Errors { get; set; } = new Dictionary<string, string>();
    }

    public class Error
    {
        public string Message { get; set; }
    }
}
