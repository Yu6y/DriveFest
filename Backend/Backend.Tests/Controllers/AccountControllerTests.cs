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

        }
    }
}
