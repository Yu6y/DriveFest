using Microsoft.IdentityModel.Tokens;
using Backend.Entities;
using Backend.Services;
using System.Reflection;
using System.Text;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var authenticationSettings = new AuthenticationSettings();
            // Add services to the container.

            builder.Configuration.GetSection("Authentication").Bind(authenticationSettings);
            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authenticationSettings.JwtIssuer,
                    ValidAudience = authenticationSettings.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey)),
                };
            });

            builder.Services.AddSingleton(authenticationSettings);
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<EventsDbContext>();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAutoMapper(Assembly.GetEntryAssembly());
            builder.Services.AddScoped<IAccountService, AccountService>();
            builder.Services.AddScoped<IEventService, EventService>();
            builder.Services.AddScoped<IWorkshopService, WorkshopService>();
            builder.Services.AddScoped<ICarRegisterService, CarRegisterService>();
            builder.Services.AddScoped<IAdminService, AdminService>();
            
       


            var app = builder.Build();

            app.UseAuthentication();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(options =>
                options.AllowAnyOrigin()//options.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
