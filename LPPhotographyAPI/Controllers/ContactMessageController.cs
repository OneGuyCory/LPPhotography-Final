

using System.Net;
using System.Net.Mail;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;


namespace LPPhotographyAPI.Controllers;

public class ContactMessageController(LpPhotoDbContext context, IConfiguration config) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> SendContactMessage([FromBody] ContactMessage contactMessage)
    {
        var smtpClient = new SmtpClient(config["Smtp:Host"])
        {
            Port = int.Parse(config["Smtp:Port"]),
            Credentials = new NetworkCredential(config["Smtp:Username"], config["Smtp:Password"]),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(config["Smtp:From"]),
            Subject = $"New Message - {contactMessage.ServiceType}",
            Body =
                $"From: {contactMessage.Name} ({contactMessage.Email})\n\nService: {contactMessage.ServiceType}\n\nMessage:\n{contactMessage.Message}",
            IsBodyHtml = false

        };
        mailMessage.ReplyToList.Add(new MailAddress(contactMessage.Email));
        mailMessage.To.Add(config["Smtp:To"]);

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
            return Ok("Message has been sent");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error sending message: {ex.Message}");
        }
    }
}