using Backend.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Exceptions;
using Azure;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Backend.Tests.Controllers
{
    public class AccountControllerTests
    {
        private readonly Mock<IAccountService> mockService;
        private readonly AccountController accountController;

        public AccountControllerTests()
        {
            mockService = new Mock<IAccountService>();
            accountController = new AccountController(mockService.Object);
        }

        [Fact]
        public async Task LoginUser_ValidUser_ReturnsToken()
        {
            var loginDto = new LoginDto
            {
                Email = "mail",
                Password = "password",
            };

            var expectedData = new SuccessLoginDto
            {
                Jwt = "token",
                IsAdmin = true
            };

            mockService.Setup(x => x.LoginUser(loginDto)).ReturnsAsync(expectedData);

            var result = await accountController.LoginUser(loginDto);

            var okResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.IsType<SuccessLoginDto>(okResult.Value);
            Assert.Equal(okResult.Value, expectedData);
        }

        [Fact]
        public async Task LoginUser_InvalidUser_ThrowsException()
        {
            var loginDto = new LoginDto
            {
                Email = "email",
                Password = "password"
            };

            var expectedResponse = "Credentials incorrect";

            mockService.Setup(x => x.LoginUser(It.IsAny<LoginDto>())).Throws(new InvalidCredentialsException(expectedResponse));

            var result = await accountController.LoginUser(loginDto);

            var badResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, badResult.StatusCode);
            Assert.Equal(expectedResponse, badResult.Value);
        }

        [Fact]
        public async Task RegisterUser_ValidUser_CreatesAccount()
        {
            var registerDto = new RegisterDto
            {
                Username = "username",
                Email = "email",
                Password = "password",
                PhotoURL = null
            };

            var expectedResponse = new Dictionary<string, string> { { "success", "Konto pomyślnie utworzone." } };
            var expectedData = new Dictionary<bool, RegistrationError> { { true, new RegistrationError() } };

            mockService.Setup(x => x.RegisterUser(registerDto)).ReturnsAsync(expectedData);

            var result = await accountController.RegisterUser(registerDto);

            var okResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(expectedResponse, okResult.Value);
        }

        [Fact]
        public async Task RegisterUser_InvalidUser_ReturnsErrors()
        {
            var responseErrors = new RegistrationError();
            responseErrors.Errors.Add("email", "Podany adres email jest już zajęty.");
            responseErrors.Errors.Add("username", "Podana nazwa użytkownika jest już zajęta.");
            responseErrors.Errors.Add("photo", "Podane zdjęcie jest niepoprawne.");

            var expectedData = new Dictionary<bool, RegistrationError> { { false, responseErrors } };

            mockService.Setup(x => x.RegisterUser(It.IsAny<RegisterDto>())).ReturnsAsync(expectedData);

            var result = await accountController.RegisterUser(new RegisterDto());

            var badResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);
            Assert.Equal(expectedData[false], badResult.Value);
        }

        [Fact]
        public async Task RegisterUser_GeneralError_ReturnsError()
        {
            var expectedResult =  "Nie udało się utworzyć konta.";

            mockService.Setup(x => x.RegisterUser(It.IsAny<RegisterDto>())).Throws(new Exception("Nie udało się utworzyć konta."));

            var result = await accountController.RegisterUser(new RegisterDto());

            var badResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(404, badResult.StatusCode);
            Assert.Equal(expectedResult, badResult.Value);
        }

        [Fact]
        public async Task GetUser_ValidUser_GetUserInfo()
        {
            var userDto = new UserDto
            {
                Id = 0,
                Username = "username",
                Email = "email",
                FollowedEvent = new EventDto
                {
                    Id = 0,
                    Name = "event",
                    Date = DateTime.Now,
                    Location = "location",
                    Voivodeship = "voivodeship",
                    FollowersCount = 1,
                    Image = "image",
                    IsFavorite = true,
                    Tags = new List<TagsDto>(),
                    IsVerified = true
                },
                UserPic = null
            };

            mockService.Setup(x => x.GetUserInfo(It.IsAny<int>())).ReturnsAsync(userDto);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
               {
                    new Claim(ClaimTypes.NameIdentifier, "0"),
                    new Claim(ClaimTypes.Name, "username"),
                    new Claim(ClaimTypes.Role, "user"),
                    new Claim("userPic", "")
               }, "mock"));

            accountController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var result = await accountController.GetUser();
            var okResult = Assert.IsType<ObjectResult>(result);

            Assert.Equal(userDto, okResult.Value);
            Assert.Equal(200, okResult.StatusCode);

        }

        [Fact]
        public async Task GetUser_InvalidUser_Returns500Error()
        {
            var expectedResponse = "User not found";

            mockService.Setup(x => x.GetUserInfo(It.IsAny<int>())).Throws(new Exception("User not found"));


            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
               {
                    new Claim(ClaimTypes.NameIdentifier, "0"),
                    new Claim(ClaimTypes.Name, "username"),
                    new Claim(ClaimTypes.Role, "user"),
                    new Claim("userPic", "")
               }, "mock"));

            accountController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var result = await accountController.GetUser();

            var badResult = Assert.IsType<ObjectResult>(result);

            Assert.Equal(500, badResult.StatusCode);
            Assert.Equal(expectedResponse, badResult.Value);
        }

        [Fact]
        public async Task GetUserRole_ValidUser_ReturnsUserRole()
        {
            var isAdminDto = new IsAdminDto
            {
                IsAdmin = true
            };
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
             {
                    new Claim(ClaimTypes.NameIdentifier, "0"),
                    new Claim(ClaimTypes.Name, "username"),
                    new Claim(ClaimTypes.Role, "admin"),
                    new Claim("userPic", "")
             }, "mock"));

            accountController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            mockService.Setup(x => x.GetUserRole(It.IsAny<int>())).ReturnsAsync(isAdminDto);

            var result = await accountController.GetUserRole();

            var okResult = Assert.IsType<ObjectResult>(result);

            Assert.Equal(isAdminDto, okResult.Value);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task GetUserRole_InvalidUser_ReturnsError()
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
             {
                    new Claim(ClaimTypes.NameIdentifier, "0"),
                    new Claim(ClaimTypes.Name, "username"),
                    new Claim(ClaimTypes.Role, "admin"),
                    new Claim("userPic", "")
             }, "mock"));

            accountController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var expectedResponse = "User not found";

            mockService.Setup(x => x.GetUserRole(It.IsAny<int>())).Throws(new Exception("User not found"));

            var result = await accountController.GetUserRole();

            var badResult = Assert.IsType<ObjectResult>(result);

            Assert.Equal(500, badResult.StatusCode);
            Assert.Equal(expectedResponse, badResult.Value);
        }
    }
}
