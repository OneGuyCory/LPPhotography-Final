namespace Domain;

public class Gallery
{
    public Guid Id { get; set; }
    
    public string? Title { get; set; } //title for client specific gallery
    
    public required string Category { get; set; } // what kind of gallery
    
    public bool IsPrivate { get; set; } = false; //set to false so only need to make changes when doing client gallery
    
    public string? AccessCode { get; set; } // does it have an access code for client gallery
    public string? ClientEmail { get; set; }
    public string? CoverImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // sets date on creation

    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
}