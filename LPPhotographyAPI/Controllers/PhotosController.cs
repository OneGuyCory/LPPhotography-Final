using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class PhotosController(LpPhotoDbContext context) : BaseApiController
{
    [HttpGet("/gallery/{galleryId}")]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotosByGalleryId(string galleryId)
    {
        var photos = await context.Photos
            .Where(p => p.GalleryId == galleryId)
            .ToListAsync();
        
        var galleryExists = await context.Photos.AnyAsync(g => g.GalleryId == galleryId);

        if (!galleryExists)
        {
            return NotFound();
        }
        return Ok(photos);
    }

    [HttpPost]
    public async Task<ActionResult<Photo>> PostPhoto(Photo newPhoto)
    {
        var galleryExists = await context.Photos.AnyAsync(g => g.GalleryId == newPhoto.GalleryId);
        if (!galleryExists)
        {
            return BadRequest();
        }
        
        context.Photos.Add(newPhoto);
        await context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetPhotoById), new {id = newPhoto.Id}, newPhoto);
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
    public async Task<IActionResult> DeletePhoto(string id)
    {
        var photo = await context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }
        
        context.Photos.Remove(photo);
        await context.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhoto(string id, Photo updatedPhoto)
    {
        if (id != updatedPhoto.Id)
        {
            return BadRequest();
        }
        
        var photo = await context.Photos.FindAsync(id);

        if (photo == null)
        {
            return NotFound();
        }
        
        photo.Url = updatedPhoto.Url;
        photo.Caption = updatedPhoto.Caption;
        photo.GalleryId = updatedPhoto.GalleryId;
        
        await context.SaveChangesAsync();
        return NoContent();
    }
    
}