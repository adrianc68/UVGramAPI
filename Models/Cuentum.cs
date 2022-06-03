using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class Cuentum
    {
        public Cuentum()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public int id { get; set; }
        public string correo { get; set; } = null!;
        public string contrasena { get; set; } = null!;
        public string? codigo_recuperacion { get; set; }
        public string? estado_cuenta { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
