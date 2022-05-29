using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace UVGramAPI.Models
{
    public partial class UvgramContext : DbContext
    {
        public UvgramContext()
        {
        }

        public UvgramContext(DbContextOptions<UvgramContext> options)
            : base(options)
        {
        }

        public virtual DbSet<comentario> comentarios { get; set; } = null!;
        public virtual DbSet<configuracionpublicacion> configuracionpublicacions { get; set; } = null!;
        public virtual DbSet<configuracionusuario> configuracionusuarios { get; set; } = null!;
        public virtual DbSet<cuentum> cuenta { get; set; } = null!;
        public virtual DbSet<empresarial> empresarials { get; set; } = null!;
        public virtual DbSet<gustarcomentario> gustarcomentarios { get; set; } = null!;
        public virtual DbSet<gustarpublicacion> gustarpublicacions { get; set; } = null!;
        public virtual DbSet<mensaje> mensajes { get; set; } = null!;
        public virtual DbSet<moderador> moderadors { get; set; } = null!;
        public virtual DbSet<personal> personals { get; set; } = null!;
        public virtual DbSet<publicacion> publicacions { get; set; } = null!;
        public virtual DbSet<reportamiento> reportamientos { get; set; } = null!;
        public virtual DbSet<reporte> reportes { get; set; } = null!;
        public virtual DbSet<rolusuario> rolusuarios { get; set; } = null!;
        public virtual DbSet<seguimiento> seguimientos { get; set; } = null!;
        public virtual DbSet<usuario> usuarios { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("****");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresEnum("estadocuenta", new[] { "normal", "expulsado" })
                .HasPostgresEnum("tipocategoria", new[] { "blog_personal", "producto_o_servicio", "arte", "musico_o_banda", "compras_ventas_minoristas", "salud_belleza", "tiendas_comestibles" })
                .HasPostgresEnum("tipoprivacidad", new[] { "publico", "privado" })
                .HasPostgresEnum("tiporeporte", new[] { "spam", "desnudos_o_actividad_sexual", "incitacion_al_odio", "violencia_u_organizaciones_peligrosas", "venta_articulos_ilegales_o_regulados", "bullying_o_acoso", "infraccion_de_la_propiedad_intelectual", "suicidio_o_autolesion", "transtornos_alimenticios", "estafa_o_frade", "informacion_falsa", "simplemente_no_me_gusta", "publica_contenido_que_no_deberia_estar", "suplantacion_identidad", "menor_de_edad" })
                .HasPostgresEnum("tiposexo", new[] { "masculino", "femenino", "indiferente" });

            modelBuilder.Entity<comentario>(entity =>
            {
                entity.ToTable("comentario");

                entity.Property(e => e.fecha).HasColumnType("timestamp without time zone");

                entity.HasOne(d => d.id_publicacionNavigation)
                    .WithMany(p => p.comentarios)
                    .HasForeignKey(d => d.id_publicacion)
                    .HasConstraintName("comentario_id_publicacion_fkey");

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany(p => p.comentarios)
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("comentario_id_usuario_fkey");
            });

            modelBuilder.Entity<configuracionpublicacion>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("configuracionpublicacion");

                entity.HasOne(d => d.id_publicacionNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_publicacion)
                    .HasConstraintName("configuracionpublicacion_id_publicacion_fkey");
            });

            modelBuilder.Entity<configuracionusuario>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("configuracionusuario");

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("configuracionusuario_id_usuario_fkey");
            });

            modelBuilder.Entity<cuentum>(entity =>
            {
                entity.Property(e => e.codigo_recuperacion).HasMaxLength(8);

                entity.Property(e => e.contrasena).HasMaxLength(320);

                entity.Property(e => e.correo).HasMaxLength(320);

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany(p => p.cuenta)
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("cuenta_id_usuario_fkey");
            });

            modelBuilder.Entity<empresarial>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("empresarial");

                entity.Property(e => e.ciudad).HasMaxLength(120);

                entity.Property(e => e.direccion_postal).HasMaxLength(640);

                entity.Property(e => e.email_contacto).HasMaxLength(320);

                entity.Property(e => e.telefono_contacto).HasMaxLength(10);

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("empresarial_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<gustarcomentario>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("gustarcomentario");

                entity.HasOne(d => d.id_comentarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_comentario)
                    .HasConstraintName("gustarcomentario_id_comentario_fkey");

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("gustarcomentario_id_usuario_fkey");
            });

            modelBuilder.Entity<gustarpublicacion>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("gustarpublicacion");

                entity.HasOne(d => d.id_publicacionNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_publicacion)
                    .HasConstraintName("gustarpublicacion_id_publicacion_fkey");

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("gustarpublicacion_id_usuario_fkey");
            });

            modelBuilder.Entity<mensaje>(entity =>
            {
                entity.ToTable("mensaje");

                entity.Property(e => e.fecha).HasColumnType("timestamp without time zone");

                entity.Property(e => e.mensaje1).HasColumnName("mensaje");

                entity.HasOne(d => d.id_emisorNavigation)
                    .WithMany(p => p.mensajeid_emisorNavigations)
                    .HasForeignKey(d => d.id_emisor)
                    .HasConstraintName("mensaje_id_emisor_fkey");

                entity.HasOne(d => d.id_receptorNavigation)
                    .WithMany(p => p.mensajeid_receptorNavigations)
                    .HasForeignKey(d => d.id_receptor)
                    .HasConstraintName("mensaje_id_receptor_fkey");
            });

            modelBuilder.Entity<moderador>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("moderador");

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("moderador_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<personal>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("personal");

                entity.Property(e => e.facultad).HasMaxLength(320);

                entity.Property(e => e.programa_educativo).HasMaxLength(320);

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("personal_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<publicacion>(entity =>
            {
                entity.ToTable("publicacion");

                entity.Property(e => e.fecha_publicacion).HasColumnType("timestamp without time zone");

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany(p => p.publicacions)
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("publicacion_id_usuario_fkey");
            });

            modelBuilder.Entity<reportamiento>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("reportamiento");

                entity.HasOne(d => d.id_ofendidoNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_ofendido)
                    .HasConstraintName("reportamiento_id_ofendido_fkey");

                entity.HasOne(d => d.id_ofensorNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_ofensor)
                    .HasConstraintName("reportamiento_id_ofensor_fkey");

                entity.HasOne(d => d.id_reporteNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_reporte)
                    .HasConstraintName("reportamiento_id_reporte_fkey");
            });

            modelBuilder.Entity<reporte>(entity =>
            {
                entity.ToTable("reporte");
            });

            modelBuilder.Entity<rolusuario>(entity =>
            {
                entity.ToTable("rolusuario");

                entity.Property(e => e.nombre_completo).HasMaxLength(320);

                entity.Property(e => e.telefono).HasMaxLength(10);

                entity.HasOne(d => d.id_usuarioNavigation)
                    .WithMany(p => p.rolusuarios)
                    .HasForeignKey(d => d.id_usuario)
                    .HasConstraintName("rolusuario_id_usuario_fkey");
            });

            modelBuilder.Entity<seguimiento>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("seguimiento");

                entity.HasOne(d => d.id_seguidoNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_seguido)
                    .HasConstraintName("seguimiento_id_seguido_fkey");

                entity.HasOne(d => d.id_seguidorNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_seguidor)
                    .HasConstraintName("seguimiento_id_seguidor_fkey");
            });

            modelBuilder.Entity<usuario>(entity =>
            {
                entity.ToTable("usuario");

                entity.Property(e => e.nombre).HasMaxLength(320);

                entity.Property(e => e.presentacion).HasMaxLength(320);

                entity.Property(e => e.usuario1)
                    .HasMaxLength(320)
                    .HasColumnName("usuario");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
