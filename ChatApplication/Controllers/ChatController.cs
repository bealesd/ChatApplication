using ChatApplication.Models;
using ChatApplication.Repo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft;

namespace ChatApplication.Controllers
{
    public class ChatController : Controller
    {
        public IMessageStoreAzure MessageStoreAzure { get; }

        public ChatController(IMessageStoreAzure messageStoreAzure)
        {
            MessageStoreAzure = messageStoreAzure;
        }
        public async Task<IActionResult> LoadChatView(string who)
        {
            if (string.IsNullOrEmpty(who))
            {
                who = "David";
            }
            @ViewData["Title"] = "Chat";
            var messages = await MessageStoreAzure.GetMessages();
            @ViewData["Who"] = who;
            return View("ChatView", messages);
        }

        public async Task<IActionResult> GetLastTenChats()
        {
            var messages = await MessageStoreAzure.GetMessages();
            IEnumerable<Message> lastTenMessages = messages.Skip(Math.Max(0, messages.Count() - 10));
            return Json(lastTenMessages);
        }

        public async Task<IActionResult> GetChatsAfterId(Guid lastClientId)
        {
            List<Message> newChats = await GetNewChats(lastClientId);
            return Json(newChats);
        }

        private async Task<List<Message>> GetNewChats(Guid lastClientId)
        {
            var allMessages = (await MessageStoreAzure.GetMessages()).ToList();
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

        public async Task<IActionResult> GetTenChatsBeforeId(Guid firstClientId)
        {
            var allMessages = (await MessageStoreAzure.GetMessages()).ToList();
            Message clientMessage = allMessages.FirstOrDefault(m => m.Id == firstClientId);
            var oldMessages = new List<Message>();
            if (clientMessage != null)
            {
                var oldMessageIndex = allMessages.IndexOf(allMessages.FirstOrDefault(m => m.Id == firstClientId));
                var startIndex = oldMessageIndex > 10 ? oldMessageIndex - 10 : 0;
                oldMessages = allMessages.GetRange(startIndex, 10);
            }
            return Json(oldMessages);
        }

        public async Task<IActionResult> SendChatMessage(string chatMessage, string who)
        {
            var id = Guid.NewGuid();
            await MessageStoreAzure.AddMessage(chatMessage, DateTime.Now.Ticks, id, who);
            return RedirectToAction("LoadChatView", new { who = who });
        }

        [HttpPost]
        public async Task<ActionResult> PostMessage()
        {
            var id = Guid.NewGuid();
            var bodyStr = "";
            using (StreamReader reader = new StreamReader(HttpContext.Request.Body, Encoding.UTF8, true, 1024, true))
            {
                bodyStr = reader.ReadToEnd();
            }
            var json = Newtonsoft.Json.JsonConvert.DeserializeObject<MessageJson>(bodyStr);


            var time = DateTime.Now.Ticks;
            await MessageStoreAzure.AddMessage(json.Message, time, id, json.Username);

            var allMessages = (await MessageStoreAzure.GetMessages()).ToList();
            Message clientMessage = allMessages.FirstOrDefault(m => m.Datetime == time);
            return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(clientMessage));
        }

        private async Task<Guid> GetLastDatabaseChatId()
        {
            Guid result = Guid.Empty;
            var messages = await MessageStoreAzure.GetMessages();
            if (messages != null && messages.Count() > 0)
            {
                result = MessageStore.GetMessages().Last().Id;
            }
            return result;
        }
    }
    internal class MessageJson
    {
        public string Message { get; set; }
        public string Username { get; set; }
    }
}