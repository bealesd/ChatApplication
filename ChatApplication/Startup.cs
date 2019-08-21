using ChatApplication.Repo;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApplication
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IHostingEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            var chatStoreKey = "";
            var chatStoreTableName = "";
            if (HostingEnvironment.IsDevelopment())
            {
                chatStoreTableName = Configuration.GetSection("TableConfigTest")["TableName"];
                chatStoreKey = Configuration.GetSection("TableConfigTest")["Key"];
            }
            else
            {
                chatStoreTableName = Configuration.GetSection("TableConfigLive")["TableName"];
                chatStoreKey = Configuration.GetSection("TableConfigLive")["Key"];
            }
            chatStoreTableName = "chatstore"
            chatStoreKey = "5iTVqd0HD5GiwSeG4sEL45G9v2p8CcsYl1nVIzrG+WIf0q4xD21GHnwIJ0hxyqe3/45gkwfqkbWOqtcC8sxSiA=="
            services.AddSingleton<IMessageStoreAzure>(new MessageStoreAzure(chatStoreKey, chatStoreTableName));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {


            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Chat}/{action=LoadChatView}");
            });
        }
    }
}
