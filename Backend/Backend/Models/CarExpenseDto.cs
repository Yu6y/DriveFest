namespace Backend.Models
{
    public class CarExpenseDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}
