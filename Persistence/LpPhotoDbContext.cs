using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class LpPhotoDbContext : IdentityDbContext<SiteUser>
{
    public LpPhotoDbContext(DbContextOptions<LpPhotoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Gallery> Galleries { get; set; } = null!;
    public DbSet<Photo> Photos { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // API relationships
        // one photo -> gallery
        // one gallery -> many photos
        builder.Entity<Photo>()
            .HasOne(p => p.Gallery)
            .WithMany(g => g.Photos)
            .HasForeignKey(p => p.GalleryId)
            .OnDelete(DeleteBehavior.Cascade); // if gallery deleted, photos get deleted as well
    }
}