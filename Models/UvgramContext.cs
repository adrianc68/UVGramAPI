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

        public virtual DbSet<ConfiguracionUsuario> ConfiguracionUsuarios { get; set; } = null!;
        public virtual DbSet<Cuentum> Cuenta { get; set; } = null!;
        public virtual DbSet<Empresarial> Empresarials { get; set; } = null!;
        public virtual DbSet<Moderador> Moderadors { get; set; } = null!;
        public virtual DbSet<Personal> Personals { get; set; } = null!;
        public virtual DbSet<RolUsuario> RolUsuarios { get; set; } = null!;
        public virtual DbSet<Usuario> Usuarios { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("Host=177.244.181.38;Database=uvgram;Username=uvgram;Password=adrianserver");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresEnum("estadocuenta", new[] { "normal", "expulsado" })
                .HasPostgresEnum("tipocategoria", new[] { "blog_personal", "producto_o_servicio", "arte", "musico_o_banda", "compras_ventas_minoristas", "salud_belleza", "tiendas_comestibles" })
                .HasPostgresEnum("tipoprivacidad", new[] { "publico", "privado" })
                .HasPostgresEnum("tiporeporte", new[] { "spam", "desnudos_o_actividad_sexual", "incitacion_al_odio", "violencia_u_organizaciones_peligrosas", "venta_articulos_ilegales_o_regulados", "bullying_o_acoso", "infraccion_de_la_propiedad_intelectual", "suicidio_o_autolesion", "transtornos_alimenticios", "estafa_o_frade", "informacion_falsa", "simplemente_no_me_gusta", "publica_contenido_que_no_deberia_estar", "suplantacion_identidad", "menor_de_edad" })
                .HasPostgresEnum("tiposexo", new[] { "masculino", "femenino", "indiferente" });

            modelBuilder.Entity<ConfiguracionUsuario>(entity =>
            {
                entity.ToTable("ConfiguracionUsuario");

                entity.Property(e => e.tipo_privacidad).HasMaxLength(120);
            });

            modelBuilder.Entity<Cuentum>(entity =>
            {
                entity.Property(e => e.codigo_recuperacion).HasMaxLength(8);

                entity.Property(e => e.contrasena).HasMaxLength(320);

                entity.Property(e => e.correo).HasMaxLength(320);

                entity.Property(e => e.estado_cuenta).HasMaxLength(120);
            });

            modelBuilder.Entity<Empresarial>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Empresarial");

                entity.Property(e => e.ciudad).HasMaxLength(120);

                entity.Property(e => e.direccion_postal).HasMaxLength(640);

                entity.Property(e => e.email_contacto).HasMaxLength(320);

                entity.Property(e => e.telefono_contacto).HasMaxLength(10);

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("Empresarial_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<Moderador>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Moderador");

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("Moderador_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<Personal>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Personal");

                entity.Property(e => e.facultad).HasMaxLength(320);

                entity.Property(e => e.programa_educativo).HasMaxLength(320);

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("Personal_id_rol_usuario_fkey");
            });

            modelBuilder.Entity<RolUsuario>(entity =>
            {
                entity.ToTable("RolUsuario");

                entity.Property(e => e.telefono).HasMaxLength(10);
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuario");

                entity.Property(e => e.nombre).HasMaxLength(320);

                entity.Property(e => e.nombre_usuario).HasMaxLength(320);

                entity.Property(e => e.presentacion).HasMaxLength(320);

                entity.HasOne(d => d.id_configuracion_usuarioNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.id_configuracion_usuario)
                    .HasConstraintName("Usuario_id_configuracion_usuario_fkey");

                entity.HasOne(d => d.id_cuentaNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.id_cuenta)
                    .HasConstraintName("Usuario_id_cuenta_fkey");

                entity.HasOne(d => d.id_rol_usuarioNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.id_rol_usuario)
                    .HasConstraintName("Usuario_id_rol_usuario_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
