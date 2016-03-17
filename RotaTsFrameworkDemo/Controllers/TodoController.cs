using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http;

namespace RotaTsFrameworkDemo.Controllers
{
    public class TodoController : ApiController
    {
        private static readonly IDictionary<int, TodoItem> Items = new Dictionary<int, TodoItem>
        {
            {1,new TodoItem(1,"Bakkaldan 1 ekmek yarım kilo yoğurt",false)},
            {2,new TodoItem(2,"Rota frameworkde int lar byte olmalı",false)},
            {3,new TodoItem(3,"Bu SPA projesi bir harika dostum",true)},
            {4,new TodoItem(4,"Pluralsight üyeliği yenilenmeli",false)},
            {5,new TodoItem(5,"Angular + RequireJS ile uygulama geliştirmem lazim",true)},
            {6,new TodoItem(6,"Bu todo uygulamasını iyice incelemeliyim",false)},
            {7,new TodoItem(7,"Bootstrap alaternatif apiler araştirmaliyim",true)},
            {8,new TodoItem(8,"TypeScript\' kodlarken ozellikle olusan js kodu kontrol etmeliyim",false)},
            {9,new TodoItem(9,"ASP.NET5 MVC6 demolari incelenmeli",false)},
            {10,new TodoItem(10,"Visual Studio Code ile TypeScript code geliştirmeliyim",true)}
        };

        // GET api/<controller>
        [HttpPost]
        public IEnumerable<TodoItem> GetAll(TodoItemFilter filter)
        {
            return (from row in Items.Values
                    where (!filter.Done.HasValue || row.Done == filter.Done) &&
                          (filter.Text == null || row.Text.StartsWith(filter.Text))
                    select row).ToList();
        }

        // GET api/<controller>/5
        [HttpGet]
        public TodoItem GetById(int id)
        {
            return Items[id];
        }

        // POST api/<controller>
        [HttpPost]
        public object Save(TodoItem value)
        {
            if (value.Id > 0)
                Items[value.Id] = value;
            else
            {
                value.Id = (Items.Count > 0 ? Items.Keys.Max() : 0) + 1;
                Items.Add(value.Id, value);
            }
            return new { Model = value };
        }

        // DELETE api/<controller>/5
        [HttpPost]
        public void DeleteById(int id)
        {
            if (Items.ContainsKey(id))
                Items.Remove(id);
        }
    }

    public class TodoItemFilter
    {
        public string Text { get; set; }
        public bool? Done { get; set; }
    }

    public class TodoItem
    {
        public TodoItem(int id, string text, bool done)
        {
            Id = id;
            Text = text;
            Done = done;
            ModelState = EntityState.Unchanged;
        }
        public int Id { get; set; }
        public string Text { get; set; }
        public bool Done { get; set; }
        public EntityState ModelState { get; set; }
    }
}