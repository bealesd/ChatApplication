﻿using System;

namespace ChatApplication.Models
{
    public class Message
    {
        public string Who { get; set; }
        public string Content { get; set; }
        public DateTime Datetime { get; set; }
    }
}
