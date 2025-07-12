namespace LPPhotographyAPI.DTOs;

// DTO used for updating photo metadata
public class PhotoUpdateDto
{
    // Unique identifier of the photo to update
    public Guid Id { get; set; }
    
    // The updated Cloudinary (or other external service) URL of the photo
    public string Url { get; set; } = "";
    
    // The updated caption or description for the photo
    public string Caption { get; set; } = "";
    
    // The ID of the gallery to which this photo is (re)assigned
    public Guid GalleryId { get; set; }
    
    // Flag to indicate whether the photo should be marked as featured
    // Featured photos can be shown on the homepage
    public bool IsFeatured { get; set; } = false;
}