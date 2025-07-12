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
    // You do not need to declare DbSet<SiteUser> unless you're doing custom queries on users.
    // The IdentityDbContext already gives you access via base.Users

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // API relationships
        builder.Entity<Photo>()
            .HasOne(p => p.Gallery)
            .WithMany(g => g.Photos)
            .HasForeignKey(p => p.GalleryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}