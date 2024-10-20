using Microsoft.EntityFrameworkCore;

namespace Backend.Entities
{
    public class EventsDbContext : DbContext
    {
        private string _connectionString =
            "Server=DESKTOP-O2VP0PF;Database=DriveFestDb;Trusted_Connection=True;TrustServerCertificate=True; MultipleActiveResultSets=True";

        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments {get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventDescription> EventDescriptions { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public DbSet<WorkshopComment> WorkshopComments { get; set; }
        public DbSet<Workshop> Workshops { get; set; }
        public DbSet<WorkshopDescription> WorkshopDescriptions { get; set; }
        public DbSet<WorkshopTag> WorkshopTags { get; set; }
        public DbSet<CarRegistry> CarRegistries { get; set; }
        public DbSet<CarExpense> CarExpenses { get; set; }
            
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(r => r.Username)
                .IsRequired();
            
            modelBuilder.Entity<User>()
                .Property(r => r.Email)
                .IsRequired();
            
            modelBuilder.Entity<User>()
                .Property(r => r.HashPassword)
                .IsRequired();

            modelBuilder.Entity<Event>()
                .HasOne(e => e.EventDescription)
                .WithOne(ed => ed.Event)
                .HasForeignKey<EventDescription>(ed => ed.EventId);

            // Relacja 1:N między EventDescription a Comment
            modelBuilder.Entity<EventDescription>()
                .HasMany(ed => ed.Comments)
                .WithOne(c => c.EventDescription)
                .HasForeignKey(c => c.EventDescriptionId);

            // Relacja 1:N między User a Comment
            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Event>()
                .HasMany(e => e.Tags)
                .WithMany(f => f.Events)
                .UsingEntity<Dictionary<string, object>>(
                "EventFilter",
                 j => j.HasOne<Tag>().WithMany().HasForeignKey("TagId"),  // Klucz obcy do Filter
                j => j.HasOne<Event>().WithMany().HasForeignKey("EventId"),    // Klucz obcy do Event
                j =>
                {
                    j.HasKey("EventId", "TagId"); // Klucz główny tabeli łączącej
                }
            );

             modelBuilder.Entity<User>()
                 .HasMany(u => u.LikedEvents)
                 .WithMany(e => e.LikedByUsers)
                 .UsingEntity<Dictionary<string, object>>(
                     "UserEvent",
                     r => r.HasOne<Event>().WithMany().HasForeignKey("EventId"),
                     l => l.HasOne<User>().WithMany().HasForeignKey("UserId"),
                     je =>
                     {
                         je.HasKey("UserId", "EventId");
                         je.ToTable("UserEvent");
                     }
              );

            modelBuilder.Entity<Workshop>()
               .HasOne(e => e.WorkshopDescription)
               .WithOne(ed => ed.Workshop)
               .HasForeignKey<WorkshopDescription>(ed => ed.WorkshopId);

            // Relacja 1:N między WorkshopDescription a WorkshopComment
            modelBuilder.Entity<WorkshopDescription>()
                .HasMany(ed => ed.WorkshopsComments)
                .WithOne(c => c.WorkshopDescription)
                .HasForeignKey(c => c.WokrshopDescriptionId);

            // Relacja 1:N między User a WorkshopComment
            modelBuilder.Entity<User>()
                .HasMany(u => u.WorkshopComments)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Workshop>()
                .HasMany(e => e.Tags)
                .WithMany(f => f.Workshops)
                .UsingEntity<Dictionary<string, object>>(
                "WorkshopFilter",
                 j => j.HasOne<WorkshopTag>().WithMany().HasForeignKey("TagId"),  // Klucz obcy do Filter
                j => j.HasOne<Workshop>().WithMany().HasForeignKey("WorkshopId"),    // Klucz obcy do Workshop
                j =>
                {
                    j.HasKey("WorkshopId", "TagId"); // Klucz główny tabeli łączącej
                }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }
    }
}
