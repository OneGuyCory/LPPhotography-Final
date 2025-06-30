using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Persistence;

public static class DbInitializer
{
    
    public static async Task SeedRolesAndUsers(
        UserManager<SiteUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILoggerFactory loggerFactory,
        LpPhotoDbContext context)
    {
        var logger = loggerFactory.CreateLogger("DbInitializer");

        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

        if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
        {
            logger.LogWarning("Admin email or password not set in environment variables.");
            return; 
        }

        // Create roles if they don't exist
        string[] roles = { "Admin", "Client" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Create the initial Admin user if they don't exist
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new SiteUser { UserName = adminEmail, Email = adminEmail };
            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                logger.LogInformation("Admin user seeded successfully.");
            }
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                logger.LogError("Failed to seed admin user: " + errors);
            }
        }
    }
}