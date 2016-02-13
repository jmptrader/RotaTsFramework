using System.Web.Http;
using System.Web.Routing;
using Microsoft.Owin;
using Owin;
using RotaTsFrameworkDemo;

[assembly: OwinStartup(typeof(Startup))]

namespace RotaTsFrameworkDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            //Register server routes
            RegisterRoutes(RouteTable.Routes);           
            //Configure WebApi
            ConfigureWebApi(config);
              //Enable SignalR
            //app.MapSignalR();
             //Use webapi
            app.UseWebApi(config);
        }
    }
}
