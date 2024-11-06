namespace Backend.Models
{
    public class AddCarExpenseDto
    {
        public string Type { get; set; }
        public double Price { get; set; }
        public string Date { get; set; }
        public string Description { get; set; }
    }
}
