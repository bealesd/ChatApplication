using ChatApplication.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApplication.Repo
{
    public interface IMessageStoreAzure
    {
        Task AddMessage(string message, long dateTime, Guid id, string who);
        Task<IEnumerable<Message>> GetMessages();
    }

    public class MessageStoreAzure : IMessageStoreAzure
    {
        private CloudStorageAccount _storageAccount;
        private CloudTable _table;

        public MessageStoreAzure(string tableKey)
        {
            _storageAccount = CloudStorageAccount.Parse(@tableKey);
            CloudTableClient tableClient = _storageAccount.CreateCloudTableClient();
            _table = tableClient.GetTableReference("chatStore");
            var createTable = Task.Run(() => _table.CreateIfNotExistsAsync());
            createTable.Wait();
        }

        public async Task<IEnumerable<Message>> GetMessages()
        {
            try
            {
                IEnumerable<Message> chatMessages = await GetChatMessages();
                var orderedChatMessages = chatMessages.OrderBy(m => m.Datetime).ToList();
                return orderedChatMessages;
            }
            catch (Exception e)
            {
                throw new Exception("Could not get chat messages", e);
            }
        }

        private async Task<IEnumerable<Message>> GetChatMessages()
        {
            TableQuery<Message> query = new TableQuery<Message>();
            TableQuerySegment<Message> queryResult = await _table.ExecuteQuerySegmentedAsync(query, null);
            return queryResult.Results;
        }

        public async Task AddMessage(string message, long dateTime, Guid id, string who)
        {
            try
            {
                var chatMessage = new Message()
                {
                    Content = message,
                    Who = who,
                    Datetime = dateTime,
                    Id = id
                };

                chatMessage.PartitionKey = chatMessage.Id.ToString();
                chatMessage.RowKey = chatMessage.Id.ToString();
                var insertOperation = TableOperation.InsertOrReplace(chatMessage);
                await _table.ExecuteAsync(insertOperation);
            }
            catch (Exception e)
            {
                throw new Exception("Chat message not added", e);
            }
        }
    }
}
