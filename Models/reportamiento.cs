using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class reportamiento
    {
        public int? id_ofendido { get; set; }
        public int? id_ofensor { get; set; }
        public int? id_reporte { get; set; }

        public virtual usuario? id_ofendidoNavigation { get; set; }
        public virtual usuario? id_ofensorNavigation { get; set; }
        public virtual reporte? id_reporteNavigation { get; set; }
    }
}
