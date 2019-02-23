using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace ChatApplication.Models
{
    public class Message : TableEntity
    {
        public string Who { get; set; }
        public string Content { get; set; }
        public long Datetime { get; set; }
        public Guid Id { get; set; }
    }
}
