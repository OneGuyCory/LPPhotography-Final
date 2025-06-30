namespace Domain;

public class Photo
{
    public Guid Id { get; set; }
    
    public required string Url { get; set; } // URL from cloudinary
    
    public string? Caption { get; set; }
    
    public required Guid GalleryId { get; set; }

    public Gallery Gallery { get; set; } = null!;
    
    public bool IsFeatured { get; set; } = false;
}