using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class configuracionusuario
    {
        public int? id_usuario { get; set; }

        public virtual usuario? id_usuarioNavigation { get; set; }
    }
}
