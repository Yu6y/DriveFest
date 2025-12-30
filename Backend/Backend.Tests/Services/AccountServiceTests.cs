using AutoMapper;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.Extensions.DependencyInjection;
using Backend.Exceptions;
using Microsoft.AspNetCore.Http;
using NuGet.Frameworks;

namespace Backend.Tests.Services
{
    public class AccountServiceTests
    {
        private readonly EventsDbContext context;
        private readonly Mock<IMapper> mockMapper;
        private readonly AuthenticationSettings mockAuthSettings;
        private readonly PasswordHasher<object> passwordHasher;

        public AccountServiceTests()
        {
            var serviceProvider = new ServiceCollection()
               .AddEntityFrameworkInMemoryDatabase()
               .BuildServiceProvider();

            var options = new DbContextOptionsBuilder<EventsDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseInternalServiceProvider(serviceProvider)
                .Options;

            context = new EventsDbContext(options);

            mockMapper = new Mock<IMapper>();

            mockAuthSettings = new AuthenticationSettings
            {
                JwtKey = "super-secret-key-which-is-long-enough",
                JwtExpireDays = 1,
                JwtIssuer = "issuer"
            };

            passwordHasher = new PasswordHasher<object>();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        [Fact]
        public async Task LoginUser_ValidUser_ReturnsJwt()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var loginDto = new LoginDto
            {
                Email = "email",
                Password = "password"
            };

            var result = await service.LoginUser(loginDto);

            Assert.NotNull(result);
            Assert.False(string.IsNullOrWhiteSpace(result.Jwt));
            Assert.False(result.IsAdmin);
        }

        [Fact]
        public async Task LoginUser_ValidUser_ReturnsJwtAndAdmin()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = true
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var loginDto = new LoginDto
            {
                Email = "email",
                Password = "password"
            };

            var result = await service.LoginUser(loginDto);

            Assert.NotNull(result);
            Assert.False(string.IsNullOrWhiteSpace(result.Jwt));
            Assert.True(result.IsAdmin);
        }

        [Fact]
        public async Task LoginUser_InvalidUsername_ThrowsException()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var loginDto = new LoginDto
            {
                Email = "invalidUsername",
                Password = "password"
            };

            var result = await Assert.ThrowsAsync<InvalidCredentialsException>(() =>
                service.LoginUser(loginDto));

