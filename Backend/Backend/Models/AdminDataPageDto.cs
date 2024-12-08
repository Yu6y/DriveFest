namespace Backend.Models
{
    public class AdminDataPageDto<T>
    {
        public List<T> List { get; set; }
        public int Total { get; set; }
    }
}
