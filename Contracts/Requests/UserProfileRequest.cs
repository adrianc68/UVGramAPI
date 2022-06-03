using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UVGramAPI.Contracts.Requests
{
    public class UserProfileRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Presentation { get; set; }
    }
}