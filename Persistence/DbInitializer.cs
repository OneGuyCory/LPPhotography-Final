using Domain; // Contains your SiteUser class
using Microsoft.AspNetCore.Identity; // Identity role/user manager interfaces
using Microsoft.Extensions.Logging; // Logging support

namespace Persistence;

public static class DbInitializer
{
    // This method seeds roles and the initial admin user
    public static async Task SeedRolesAndUsers(
        UserManager<SiteUser> userManager, // Handles user creation
        RoleManager<IdentityRole> roleManager, // Handles role creation
        ILoggerFactory loggerFactory, // Used for logging events
        LpPhotoDbContext context) // Your app's DbContext
    {
        var logger = loggerFactory.CreateLogger("DbInitializer");

        // Retrieve admin credentials from environment variables
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

        // If environment variables are missing, log warning and exit
        if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
        {
            logger.LogWarning("Admin email or password not set in environment variables.");
            return;
        }

        // Define the required roles
        string[] roles = { "Admin", "Client" };

        // Create each role if it doesn’t already exist
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Check if an admin with the given email already exists
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            // Create the admin user
            var adminUser = new SiteUser { UserName = adminEmail, Email = adminEmail };
            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                // Add admin role
                await userManager.AddToRoleAsync(adminUser, "Admin");
                logger.LogInformation("Admin user seeded successfully.");
            }
            else
            {
                // Log error if creation failed
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                logger.LogError("Failed to seed admin user: {Errors}", errors);
            }
        }
    }
}
