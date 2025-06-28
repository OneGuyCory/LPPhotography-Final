using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class GalleriesController(LpPhotoDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Gallery>>> GetGalleries()
    {
        return await context.Galleries
            .Where(g => !g.IsPrivate)
            .Include(g => g.Photos) // EF to load photos in gallery as well
            .ToListAsync(); //returns as list
    }
    // GET: special gallery 'api/galleries/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGalleryById(string id, [FromQuery] string? accessCode) 
    {
        var gallery = await context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id); // finds first instance and returns it, or null

        if (gallery == null)
        {
            return NotFound();
        }

        if (!gallery.IsPrivate) return Ok(gallery);
        
        if (string.IsNullOrWhiteSpace(accessCode) || accessCode != gallery.AccessCode)
        {
            return Unauthorized("Access code is required or incorrect for this private gallery.");
        }

        return Ok(gallery);
    }
    
    //GET: photos in gallery '/api/galleries/{id}/photos
    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosByGalleryId(string id)
    {
        var gallery = await context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gallery == null)
        {
            return NotFound();
        }
        
        return Ok(gallery.Photos);
    }
    
    // POST: for admin use to post gallery '/api/galleries'
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Gallery>> CreateGallery(Gallery gallery)
    {
        context.Galleries.Add(gallery);
        await context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetGalleryById), new { id = gallery.Id }, gallery);
    }
    
    //DELETE: /api/galleries/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGallery(string id)
    {
        var gallery = await context.Galleries.FindAsync(id);

        if (gallery == null)
        {
            return NotFound();
        }
        
        context.Galleries.Remove(gallery);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpGet("client")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<Gallery>> GetClientGallery()
    {
        var email = User.Identity?.Name;
        var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
        
        Console.WriteLine("Authenticated user:", email);
        Console.WriteLine("User roles:", string.Join(", ", roles));

        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized("No authenticated user");

        var gallery = await context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g =>
                g.IsPrivate &&
                g.ClientEmail == email);

        if (gallery == null)
            return NotFound("No gallery found for this client");

        return Ok(gallery);
    }

    
}