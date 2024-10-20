using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    public abstract class BaseController: Controller
    {
        protected int GetUserId()
        {
            return int.Parse(this.User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value);
        }

        protected string GetUserPic()
        {
            return this.User.Claims.First(i => i.Type == "UserPic").Value;
        }

        protected string GetUsername()
        {
            return this.User.Claims.First(i => i.Type == ClaimTypes.Name).Value;
        }
    }
}
