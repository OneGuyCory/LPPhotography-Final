namespace LPPhotographyAPI.DTOs;

// DTO used when uploading a new photo to associate it with a specific gallery.
public class PhotoDto
{
    // The Cloudinary (or other external storage) URL where the photo is hosted.
    public string Url { get; set; } = string.Empty;
    
    // Optional caption or description for the photo.
    public string? Caption { get; set; }
    
    // The ID of the gallery this photo belongs to.
    public Guid GalleryId { get; set; }
}