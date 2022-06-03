using System.Linq;
using Microsoft.AspNetCore.Mvc;
using UVGramAPI.Models;
using UVGramAPI.Contracts.Requests;

namespace UVGramAPI.Controller;

[ApiController]
[Route("[controller]")]
public class UsuarioController : ControllerBase
{
    private UvgramContext dbContext;

    public UsuarioController(UvgramContext dbContext)
    {
        this.dbContext = dbContext;
    }


    [HttpGet]
    [Route("/Users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public List<UserProfileRequest> ListaUsuarios()
    {
        return dbContext.Usuarios.Select(a => new UserProfileRequest() {
            Username = a.nombre_usuario,
            Email = "test",
            Name = a.nombre,
            Presentation = a.presentacion
        }).ToList();
    }


    [HttpPost]
    [Route("/Users/Register")]
    public int RegisterUser([FromBody] RegisterUserRequest user) {
        System.Console.WriteLine(user);
        int idUserAdded = -1;

        RolUsuario rolUsuario = new RolUsuario() {
            fecha_nacimiento = new DateOnly(user.year, user.month, user.day)
        };

        ConfiguracionUsuario configuracionUsuario = new ConfiguracionUsuario() {
            tipo_privacidad = TipoPrivacidad.publico.ToString()
        };

        Cuentum cuentum = new Cuentum() {
            correo = user.Email,
            contrasena = user.Password,
            estado_cuenta = EstadoCuenta.normal.ToString()
        };

        Usuario usuario = new Usuario() {
            nombre = user.Name,
            presentacion = user.Presentation,
            nombre_usuario = user.Username,
            id_cuentaNavigation = cuentum,
            id_configuracion_usuarioNavigation = configuracionUsuario,
            id_rol_usuarioNavigation = rolUsuario
        };
        
        var added = dbContext.Add(usuario);
        dbContext.SaveChanges();
        idUserAdded = usuario.id;
        return idUserAdded;
    }

 


    // [HttpPost]
    // [Route("/Users/Register")]
    // public bool RegisterUser(Usuario user) {
    //     System.Console.WriteLine(user);
    //     try {
    //         // dbContext.Add(user);
    //         // dbContext.SaveChanges();
    //         return true;
    //     } catch (Exception e) {
    //         Console.WriteLine(e);
    //         return false;
    //     }

    

    // [HttpGet]
    // [Route("/Usuarios/find/{username}")]
    // public bool FindByUsername(string username)
    // {
    //     return dbContext.usuarios.FirstOrDefault(x => x.nombre_usuario.Equals(username)) != null;
    // }

    // [HttpGet]
    // [Route("/Usuarios/find/account/{email}")]
    // public bool FindByEmail(string email)
    // {
    //     return dbContext.cuenta.FirstOrDefault(x => x.correo.Equals(email)) != null;
    // }

    // [HttpPost]
    // [Route("/Usuarios/register/")]
    // public bool AddUserAccount(PostRq request) {
    //     System.Console.WriteLine(request);
    //     try {
    //         cuentum account = new cuentum() {
    //             correo = request.email,
    //             contrasena = request.password,
    //         };

    //         usuario user = new usuario()
    //         {
    //             nombre = request.name,
    //             nombre_usuario = request.username,
    //             presentacion = request.presentacion,
    //             cuenta = (ICollection<cuentum>) account,
    //         };
    //         dbContext.Add(user);
    //         dbContext.SaveChanges();
    //         return true;
    //     } catch (Exception e) {
    //         Console.WriteLine(e);
    //         return false;
    //     }
    // }

    //  public class PostRq
    // {
    //     public string username {get; set;}
    //     public string password {get; set;}
    //     public string email { get; set; }
    //     public string name { get; set; }

    //     public string presentacion { get; set; }
    // }
  


}