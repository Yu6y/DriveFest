using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/workshop")]
    [Authorize]
    public class WorkshopController : BaseController
    {
        private readonly IWorkshopService _workshopService;

        public WorkshopController(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkshops()
        {
            try
            {
                var workshopList = await _workshopService.GetAllWorkshops();
                return new ObjectResult(workshopList) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetTags()
        {
            try
            {
                var tags = await _workshopService.GetWorkshopTags();
                return new ObjectResult(tags) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }


        [HttpGet("filters")]
        public async Task<IActionResult> GetEventsFiltered(
            [FromQuery] string searchTerm,
            [FromQuery] string sortBy,
            [FromQuery] string? tags,
            [FromQuery] string? voivodeships)
        {
            try
            {
                var workshopsList = await _workshopService.GetFilteredWorkshops(searchTerm, sortBy, tags, voivodeships, GetUserId());
                return new ObjectResult(workshopsList) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }

        }

        [HttpGet("{workshopId}")]
        public async Task<IActionResult> GetWorkshopDesc([FromRoute] int workshopId)
        {
            try
            {
                var workshop = await _workshopService.GetWorkshopDesc(workshopId);
                return new ObjectResult(workshop) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                return new ObjectResult(ex.Message) { StatusCode = 500 };
            }
        }
        
        [HttpGet("{workshopId}/comments")]
        public async Task<IActionResult> GetWorkshopComments([FromRoute] int workshopId)
        {
            try
            {
                var workshop = await _workshopService.GetComments(workshopId);
                return new ObjectResult(workshop) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                return new ObjectResult(ex.Message) { StatusCode = 500 };
            }
        }
        
        [HttpPost("{workshopId}/comments")]
        public async Task<IActionResult> AddComment([FromRoute] int workshopId, [FromBody] CommentContentDto comment)
        {
            try
            {
                var workshop = await _workshopService.AddComment(workshopId, comment.content, GetUserId(), GetUsername(), GetUserPic());
                return new ObjectResult(workshop) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkshop([FromForm] AddWorkshopDto workshopDto)
        {
            try
            {
                var result = await _workshopService.AddWorkshop(workshopDto);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult("Nie udało się dodać warsztatu!") { StatusCode = 500 };
            }
        }

    }
}
