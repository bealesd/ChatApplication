using ChatApplication.Models;
using ChatApplication.Repo;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        public async Task<IActionResult> LoadChatView()
        {
            @ViewData["Title"] = "Chat";
            return View("ChatView", MessageStore.GetMessages());
        }

        private async Task<Guid> GetLastDatabaseChatId()
        {
            Guid result = Guid.Empty;
            if (MessageStore.GetMessages() != null && MessageStore.GetMessages().Count > 0)
            {
                result = MessageStore.GetMessages().Last().Id;
            }
            return result;
        }

        public async Task<IActionResult> GetLastTenChats()
        {
            var mesages = MessageStore.GetMessages().Skip(Math.Max(0, MessageStore.GetMessages().Count() - 10));
            return Json(mesages);
        }

        public async Task<IActionResult> GetChatsAfterId(Guid lastClientId)
        {
            List<Message> newChats = await GetNewChats(lastClientId);
            return Json(newChats);
        }

        private async Task<List<Message>> GetNewChats(Guid lastClientId)
        {
            List<Message> allMessages = MessageStore.GetMessages();
            Message clientMessage = allMessages.FirstOrDefault(m => m.Id == lastClientId);
            var newMessages = new List<Message>();
            if (clientMessage != null)
            {
                var newMessageIndex = allMessages.IndexOf(allMessages.FirstOrDefault(m => m.Id == lastClientId)) + 1;
                newMessages = allMessages.GetRange(newMessageIndex, allMessages.Count - newMessageIndex);
            }
            else
            {
                newMessages = allMessages;
            }

            return newMessages;
        }

        public async Task<IActionResult> SendChatMessage(string chatMessage, string who)
        {
            var id = Guid.NewGuid();
            MessageStore.AddMessage(chatMessage, DateTime.Now.Ticks, id);
            return RedirectToAction("LoadChatView");
            //var a = Json(id);
            //return a;
        }

        public async Task<IActionResult> SetUsername(string username)
        {
            MessageStore.Username = username;
            return RedirectToAction("LoadChatView");
        }
    }


}