namespace Domain;

public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string Url { get; set; }
    
    public string? Caption { get; set; }
    
    public string? GalleryId { get; set; }
    
    public Gallery Gallery { get; set; }
}