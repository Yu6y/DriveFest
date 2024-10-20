using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
namespace Backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody]LoginDto loginDto)
        {
            try
            {
                var token = await _accountService.LoginUser(loginDto);
                return new ObjectResult(token) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                return new ObjectResult(ex.Message) { StatusCode = 404 };
            }   
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody]RegisterDto registerDto)
        {
            var userRegistered = await _accountService.RegisterUser(registerDto);
            if(userRegistered)
                return Ok("Success");
            return BadRequest("Fail");
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser([FromRoute] int userId)
        {
            try
            {
                var user = await _accountService.GetUserInfo(userId);
                return new ObjectResult(user){ StatusCode = 200};
            }catch(Exception e)
            {
                return new ObjectResult(e.Message){ StatusCode = 404};
            }
        }
    }
    //////// w contorllerach try catch i do jsona 
    //////// JWT
    //////// HASH HASLA
}
