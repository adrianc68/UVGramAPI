using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class Personal
    {
        public string? facultad { get; set; }
        public string? programa_educativo { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual RolUsuario? id_rol_usuarioNavigation { get; set; }
    }
}
