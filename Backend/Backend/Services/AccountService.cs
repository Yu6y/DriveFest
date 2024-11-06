using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
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
        Task<Dictionary<bool, RegistrationError>> RegisterUser(RegisterDto registerDto);
        Task<UserDto> GetUserInfo(int userId);
    }

    public class AccountService : IAccountService
    {
        private EventsDbContext _dbContext;
        private IMapper _mapper;
        private AuthenticationSettings _authenticationSettings;
        private PasswordHasher<object> _passwordHasher;

        public AccountService(EventsDbContext dbContext, IMapper mapper, AuthenticationSettings authenticationSettings)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _authenticationSettings = authenticationSettings;
            _passwordHasher = new PasswordHasher<object>();
        }

        public async Task<string> LoginUser(LoginDto loginDto)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(r => r.Email == loginDto.Email);

            if (user is null)
                throw new Exception("Credentials incorrect");

            if (!checkPassword(user.HashPassword, loginDto.Password))
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

        public bool checkPassword(string hash, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hash, password);
            return result == PasswordVerificationResult.Success;
        }

        public async Task<Dictionary<bool, RegistrationError>> RegisterUser(RegisterDto registerDto)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(r => r.Username == registerDto.Username || r.Email == registerDto.Email);

            var responseErrors = new RegistrationError();

            if (user != null)
            {
                if(user.Email == registerDto.Email)
                {
                    responseErrors.Errors.Add("email", "Podany adres email jest już zajęty.");
                }
                if(user.Username == registerDto.Username)
                {
                   responseErrors.Errors.Add("username", "Podana nazwa użytkownika jest już zajęta.");
                }
                return new Dictionary<bool, RegistrationError>() { { false, responseErrors } };
            }
           

            var newUser = new User()
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                HashPassword = _passwordHasher.HashPassword(null, registerDto.Password),
                UserPic = "",
                CreatedAt = DateTime.Now
            };
            try
            {
                _dbContext.Add(newUser);
                _dbContext.SaveChanges();
                return new Dictionary<bool, RegistrationError> { { true, new RegistrationError() } };
            }catch(Exception e)
            {
                
                responseErrors.Errors.Add("general", "Nie udało się utworzyć konta.");

                return new Dictionary<bool, RegistrationError>() { { false, responseErrors } };
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
