using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class configuracionpublicacion
    {
        public bool? comentarios_permitidos { get; set; }
        public bool? conteo_permitidos { get; set; }
        public bool? megusta_permitidos { get; set; }
        public int? id_publicacion { get; set; }

        public virtual publicacion? id_publicacionNavigation { get; set; }
    }
}