            Assert.Equal("Credentials incorrect", result.Message);
        }

        [Fact]
        public async Task LoginUser_InvalidPassword_ThrowsException()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var loginDto = new LoginDto
            {
                Email = "email",
                Password = "invalidPassword"
            };

            var result = await Assert.ThrowsAsync<InvalidCredentialsException>(() =>
                service.LoginUser(loginDto));

            Assert.Equal("Credentials incorrect", result.Message);
        }

        [Fact]
        public void CheckPassword_CorrectPassword_ReturnsTrue()
        {
            var service = new AccountService(null, null, null);

            var result = service.checkPassword(new PasswordHasher<object>().HashPassword(null, "password"),
                "password");

            Assert.True(result);
        }

        [Fact]
        public void CheckPassword_IncorrectPassword_ReturnsFalse()
        {
            var service = new AccountService(null, null, null);

            var result = service.checkPassword(new PasswordHasher<object>().HashPassword(null, "something"),
                "password");

            Assert.False(result);
        }

        [Fact]
        public async Task RegisterUser_ValidUser_CreatesAccount()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var registerDto = new RegisterDto
            {
                Username = "newUser",
                Email = "newMail",
                Password = "password",
                PhotoURL = null
            };

            var result = await service.RegisterUser(registerDto);

            Assert.NotNull(result);
            Assert.True(result.ContainsKey(true));
            Assert.Equal(2, context.Users.Count());
        }

        [Fact]
        public async Task RegisterUser_UsernameInUse_ReturnsError()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var registerDto = new RegisterDto
            {
                Username = "username",
                Email = "newMail",
                Password = "password",
                PhotoURL = null
            };


            var result = await service.RegisterUser(registerDto);


            Assert.NotNull(result);
            Assert.True(result.ContainsKey(false));
            Assert.True(result[false].Errors.ContainsKey("username"));
            Assert.Equal("Podana nazwa użytkownika jest już zajęta.", result[false].Errors["username"]);
        }

        [Fact]
        public async Task RegisterUser_EmailInUse_ReturnsError()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var registerDto = new RegisterDto
            {
                Username = "newUser",
                Email = "email",
                Password = "password",
                PhotoURL = null
            };


            var result = await service.RegisterUser(registerDto);


            Assert.NotNull(result);
            Assert.True(result.ContainsKey(false));
            Assert.True(result[false].Errors.ContainsKey("email"));
            Assert.Equal("Podany adres email jest już zajęty.", result[false].Errors["email"]);
        }

        [Fact]
        public async Task RegisterUser_IncorrectPhoto_ReturnsError()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var registerDto = new RegisterDto
            {
                Username = "newUser",
                Email = "newEmail",
                Password = "password",
                PhotoURL = new FormFile(null, 0, 0, "", "file.pdf")
            };


            var result = await service.RegisterUser(registerDto);


            Assert.NotNull(result);
            Assert.True(result.ContainsKey(false));
            Assert.True(result[false].Errors.ContainsKey("photo"));
            Assert.Equal("Podane zdjęcie jest niepoprawne.", result[false].Errors["photo"]);
        }

        [Fact]
        public async Task RegisterUser_NewUserAttempt_ThrowsException()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var mockFormFile = new Mock<IFormFile>();
            mockFormFile.Setup(f => f.OpenReadStream()).Throws(new Exception("exception"));
            mockFormFile.Setup(f => f.FileName).Returns("photo.jpg");

            var registerDto = new RegisterDto
            {
                Username = "newUser",
                Email = "newEmail",
                Password = "password",
                PhotoURL = mockFormFile.Object
            };


            var result = await service.RegisterUser(registerDto);


            Assert.NotNull(result);
            Assert.True(result.ContainsKey(false));
            Assert.True(result[false].Errors.ContainsKey("general"));
            Assert.Equal("Nie udało się utworzyć konta.", result[false].Errors["general"]);
        }

        [Fact]
        public async Task GetUserInfo_ValidUser_ReturnsUserInfo()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false,
                LikedEvents = new List<Event>()
            };

            var userEvent = new Event
            {
                Id = 0,
                Name = "event",
                Date = DateTime.UtcNow,
                Location = "location",
                Voivodeship = "voivodeship",
                FollowersCount = 1,
                Image = "",
                Tags = new List<Tag>(),
                IsVerified = true,
                LikedByUsers = new List<User>()
            };

            user.LikedEvents.Add(userEvent);
            userEvent.LikedByUsers.Add(user);

            context.Events.Add(userEvent);
            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            int userId = 1;
            var expectedUserData = new UserDto
            {
                Id = 0,
                Username = "username",
                Email = "email",
                FollowedEvent = new EventDto
                {
                    Id = 0,
                    Name = "event",
                    Date = DateTime.UtcNow,
                    Location = "location",
                    Voivodeship = "voivodeship",
                    FollowersCount = 1,
                    Image = "",
                    Tags = new List<TagsDto>(),
                    IsVerified = true,
                    IsFavorite = true
                },
                UserPic = "userPic"
            };

            mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
                .Returns(expectedUserData);
            mockMapper.Setup(m => m.Map<EventDto>(It.IsAny<Event>()))
                .Returns(expectedUserData.FollowedEvent);


            var result = await service.GetUserInfo(userId);


            Assert.NotNull(result);
            Assert.Equal(expectedUserData.Id, result.Id);
            Assert.Equal(expectedUserData.Username, result.Username);
            Assert.Equal(expectedUserData.Email, result.Email);
            Assert.Equal(expectedUserData.UserPic, result.UserPic);
            Assert.NotNull(result.FollowedEvent);
            Assert.Equal(expectedUserData.FollowedEvent.Id, result.FollowedEvent.Id);
            Assert.Equal(expectedUserData.FollowedEvent.Name, result.FollowedEvent.Name);
            Assert.Equal(expectedUserData.FollowedEvent.IsFavorite, result.FollowedEvent.IsFavorite);
        } 
        
        [Fact]
        public async Task GetUserInfo_ValidUser_ReturnsUserInfoWithoutEvent()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false,
                LikedEvents = new List<Event>()
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            int userId = 1;
            var expectedUserData = new UserDto
            {
                Id = 0,
                Username = "username",
                Email = "email",
                FollowedEvent = null,
                UserPic = "userPic"
            };

            mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
                .Returns(expectedUserData);

            var result = await service.GetUserInfo(userId);

            Assert.NotNull(result);
            Assert.Equal(expectedUserData.Id, result.Id);
            Assert.Equal(expectedUserData.Username, result.Username);
            Assert.Equal(expectedUserData.Email, result.Email);
            Assert.Equal(expectedUserData.UserPic, result.UserPic);
            Assert.Null(result.FollowedEvent);
        } 
        
        [Fact]
        public async Task GetUserInfo_InvalidUser_ThrowsException()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false,
                LikedEvents = new List<Event>()
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            int userId = -1;

            var result = await Assert.ThrowsAsync<Exception>(() =>
               service.GetUserInfo(userId));

            Assert.Equal("User not found", result.Message);
        }
        
        [Fact]
        public async Task GetUserRole_ValidUser_ReturnsUser()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = false,
                LikedEvents = new List<Event>()
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var result = await service.GetUserRole(user.Id);

            Assert.NotNull(result);
            Assert.False(result.IsAdmin);
        } 
        
        [Fact]
        public async Task GetUserRole_ValidUser_ReturnsAdmin()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = true,
                LikedEvents = new List<Event>()
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            var result = await service.GetUserRole(user.Id);

            Assert.NotNull(result);
            Assert.True(result.IsAdmin);
        }
        
        [Fact]
        public async Task GetUserRole_InvalidUser_ThrowsException()
        {
            var user = new User
            {
                Id = 1,
                Username = "username",
                Email = "email",
                HashPassword = passwordHasher.HashPassword(null, "password"),
                CreatedAt = DateTime.UtcNow,
                UserPic = "userPic",
                IsAdmin = true,
                LikedEvents = new List<Event>()
            };

            context.Users.Add(user);
            context.SaveChanges();

            var service = new AccountService(context, mockMapper.Object, mockAuthSettings);

            int userId = -1;

            var result = await Assert.ThrowsAsync<Exception>(() =>
               service.GetUserRole(userId));

            Assert.Equal("User not found", result.Message);
        }
    }
}
