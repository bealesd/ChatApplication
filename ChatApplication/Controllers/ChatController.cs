﻿using ChatApplication.Models;
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
        public IMessageStoreAzure MessageStoreAzure { get; }

        public ChatController(IMessageStoreAzure messageStoreAzure)
        {
            MessageStoreAzure = messageStoreAzure;
        }
        public async Task<IActionResult> LoadChatView()
        {
            @ViewData["Title"] = "Chat";

            var messages = await MessageStoreAzure.GetMessages();
            return View("ChatView", messages);
            //return View("ChatView", MessageStore.GetMessages());
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

            //if (MessageStore.GetMessages() != null && MessageStore.GetMessages().Count > 0)
            //{
            //    result = MessageStore.GetMessages().Last().Id;
            //}
            //return result;
        }

        public async Task<IActionResult> GetLastTenChats()
        {
            var messages = await MessageStoreAzure.GetMessages();
            IEnumerable<Message> mesages = messages.Skip(Math.Max(0, messages.Count() - 10));
            //IEnumerable<Message> mesages = MessageStore.GetMessages().Skip(Math.Max(0, MessageStore.GetMessages().Count() - 10));
            return Json(mesages);
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


        public async Task<IActionResult> GetChatsBeforeId(Guid firstClientId)
        {
            List<Message> allMessages = (await MessageStoreAzure.GetMessages()).ToList();
            Message clientMessage = allMessages.FirstOrDefault(m => m.Id == firstClientId);
            var oldMessages = new List<Message>();
            if (clientMessage != null)
            {
                var oldMessageIndex = allMessages.IndexOf(allMessages.FirstOrDefault(m => m.Id == firstClientId));
                oldMessages = allMessages.GetRange(0, oldMessageIndex);
            }
            return Json(oldMessages);
        }

        public async Task<IActionResult> SendChatMessage(string chatMessage, string who)
        {
            var id = Guid.NewGuid();
            //MessageStore.AddMessage(chatMessage, DateTime.Now.Ticks, id);
            await MessageStoreAzure.AddMessage(chatMessage, DateTime.Now.Ticks, id, who);
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