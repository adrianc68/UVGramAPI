using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UVGramAPI.Models
{
    public partial class usuario
    {
        public usuario()
        {
            comentarios = new HashSet<comentario>();
            cuenta = new HashSet<cuentum>();
            mensajeid_emisorNavigations = new HashSet<mensaje>();
            mensajeid_receptorNavigations = new HashSet<mensaje>();
            publicacions = new HashSet<publicacion>();
            rolusuarios = new HashSet<rolusuario>();
        }

        public int id { get; set; }
        public string? nombre { get; set; }
        public string? presentacion { get; set; }
        public string? usuario1 { get; set; }

        public virtual ICollection<comentario> comentarios { get; set; }
        public virtual ICollection<cuentum> cuenta { get; set; }
        public virtual ICollection<mensaje> mensajeid_emisorNavigations { get; set; }
        public virtual ICollection<mensaje> mensajeid_receptorNavigations { get; set; }
        public virtual ICollection<publicacion> publicacions { get; set; }
        public virtual ICollection<rolusuario> rolusuarios { get; set; }
    }
}
