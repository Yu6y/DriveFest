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
        public async Task<IActionResult> GetEventsToVerify([FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            try
            {
                var result = await _adminService.GetUnverifiedEvents(pageIndex, pageSize);
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

        [HttpGet("event/{id}")]
        public async Task<IActionResult> GetEventToEdit([FromRoute]int id)
        {
            try
            {
                var result = await _adminService.GetEventToEdit(id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPatch("event")]
        public async Task<IActionResult> UpdateEvent([FromForm]EditEventFormDto data)
        {
            try
            {
                var result = await _adminService.EditEvent(data);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("workshops")]
        public async Task<IActionResult> GetWorkshopsToVerify([FromQuery] int pageIndex, [FromQuery] int pageSize)
        {
            try
            {
                var result = await _adminService.GetUnverifiedWorkshops(pageIndex, pageSize);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("workshops")]
        public async Task<IActionResult> VerifyWorkshop([FromBody] WorkshopIdDto workshopId)
        {
            try
            {
                var result = await _adminService.VerifyWorkshop(workshopId.Id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpDelete("workshops/{workshopId}")]
        public async Task<IActionResult> DeleteWorkshop([FromRoute] int workshopId)
        {
            try
            {
                var result = await _adminService.DeleteWorkshop(workshopId);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("workshop/{id}")]
        public async Task<IActionResult> GetWorkshopToEdit([FromRoute] int id)
        {
            try
            {
                var result = await _adminService.GetWorkshopToEdit(id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPatch("workshop")]
        public async Task<IActionResult> UpdateWorkshop([FromForm] EditWorkshopFormDto data)
        {
            try
            {
                var result = await _adminService.EditWorkshop(data);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsersData([FromQuery] int pageIndex, [FromQuery] int pageSize)
        {
            try
            {
                var result = await _adminService.GetUsersData(GetUserId(), pageIndex, pageSize);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("user/promote")]
        public async Task<IActionResult> PromoteUser([FromBody]UserIdDto id)
        {
            try
            {
                var result = await _adminService.PromoteUser(id.Id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }
        [HttpPost("user/demote")]
        public async Task<IActionResult> DemoteUser([FromBody] UserIdDto id)
        {
            try
            {
                var result = await _adminService.DemoteUser(id.Id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }
    }
}
