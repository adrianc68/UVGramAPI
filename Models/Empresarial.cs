using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class Empresarial
    {
        public string? ciudad { get; set; }
        public int? codigo_postal { get; set; }
        public string? direccion_postal { get; set; }
        public string? email_contacto { get; set; }
        public string? telefono_contacto { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual RolUsuario? id_rol_usuarioNavigation { get; set; }
    }
}
