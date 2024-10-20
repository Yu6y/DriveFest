using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/workshop")]
    [Authorize]
    public class WorkshopController: BaseController
    {
        private readonly IWorkshopService _workshopService;

        public WorkshopController(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkshops()
        {
            var workshopList = await _workshopService.GetAllWorkshops();
            return new ObjectResult(workshopList) { StatusCode = 200 };
        }
    }
}
