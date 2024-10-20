namespace Backend.Models
{
    public class CarExpenseDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public float Price { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
    }
}
