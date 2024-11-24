using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    public class AdminController : BaseController
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("events")]
        public async Task<IActionResult> GetEventsToVerify()
        {
            try
            {
                var result = await _adminService.GetUnverifiedEvents();
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }
        
        [HttpPost("events")]
        public async Task<IActionResult> VerifyEvent([FromBody]EventIdDto eventId)
        {
            try
            {
                var result = await _adminService.VerifyEvent(eventId.eventId);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        } 
        
        [HttpDelete("events/{eventId}")]
        public async Task<IActionResult> DeleteEvent([FromRoute]int eventId)
        {
            try
            {
                var result = await _adminService.DeleteEvent(eventId);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }


    }
}
