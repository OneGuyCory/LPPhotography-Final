using Domain;
using LPPhotographyAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class PhotosController(LpPhotoDbContext context) : BaseApiController
{
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
    
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetFeaturedPhotos()
    {
        var featured = await context.Photos
            .Where(p => p.IsFeatured)
            .ToListAsync();

        return Ok(featured);
    }


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

        return CreatedAtAction(nameof(GetPhotoById), new { id = photo.Id }, photo);
    }


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

        photo.Url = dto.Url;
        photo.Caption = dto.Caption;
        photo.GalleryId = dto.GalleryId;
        photo.IsFeatured = dto.IsFeatured; // ✅ update featured flag

        await context.SaveChangesAsync();

        return NoContent();
    }


    
}