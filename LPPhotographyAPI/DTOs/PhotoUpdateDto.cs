namespace LPPhotographyAPI.DTOs;

/// <summary>
/// DTO used for updating photo metadata. 
/// Sent by admin users when editing a photo's details such as caption, URL, or gallery assignment.
/// </summary>
public class PhotoUpdateDto
{
    /// <summary>
    /// Unique identifier of the photo to update.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The updated Cloudinary (or other external service) URL of the photo.
    /// </summary>
    public string Url { get; set; } = "";

    /// <summary>
    /// The updated caption or description for the photo.
    /// </summary>
    public string Caption { get; set; } = "";

    /// <summary>
    /// The ID of the gallery to which this photo is (re)assigned.
    /// </summary>
    public Guid GalleryId { get; set; }

    /// <summary>
    /// Flag to indicate whether the photo should be marked as featured.
    /// Featured photos can be shown on the homepage or special gallery sections.
    /// </summary>
    public bool IsFeatured { get; set; } = false;
}