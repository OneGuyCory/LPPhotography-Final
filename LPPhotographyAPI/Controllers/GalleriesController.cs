using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

/// <summary>
/// Handles gallery creation, retrieval, and management.
/// Supports public and private galleries, including client-specific logic.
/// </summary>
public class GalleriesController : BaseApiController
{
    private readonly LpPhotoDbContext _context;
    private readonly UserManager<SiteUser> _userManager;

    public GalleriesController(LpPhotoDbContext context, UserManager<SiteUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// Gets all **public** galleries (non-private).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<Gallery>>> GetGalleries()
    {
        return await _context.Galleries
            .Where(g => !g.IsPrivate)
            .Include(g => g.Photos)
            .ToListAsync();
    }

    /// <summary>
    /// Gets **all galleries**, including private ones. Admin only.
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<Gallery>>> GetAllGalleries()
    {
        return await _context.Galleries
            .Include(g => g.Photos)
            .ToListAsync();
    }

    /// <summary>
    /// Gets a gallery by ID. If private, requires correct access code.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGalleryById([FromRoute] Guid id, [FromQuery] string? accessCode)
    {
        var gallery = await _context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gallery == null)
            return NotFound();

        // Public gallery
        if (!gallery.IsPrivate)
            return Ok(gallery);

        // Private gallery must match access code
        if (string.IsNullOrWhiteSpace(accessCode) || accessCode != gallery.AccessCode)
            return Unauthorized("Access code is required or incorrect for this private gallery.");

        return Ok(gallery);
    }

    /// <summary>
    /// Gets only the photos associated with a specific gallery.
    /// </summary>
    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosByGalleryId([FromRoute] Guid id)
    {
        var gallery = await _context.Galleries
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gallery == null)
            return NotFound();

        return Ok(gallery.Photos);
    }

    /// <summary>
    /// Creates a new gallery. If private, auto-creates or updates associated client user.
    /// Admin only.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Gallery>> CreateGallery(Gallery gallery)
    {
        _context.Galleries.Add(gallery);

        // If this is a private gallery tied to a client, create or update the user
        if (gallery.IsPrivate && !string.IsNullOrWhiteSpace(gallery.ClientEmail))
        {
            var existingUser = await _userManager.FindByEmailAsync(gallery.ClientEmail);

            if (existingUser == null)
            {
                // Create a new client user
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
                // Update access code for existing user
                existingUser.AccessCode = gallery.AccessCode;
                await _userManager.UpdateAsync(existingUser);
            }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGalleryById), new { id = gallery.Id }, gallery);
    }

    /// <summary>
    /// Deletes a gallery by ID. Admin only.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGallery(Guid id)
    {
        var gallery = await _context.Galleries.FindAsync(id);
        if (gallery == null)
            return NotFound();

        _context.Galleries.Remove(gallery);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Gets the private gallery for the currently logged-in client.
    /// Client role required.
    /// </summary>
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

    /// <summary>
    /// Sets the cover image URL for a gallery.
    /// </summary>
    [HttpPut("{id}/cover")]
    public async Task<IActionResult> SetCoverImage(Guid id, [FromBody] string photoUrl)
    {
        //sets gallery to specific gallery found by id, returns not found if null
        var gallery = await _context.Galleries.FindAsync(id);
        if (gallery == null) return NotFound();

        //sets the cover image to the photo selected
        gallery.CoverImageUrl = photoUrl;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
