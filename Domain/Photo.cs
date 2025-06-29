namespace Domain;

public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public required string Url { get; set; } // URL from cloudinary
    
    public string? Caption { get; set; }
    
    public required string GalleryId { get; set; }

    public Gallery Gallery { get; set; } = null!;
}