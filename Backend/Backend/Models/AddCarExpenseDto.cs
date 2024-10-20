namespace Backend.Models
{
    public class AddCarExpenseDto
    {
        public string Type { get; set; }
        public float Price { get; set; }
        public string Date { get; set; }
        public string Description { get; set; }
    }
}
