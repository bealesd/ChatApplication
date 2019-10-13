using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _chatUrlPrefix;

        public ChatController(IConfiguration config)
        {
            _config = config;
            _chatUrlPrefix = config.GetValue<bool>("production") ? config.GetValue<string>("live:url") : config.GetValue<string>("dev:url");
        }

        public IActionResult LoadChatView(string who)
        {
            @ViewData["ChatUrlPrefix"] = _chatUrlPrefix;
            if (string.IsNullOrEmpty(who)) who = "David";
            @ViewData["Title"] = "Chat";
            @ViewData["Who"] = who;
            return View("ChatView");
        }
    }
}