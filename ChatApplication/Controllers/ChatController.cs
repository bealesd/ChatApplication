using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        public IActionResult LoadChatView(string who)
        {
            if (string.IsNullOrEmpty(who)) who = "David";
            @ViewData["Title"] = "Chat";
            @ViewData["Who"] = who;
            return View("ChatView");
        }
    }
}