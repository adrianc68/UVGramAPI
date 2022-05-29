using Microsoft.AspNetCore.Mvc;
using UVGramAPI.Models;

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
    public List<usuario> ListaUsuarios()
    {
        return dbContext.usuarios.OrderBy(a => a.nombre).ToList();
    }

}