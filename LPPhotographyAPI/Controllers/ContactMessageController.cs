using System.Net;
using System.Net.Mail;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace LPPhotographyAPI.Controllers;

// Handles the contact form functionality by accepting messages from users
// and sending them via SMTP to a configured email address.
public class ContactMessageController(LpPhotoDbContext context, IConfiguration config) : BaseApiController
{
    // Receives contact form submission and sends it via email using SMTP.
    [HttpPost]
    public async Task<IActionResult> SendContactMessage([FromBody] ContactMessage contactMessage)
    {
        // Initialize SMTP client with settings from appsettings.json or environment
        var smtpClient = new SmtpClient(config["Smtp:Host"])
        {
            Port = int.Parse(config["Smtp:Port"]),
            Credentials = new NetworkCredential(
                config["Smtp:Username"], 
                config["Smtp:Password"]
            ),
            EnableSsl = true
        };

        // Construct the email message
        var mailMessage = new MailMessage
        {
            From = new MailAddress(config["Smtp:From"]),
            Subject = $"New Message - {contactMessage.ServiceType}",
            Body = 
                $"From: {contactMessage.Name} ({contactMessage.Email})\n\n" +
                $"Service: {contactMessage.ServiceType}\n\n" +
                $"Message:\n{contactMessage.Message}",
            IsBodyHtml = false
        };

        // Add user's email as reply-to so admin can reply directly
        mailMessage.ReplyToList.Add(new MailAddress(contactMessage.Email));

        // Destination address (usually the site owner's email)
        mailMessage.To.Add(config["Smtp:To"]);

        try
        {
            // Send the email
            await smtpClient.SendMailAsync(mailMessage);
            return Ok("Message has been sent");
        }
        catch (Exception ex)
        {
            // Return error if sending fails
            return StatusCode(500, $"Error sending message: {ex.Message}");
        }
    }
}
