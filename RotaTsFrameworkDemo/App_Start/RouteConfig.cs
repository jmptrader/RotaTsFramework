using System.Web.Mvc;
using System.Web.Routing;

namespace RotaTsFrameworkDemo
{
    public partial class Startup
    {
        public void RegisterRoutes(RouteCollection routes)
        {
            AreaRegistration.RegisterAllAreas();

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                namespaces: new[] { "RotaTsFrameworkDemo.Controllers" },
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
                );
        }
    }
}