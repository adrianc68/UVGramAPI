using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class rolusuario
    {
        public int id { get; set; }
        public DateOnly? fecha_nacimiento { get; set; }
        public string? nombre_completo { get; set; }
        public string? telefono { get; set; }
        public int? id_usuario { get; set; }

        public virtual usuario? id_usuarioNavigation { get; set; }
    }
}
