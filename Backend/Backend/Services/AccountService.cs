﻿using AutoMapper;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Firebase.Storage;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.ConstrainedExecution;
using System.Security.Claims;
using System.Text;


namespace Backend.Services
{
    public interface IAccountService
    {
        Task<SuccessLoginDto> LoginUser(LoginDto loginDto);
        Task<Dictionary<bool, RegistrationError>> RegisterUser(RegisterDto registerDto);
        Task<UserDto> GetUserInfo(int userId);
        Task<IsAdminDto> GetUserRole(int userId);
    }

    public class AccountService : IAccountService
    {
        private EventsDbContext _dbContext;
        private IMapper _mapper;
        private AuthenticationSettings _authenticationSettings;
        private PasswordHasher<object> _passwordHasher;
        private Random random = new Random();

        public AccountService(EventsDbContext dbContext, IMapper mapper, AuthenticationSettings authenticationSettings)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _authenticationSettings = authenticationSettings;
            _passwordHasher = new PasswordHasher<object>();
        }

        public async Task<SuccessLoginDto> LoginUser(LoginDto loginDto)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(r => r.Email == loginDto.Email || r.Username == loginDto.Email);

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

            if (user.IsAdmin)
                claims.Add(new Claim(ClaimTypes.Role, "admin"));
            else
                claims.Add(new Claim(ClaimTypes.Role, "user"));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred);

            var tokenHandler = new JwtSecurityTokenHandler();
            return new SuccessLoginDto()
            {
                Jwt = tokenHandler.WriteToken(token),
                IsAdmin = user.IsAdmin
            };
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

            if (registerDto.PhotoURL != null &&
               (System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".jpg" &&
               System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".jpeg" &&
               System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".bmp" &&
               System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".png"))
            {
                responseErrors.Errors.Add("photo", "Podane zdjęcie jest niepoprawne.");
                return new Dictionary<bool, RegistrationError>() { { false, responseErrors } };
            }

                

            if (user != null)
            {
                if (user.Email == registerDto.Email)
                {
                    responseErrors.Errors.Add("email", "Podany adres email jest już zajęty.");
                }
                if(user.Username == registerDto.Username)
                {
                   responseErrors.Errors.Add("username", "Podana nazwa użytkownika jest już zajęta.");
                }
                if (registerDto.PhotoURL != null &&
                   (System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".jpg" &&
                   System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".jpeg" &&
                   System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".bmp" &&
                   System.IO.Path.GetExtension(registerDto.PhotoURL.FileName) != ".png"))
                    responseErrors.Errors.Add("photo", "Podane zdjęcie jest niepoprawne.");

                    return new Dictionary<bool, RegistrationError>() { { false, responseErrors } };
            }
           

            var newUser = new User()
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                HashPassword = _passwordHasher.HashPassword(null, registerDto.Password),
                CreatedAt = DateTime.Now,
                IsAdmin = false
            };
            try
            {
                if (registerDto.PhotoURL != null)
                    newUser.UserPic = await uploadPhoto(registerDto.PhotoURL);
                else
                    newUser.UserPic = "https://firebasestorage.googleapis.com/v0/b/moto-event.appspot.com/o/images%2Fusers%2Fdefault.jpg?alt=media&token=98a3e130-f318-4581-9a71-21fa18755eba";

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

            var userInfo =  _mapper.Map<UserDto>(user);
                
            var events = await _dbContext
                .Events
                .Where(l => l.LikedByUsers.Any(r => r.Id == userId))
                .OrderBy(d => d.Date)
                .ToListAsync();

            if (events.Count == 0)
                userInfo.FollowedEvent = null;

            foreach(var item in events)
            {
                if(item.Date.Date >= DateTime.Now.Date)
                {
                    userInfo.FollowedEvent = _mapper.Map<EventDto>(item);
                    userInfo.FollowedEvent.IsFavorite = true;
                }
            }

            return userInfo;
        }

        public async Task<IsAdminDto> GetUserRole(int userId)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            return new IsAdminDto()
            {
                IsAdmin = user.IsAdmin
            };
        }

        public async Task<string> uploadPhoto(IFormFile file)
        {
            var stream = file.OpenReadStream();

            var task = new FirebaseStorage(DatabaseLink.StorageAddress)
             .Child("images")
             .Child("users")
             .Child(GenerateRandomString() + System.IO.Path.GetExtension(file.FileName))
             .PutAsync(stream);

            //task.Progress.ProgressChanged += (s, e) => Console.WriteLine($"Progress: {e.Percentage} %");

            var downloadUrl = await task;

            return downloadUrl;
        }

        public string GenerateRandomString()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            return new string(Enumerable.Repeat(chars, 20)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
