namespace Domain;

// The Photo entity represents an individual image stored in the system.
// Each photo belongs to a gallery and may include optional metadata like a caption.
// Images are stored externally (e.g. Cloudinary), and this model keeps track of their URLs and related data.

public class Photo
{
    // Unique identifier for the photo.
    // EF Core recognizes 'Id' as the primary key by convention.
    public Guid Id { get; set; }

    // The URL pointing to the image hosted on Cloudinary.
    // This is required and used to display the photo on the website.
    public required string Url { get; set; }

    // Optional description or label for the image, such as a client name or photo location.
    public string? Caption { get; set; }

    // Foreign key linking the photo to its parent Gallery.
    // Required: every photo must belong to one gallery.
    public required Guid GalleryId { get; set; }

    // Navigation property to the parent Gallery.
    // Allows EF Core to load the gallery object when needed.
    public Gallery Gallery { get; set; } = null!;

    // Flag to indicate if the photo should be marked as "featured" (e.g. for homepage display).
    // Defaults to false.
    public bool IsFeatured { get; set; } = false;
}