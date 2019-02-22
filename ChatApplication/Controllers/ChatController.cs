using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using ChatApplication.Repo;
using System.Linq;
using ChatApplication.Models;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        public async Task<IActionResult> LoadChatView()
        {
            @ViewData["Title"] = "Chat";
            return View("ChatView", MessageStore.GetMessages());
        }

        public async Task<IActionResult> GetLastChat()
        {
            JsonResult result = Json(new Message());
            if (MessageStore.GetMessages() != null && MessageStore.GetMessages().Count > 0)
            {
                result = Json(MessageStore.GetMessages().Last());
            }
            return result;
        }

        public async Task<IActionResult> SendChatMessage(string chatMessage, string who)
        {
            MessageStore.AddMessage(chatMessage, DateTime.Now, Guid.NewGuid());
            return RedirectToAction("LoadChatView");
        }

        public async Task<IActionResult> SetUsername(string username)
        {
            MessageStore.Username = username;
            return RedirectToAction("LoadChatView");
        }
    }


}