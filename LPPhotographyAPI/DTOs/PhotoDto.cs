namespace LPPhotographyAPI.DTOs;

/// <summary>
/// DTO used when uploading a new photo to associate it with a specific gallery.
/// This is sent from the client-side when an admin uploads a photo.
/// </summary>
public class PhotoDto
{
    /// <summary>
    /// The Cloudinary (or other external storage) URL where the photo is hosted.
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// Optional caption or description for the photo.
    /// </summary>
    public string? Caption { get; set; }

    /// <summary>
    /// The ID of the gallery this photo belongs to.
    /// </summary>
    public Guid GalleryId { get; set; }
}