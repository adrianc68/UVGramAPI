using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class ConfiguracionUsuario
    {
        public ConfiguracionUsuario()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public int id { get; set; }
        public string? tipo_privacidad { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
