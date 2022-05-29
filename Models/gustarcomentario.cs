using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class gustarcomentario
    {
        public int? id_usuario { get; set; }
        public int? id_comentario { get; set; }

        public virtual comentario? id_comentarioNavigation { get; set; }
        public virtual usuario? id_usuarioNavigation { get; set; }
    }
}
