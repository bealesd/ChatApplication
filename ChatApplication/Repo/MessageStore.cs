﻿using ChatApplication.Models;
using System.Collections.Generic;

namespace ChatApplication.Repo
{
    public static class MessageStore
    {
        private static List<Message> Messages = new List<Message>();
        public static string Username { get; internal set; }

        public static void AddMessage(string message) {
            Messages.Add(new Message()
            {
                Content = message,
                Who = Username
            });
        }

        public static List<Message> GetMessages()
        {
            return Messages;
        }
    }
}
