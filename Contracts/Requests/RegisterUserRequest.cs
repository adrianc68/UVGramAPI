using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UVGramAPI.Contracts.Requests
{
    public class RegisterUserRequest
    {
           public string Username {get; set;}
        public string Email { get; set; }
        public string Name { get; set; }
        public string? Presentation { get; set; }
        public string Password { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }

        public override string ToString(){
            return Username + " " + Email + " " + Name + " " + Presentation + " " + new DateOnly(year, month, day);
        }  
    }
}