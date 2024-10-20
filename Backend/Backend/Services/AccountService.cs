using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public interface IAccountService
    {
        Task<string> LoginUser(LoginDto loginDto);
        Task<bool> RegisterUser(RegisterDto registerDto);
        Task<UserDto> GetUserInfo(int userId);
    }

    public class AccountService : IAccountService
    {
        private EventsDbContext _dbContext;
        private IMapper _mapper;
        private AuthenticationSettings _authenticationSettings;

        public AccountService(EventsDbContext dbContext, IMapper mapper, AuthenticationSettings authenticationSettings)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _authenticationSettings = authenticationSettings;
        }

        public async Task<string> LoginUser(LoginDto loginDto)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(r => r.Email == loginDto.Email);

            if (user is null)
                throw new Exception("Credentials incorrect");

            if (user.HashPassword != loginDto.Password)
                throw new Exception("Credentials incorrect");

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("CreatedAt", user.CreatedAt.Value.ToString("yyyy-MM-dd HH:mm")),
                new Claim("UserPic", user.UserPic)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred);

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> RegisterUser(RegisterDto registerDto)
        {
            var user = await _dbContext
                .Users
                .AnyAsync(r => r.Username == registerDto.Username || r.Email == registerDto.Email);
            if (user)
                return false;

            var newUser = new User()
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                HashPassword = registerDto.Password,
                CreatedAt = DateTime.Now
            };
            try
            {
                _dbContext.Add(newUser);
                _dbContext.SaveChanges();
                return true;
            }catch(Exception e)
            {
                return false;
            }
        }

        public async Task<UserDto> GetUserInfo(int userId)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            return _mapper.Map<UserDto>(user);
        }
    }
}
