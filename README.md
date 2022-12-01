# UVGramAPI

UVGram es un proyecto para las experiencias educativas de **Desarrollo de Sistemas en Red** y **Desarrollo de Aplicaciones** de la Universidad Veracruzana. 

Cuyo objetivo es el siguiente:

> "Construir software en ambientes heterogéneos de red, mediante el empleo de técnicas, lenguajes y herramientas con el fin de construir software interoperable, con sentido de colaboración, honestidad y respeto."



## Acerca del proyecto

Este proyecto trata de desarrollar una red social simple y similar a una de las redes sociales mas conocidas (IG), con el objetivo de satisfacer los problemas de comunicación comentados en ambas experiencias educativas. 

## Construcción

Estas instrucciones te pueden ayudar a ejecutar el proyecto de forma local en tu maquina.  Para ello, asegurate de seguir las siguientes instrucciones.

### Prerequisitos

* Asegurarse de tener Docker y Docker Compose instalado:
	- **Windows**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/windows-install/ "Instalar Docker")
	- **macOs**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/mac-install/ "Instalar Docker")
	- **Linux**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/linux-install/ "Instalar Docker")
* Asegurarse de tener instalado npm:
	- **Windows or macOs or Linux**: [Instalar npm](https://nodejs.org/en/download/ "Instalar npm")

1. Duplicar el repositorio
	```sh
	git clone https://github.com/adrianc68/UVGramAPI
	```

### Ejecución Docker en local
1. Acceder al directorio
	```sh
	cd /UVGramAPI/services/
	```
2. Ejecutar docker-compose
	```sh
	docker-compose up -d --build
	```
### Ejecución API REST en local

2. Acceder al directorio
	```sh
	cd ./UVGramAPI/
	```
3. Instalar los paquetes npm
	```sh
	npm install
	```
4. Agregar el <a href="#readme-envfile">archivo de configuración</a> `.env` al mismo nivel del directorio `/src`
5. Ejecutar la aplicación.
	- Entorno de **produccion**:
	```
	nodemon
	```
	- Entorno de **pruebas**:
	```
	npm test
	```


<a name="readme-envfile"></a>
#### Archivo de configuración 

La siguiente tabla describe los pares clave/valor que son necesarios para el funcionamiento de la aplicación. Estos deben ser contenidos dentro de un archivo `.env` al mismo nivel del directorio `/src`.


<p align="right">(<a href="#readme-top"><a href="#example-envfile" ="right" >Ver ejemplo</a></a>)</p>

|  Nombre | Descripción  |
| ------------ | ------------ |
|  `SV_PORT` | Corresponde al puerto donde se ejecutará la API REST, generalmente el puerto es `8080`  |
|  `TOKEN_SECRET` | Corresponde a una llave secreta, la cuál será utilizada para firmar los JSON Web Token.  |
| `EXPIRATION_TIME_INSTANT`  |  Corresponde al tiempo de expiración del token de acceso. Por ejemplo: `24h` |
| `EXPIRATION_TIME_LONG_TIME` | Corresponde al tiempo de expiración del token de 'refresh'. Por ejemplo : `730h`   |
| `LOG_LEVEL` **(opcional)** | Corresponde a una propiedad para definir el nivel que especifica el nivel máximo de mensajes que debe registrar un transporte. Es utilizado para configurar a winston. Debe utilizarse `trace`. y si no es especificado entonces será usado el mismo `trace`. |
|`DB_USER` | Corresponde al nombre de usuario que será utilizado para acceder a la base de datos de **PRODUCCIÓN**. Por ejemplo: `dev`. |
| `DB_HOST` | Corresponde a la dirección del host que provee el servicio de la base de datos de **PRODUCCION**. Por ejemplo `localhost`. |
| `DB_DATABASE` | Corresponde al nombre de la base de datos de **PRODUCCIÓN**. Por ejemplo `uvgram_db`. |
| `DB_PASSWORD` | Corresponde a la contraseña de acceso para el usuario para la base de datos de **PRODUCCIÓN**. Por ejemplo `hola1234`. |
| `DB_PORT`| Corresponde al puerto de la base de datos de **PRODUCCIÓN** donde el servicio se ofrece en el host. Por ejemplo `5432`. | 
| `REDIS_HOST` | Corresponde a la dirección del host que provee el servicio Redis de **PRODUCCIÓN**; donde se almacenan los Tokens. Por ejemplo `localhost`. |
| `REDIS_PORT`| Corresponde al puerto del servicio Redis de **PRODUCCIÓN** donde el servicio se ofrece. Por ejemplo `6379`. |
| `REDIS_USER`| Corresponde al nombre de usuario para acceder al servidor Redis de **PRODUCCIÓN**. Por ejemplo `user1234` | 
| `TEST_DB_USER` | Corresponde al nombre de usuario que será utilizado para acceder a la base de datos de **PRUEBAS**. Por ejemplo: `dev`. |
| `TEST_DB_HOST` | Corresponde a la dirección del host que provee el servicio de la base de datos de **PRUEBAS**. Por ejemplo `localhost`. |
| `TEST_DB_DATABASE` | Corresponde al nombre de la base de datos de **PRUEBAS**. Por ejemplo `test_uvgram_db` |
| `TEST_DB_PASSWORD` | Corresponde a la contraseña de acceso para el usuario para la base de datos de **PRUEBAS**. Por ejemplo `hola1234`. |
| `TEST_DB_PORT` | Corresponde al puerto de la base de datos de **PRUEBAS** donde el servicio se ofrece en el host. Por ejemplo `6380` |

<a name="example-envfile"></a>

```ini
SV_PORT=8080
TOKEN_SECRET=thisisatest
EXPIRATION_TIME_INSTANT=24h
EXPIRATION_TIME_LONG_TIME=730h
LOG_LEVEL=trace

DB_USER=user
DB_HOST=localhost
DB_DATABASE=uvgram_db
DB_PASSWORD=user1234
DB_PORT=5432

REDIS_HOST=localhost
REDIS_PASSWORD=user1234
REDIS_PORT=6379
REDIS_USER=default

TEST_DB_USER=user
TEST_DB_HOST=localhost
TEST_DB_DATABASE=test_uvgram_db
TEST_DB_PASSWORD=user1234
TEST_DB_PORT=5433

TEST_REDIS_HOST=localhost
TEST_REDIS_PASSWORD=user1234
TEST_REDIS_PORT=6380
TEST_REDIS_USER=default
```


