﻿using ChatApplication.Models;
using System.Collections.Generic;
using System;

namespace ChatApplication.Repo
{
    public static class MessageStore
    {
        private static List<Message> Messages = new List<Message>();
        public static string Username { get; internal set; } = "David";

        public static void AddMessage(string message, DateTime dateTime) {
            Messages.Add(new Message()
            {
                Content = message,
                Who = Username,
                Datetime = dateTime
            });
        }

        public static List<Message> GetMessages()
        {
            return Messages;
        }
    }
}
