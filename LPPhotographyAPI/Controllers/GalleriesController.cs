using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class GalleriesController : BaseApiController
{
    private readonly LpPhotoDbContext _context;
    private readonly UserManager<SiteUser> _userManager;

    public GalleriesController(LpPhotoDbContext context, UserManager<SiteUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<List<Gallery>>> GetGalleries()
    {
        return await _context.Galleries
            .Where(g => !g.IsPrivate)
            .Include(g => g.Photos)
            .ToListAsync();
    }
    
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<Gallery>>> GetAllGalleries()
    {
        return await _context.Galleries
            .Include(g => g.Photos)
            .ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetGalleryById(string id, [FromQuery] string? accessCode) 
    {
        var gallery = await _context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gallery == null)
            return NotFound();

        if (!gallery.IsPrivate)
            return Ok(gallery);

        if (string.IsNullOrWhiteSpace(accessCode) || accessCode != gallery.AccessCode)
            return Unauthorized("Access code is required or incorrect for this private gallery.");

        return Ok(gallery);
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosByGalleryId(string id)
    {
        var gallery = await _context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gallery == null)
            return NotFound();

        return Ok(gallery.Photos);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Gallery>> CreateGallery(Gallery gallery)
    {
        _context.Galleries.Add(gallery);

        if (gallery.IsPrivate && !string.IsNullOrWhiteSpace(gallery.ClientEmail))
        {
            var existingUser = await _userManager.FindByEmailAsync(gallery.ClientEmail);
            if (existingUser == null)
            {
                var clientUser = new SiteUser
                {
                    UserName = gallery.ClientEmail,
                    Email = gallery.ClientEmail,
                    AccessCode = gallery.AccessCode,
                    Role = "Client",
                };

                var result = await _userManager.CreateAsync(clientUser);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                await _userManager.AddToRoleAsync(clientUser, "Client");
            }
            else
            {
                existingUser.AccessCode = gallery.AccessCode;
                await _userManager.UpdateAsync(existingUser);
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGalleryById), new { id = gallery.Id }, gallery);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGallery(string id)
    {
        var gallery = await _context.Galleries.FindAsync(id);
        if (gallery == null)
            return NotFound();

        _context.Galleries.Remove(gallery);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("client")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<Gallery>> GetClientGallery()
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized("No authenticated user");

        var gallery = await _context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g =>
                g.IsPrivate &&
                g.ClientEmail == email);

        if (gallery == null)
            return NotFound("No gallery found for this client");

        return Ok(gallery);
    }
}
