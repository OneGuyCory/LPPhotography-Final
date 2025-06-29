namespace LPPhotographyAPI.DTOs;

public class PhotoDto
{
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public string GalleryId { get; set; } = string.Empty;
}
