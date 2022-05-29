using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class publicacion
    {
        public publicacion()
        {
            comentarios = new HashSet<comentario>();
        }

        public int id { get; set; }
        public DateTime? fecha_publicacion { get; set; }
        public string? media { get; set; }
        public string? ubicacion { get; set; }
        public int? id_usuario { get; set; }

        public virtual usuario? id_usuarioNavigation { get; set; }
        public virtual ICollection<comentario> comentarios { get; set; }
    }
}
