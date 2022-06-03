using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class RolUsuario
    {
        public RolUsuario()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public int id { get; set; }
        public DateOnly? fecha_nacimiento { get; set; }
        public string? telefono { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
