using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class Moderador
    {
        public DateOnly? fecha_cambio { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual RolUsuario? id_rol_usuarioNavigation { get; set; }
    }
}
