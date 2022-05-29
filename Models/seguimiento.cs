using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class seguimiento
    {
        public int? id_seguidor { get; set; }
        public int? id_seguido { get; set; }

        public virtual usuario? id_seguidoNavigation { get; set; }
        public virtual usuario? id_seguidorNavigation { get; set; }
    }
}
