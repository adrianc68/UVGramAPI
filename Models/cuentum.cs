using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class cuentum
    {
        public int id { get; set; }
        public string? correo { get; set; }
        public string? contrasena { get; set; }
        public string? codigo_recuperacion { get; set; }
        public int? id_usuario { get; set; }

        public virtual usuario? id_usuarioNavigation { get; set; }
    }
}
