using Domain;
using LPPhotographyAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

/// <summary>
/// Handles photo-related API operations including upload, retrieval,
/// update, deletion, and featured photo queries. Restricted admin access for modification.
/// </summary>
public class PhotosController(LpPhotoDbContext context) : BaseApiController
{
    /// <summary>
    /// Gets all photos for a specific gallery by its ID.
    /// </summary>
    [HttpGet("/gallery/{galleryId}")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosByGalleryId([FromRoute] Guid galleryId)
    {
        var photos = await context.Photos
            .Where(p => p.GalleryId == galleryId)
            .ToListAsync();

        var galleryExists = await context.Galleries.AnyAsync(g => g.Id == galleryId);

        if (!galleryExists)
        {
            return NotFound();
        }

        return Ok(photos);
    }

    /// <summary>
    /// Gets all photos marked as featured (for homepage or promotions).
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetFeaturedPhotos()
    {
        var featured = await context.Photos
            .Where(p => p.IsFeatured)
            .ToListAsync();

        return Ok(featured);
    }

    /// <summary>
    /// Adds a new photo to a gallery.
    /// Requires Admin role.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Photo>> PostPhoto([FromBody] PhotoDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var gallery = await context.Galleries.FindAsync(dto.GalleryId);
        if (gallery == null)
            return BadRequest("Invalid gallery ID.");

        var photo = new Photo
        {
            Url = dto.Url,
            Caption = dto.Caption,
            GalleryId = dto.GalleryId
        };

        context.Photos.Add(photo);
        await context.SaveChangesAsync();

        // Return created photo with 201 status and location header
        return CreatedAtAction(nameof(GetPhotoById), new { id = photo.Id }, photo);
    }

    /// <summary>
    /// Gets a single photo by its unique ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Photo>> GetPhotoById(string id)
    {
        var photo = await context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }

        return Ok(photo);
    }

    /// <summary>
    /// Deletes a photo by its ID.
    /// Requires Admin role.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePhoto(Guid id)
    {
        var photo = await context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }

        context.Photos.Remove(photo);
        await context.SaveChangesAsync();

        return Ok("Photo deleted successfully");
    }

    /// <summary>
    /// Updates a photo's metadata (caption, featured, URL, etc.).
    /// Requires Admin role.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePhoto(Guid id, [FromBody] PhotoUpdateDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest("Photo ID mismatch.");
        }

        var photo = await context.Photos.FindAsync(id);
        if (photo == null)
        {
            return NotFound();
        }

        // Apply updates
        photo.Url = dto.Url;
        photo.Caption = dto.Caption;
        photo.GalleryId = dto.GalleryId;
        photo.IsFeatured = dto.IsFeatured;

        await context.SaveChangesAsync();

        return NoContent();
    }
}
