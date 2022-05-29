using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class moderador
    {
        public DateOnly? fecha_cambio { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual rolusuario? id_rol_usuarioNavigation { get; set; }
    }
}
