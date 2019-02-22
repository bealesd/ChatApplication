using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChatApplication.Repo;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        public async Task<IActionResult> LoadChatView()
        {
            @ViewData["Title"] = "Chat";
            return View("ChatView");
        }

        public async Task<IActionResult> SendChatMessage(string chatMessage, string who)
        {
            MessageStore.AddMessage(chatMessage);
            return RedirectToAction("LoadChatView");
        }

        public async Task<IActionResult> SetUsername(string username)
        {
            MessageStore.Username = username;
            return RedirectToAction("LoadChatView");
        }
    }


}