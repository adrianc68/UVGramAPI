using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class Usuario
    {
        public int id { get; set; }
        public string? nombre { get; set; }
        public string? presentacion { get; set; }
        public string nombre_usuario { get; set; } = null!;
        public int? id_configuracion_usuario { get; set; }
        public int? id_cuenta { get; set; }
        public int? id_rol_usuario { get; set; }

        public virtual ConfiguracionUsuario? id_configuracion_usuarioNavigation { get; set; }
        public virtual Cuentum? id_cuentaNavigation { get; set; }
        public virtual RolUsuario? id_rol_usuarioNavigation { get; set; }
    }
}
