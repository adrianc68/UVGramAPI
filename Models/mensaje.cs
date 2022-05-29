using System;
using System.Collections.Generic;

namespace UVGramAPI.Models
{
    public partial class mensaje
    {
        public int id { get; set; }
        public int? id_receptor { get; set; }
        public int? id_emisor { get; set; }
        public string? mensaje1 { get; set; }
        public string? media_url { get; set; }
        public DateTime? fecha { get; set; }

        public virtual usuario? id_emisorNavigation { get; set; }
        public virtual usuario? id_receptorNavigation { get; set; }
    }
}
