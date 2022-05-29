using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class personal
    {
        public string? facultad { get; set; }
        public string? programa_educativo { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual rolusuario? id_rol_usuarioNavigation { get; set; }
    }
}
