namespace Domain;

// The Gallery entity represents a collection of photos.
// Galleries can be public (general category) or private (client-specific).
// Used for organizing and displaying sets of images on the photography site.

public class Gallery
{
    // Primary key for the gallery.
    public Guid Id { get; set; }

    // Optional title for the gallery.
    // Often used for client-specific galleries (e.g., "John & Jane's Wedding").
    public string? Title { get; set; }

    // Required category for the gallery.
    // Examples: "Weddings", "Portraits", "Events", etc.
    public required string Category { get; set; }

    // Indicates whether the gallery is private (only visible via client login).
    // Defaults to false for public galleries.
    public bool IsPrivate { get; set; } = false;

    // Optional access code to view the gallery if it's private.
    // Used during client login for restricted access.
    public string? AccessCode { get; set; }

    // Optional: Email of the client this gallery belongs to.
    // Helps the admin associate galleries with specific clients.
    public string? ClientEmail { get; set; }

    // Optional: URL of the photo chosen as the cover image for this gallery.
    // Displayed as a thumbnail or banner on gallery lists.
    public string? CoverImageUrl { get; set; }

    // Timestamp of when the gallery was created.
    // Automatically set to UTC now during gallery creation.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for all photos that belong to this gallery.
    // Enables Entity Framework to load associated Photo records.
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
}