using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class GalleriesController(LpPhotoDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Gallery>>> GetGalleries()
    {
        return await context.Galleries.ToListAsync();
    }
}