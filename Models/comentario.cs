using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class comentario
    {
        public int id { get; set; }
        public string? descripcion { get; set; }
        public DateTime? fecha { get; set; }
        public int? id_usuario { get; set; }
        public int? id_publicacion { get; set; }

        public virtual publicacion? id_publicacionNavigation { get; set; }
        public virtual usuario? id_usuarioNavigation { get; set; }
    }
}
