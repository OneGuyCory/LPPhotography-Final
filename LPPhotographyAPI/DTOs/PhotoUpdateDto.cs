namespace LPPhotographyAPI.DTOs;

public class PhotoUpdateDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = "";
    public string Caption { get; set; } = "";
    public Guid GalleryId { get; set; }
    public bool IsFeatured { get; set; } = false;

}
