# UVGramAPI

UVGram es un proyecto para las experiencias educativas de **Desarrollo de Sistemas en Red** y **Desarrollo de Aplicaciones** de la Universidad Veracruzana.

Cuyo objetivo es el siguiente:

> "Construir software en ambientes heterogéneos de red, mediante el empleo de técnicas, lenguajes y herramientas con el fin de construir software interoperable, con sentido de colaboración, honestidad y respeto."

## Acerca del proyecto

Este proyecto trata de desarrollar una red social simple y similar a una de las redes sociales mas conocidas (IG), con el objetivo de satisfacer los problemas de comunicación comentados en ambas experiencias educativas.

## Construcción

Estas instrucciones te pueden ayudar a ejecutar el proyecto de forma local en tu maquina. Para ello, asegurate de seguir las siguientes instrucciones.

### Prerequisitos

- Asegurarse de tener Docker y Docker Compose instalado:
  - **Windows**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/windows-install/ "Instalar Docker")
  - **macOs**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/mac-install/ "Instalar Docker")
  - **Linux**: [Instalar Docker y Docker Compose](https://docs.docker.com/desktop/install/linux-install/ "Instalar Docker")
- Asegurarse de tener instalado npm:
  - **Windows or macOs or Linux**: [Instalar npm](https://nodejs.org/en/download/ "Instalar npm")

1. Duplicar el repositorio
   ```sh
   git clone https://github.com/adrianc68/UVGramAPI
   ```
2. Acceder al directorio
   ```sh
   cd ./UVGramAPI/
   ```
3. Agregar el <a href="#readme-envfile">archivo de configuración</a> `.env` al mismo nivel del directorio `/src`

### Ejecución Docker en local

2. Ejecutar docker-compose
   ```sh
   docker-compose up -d --build
   ```

### Ejecución Express JS en local

1. Instalar los paquetes npm
   ```sh
   npm install
   ```
3. Ejecutar la aplicación, según sea el caso:
   - Entorno de **produccion**:
   ```
   nodemon
   ```
   - Entorno de **pruebas**:
   ```
   npm test
   ```

#### Archivo de configuración

La siguiente tabla describe los pares clave/valor que son necesarios para el funcionamiento de la aplicación. Estos deben ser contenidos dentro de un archivo `.env` al mismo nivel del directorio `/src`.

<p align="right">Ejemplo en archivo [.env.sample](https://github.com/adrianc68/UVGramAPI/blob/main/.env.sample ".env.sample")</p>

| Nombre                      | Descripción                                                                                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SV_PORT`                   | Corresponde al puerto donde se ejecutará la API REST, generalmente el puerto es `8080`                                                                                                                                                                        |
| `TOKEN_SECRET`              | Corresponde a una llave secreta, la cuál será utilizada para firmar los JSON Web Token.                                                                                                                                                                       |
| `EXPIRATION_TIME_INSTANT`   | Corresponde al tiempo de expiración del token de acceso. Por ejemplo: `24h`                                                                                                                                                                                   |
| `EXPIRATION_TIME_LONG_TIME` | Corresponde al tiempo de expiración del token de 'refresh'. Por ejemplo : `730h`                                                                                                                                                                              |
| `LOG_LEVEL` **(opcional)**  | Corresponde a una propiedad para definir el nivel que especifica el nivel máximo de mensajes que debe registrar un transporte. Es utilizado para configurar a winston. Debe utilizarse `trace`. y si no es especificado entonces será usado el mismo `trace`. |
| `DB_USER`                   | Corresponde al nombre de usuario que será utilizado para acceder a la base de datos de **PRODUCCIÓN**. Por ejemplo: `dev`.                                                                                                                                    |
| `DB_HOST`                   | Corresponde a la dirección del host que provee el servicio de la base de datos de **PRODUCCION**. Por ejemplo `localhost`.                                                                                                                                    |
| `DB_DATABASE`               | Corresponde al nombre de la base de datos de **PRODUCCIÓN**. Por ejemplo `uvgram_db`.                                                                                                                                                                         |
| `DB_PASSWORD`               | Corresponde a la contraseña de acceso para el usuario para la base de datos de **PRODUCCIÓN**. Por ejemplo `hola1234`.                                                                                                                                        |
| `DB_PORT`                   | Corresponde al puerto de la base de datos de **PRODUCCIÓN** donde el servicio se ofrece en el host. Por ejemplo `5432`.                                                                                                                                       |
| `REDIS_HOST`                | Corresponde a la dirección del host que provee el servicio Redis de **PRODUCCIÓN**; donde se almacenan los Tokens. Por ejemplo `localhost`.                                                                                                                   |
| `REDIS_PORT`                | Corresponde al puerto del servicio Redis de **PRODUCCIÓN** donde el servicio se ofrece. Por ejemplo `6379`.                                                                                                                                                   |
| `REDIS_USER`                | Corresponde al nombre de usuario para acceder al servidor Redis de **PRODUCCIÓN**. Por ejemplo `user1234`                                                                                                                                                     |
| `TEST_DB_USER`              | Corresponde al nombre de usuario que será utilizado para acceder a la base de datos de **PRUEBAS**. Por ejemplo: `dev`.                                                                                                                                       |
| `TEST_DB_HOST`              | Corresponde a la dirección del host que provee el servicio de la base de datos de **PRUEBAS**. Por ejemplo `localhost`.                                                                                                                                       |
| `TEST_DB_DATABASE`          | Corresponde al nombre de la base de datos de **PRUEBAS**. Por ejemplo `test_uvgram_db`                                                                                                                                                                        |
| `TEST_DB_PASSWORD`          | Corresponde a la contraseña de acceso para el usuario para la base de datos de **PRUEBAS**. Por ejemplo `hola1234`.                                                                                                                                           |
| `TEST_DB_PORT`              | Corresponde al puerto de la base de datos de **PRUEBAS** donde el servicio se ofrece en el host. Por ejemplo `6380`                                                                                                                                           |
| `SV_ADDRESS` |  Corresponde a la dirección IP y puerto donde se ejecutará el servidor. Por ejemplo: `http://192.168.1.10:8080`, incluyendo el puerto y sin "/" al final. | 
| `AES_SECRET_KEY` | Corresponde a una llave que sirve para el envío de datos cifrados a través de URL en peticiones GET. 
| `SERVER_KEY` | Corresponde a una llave secreta, que permite cambiar el rol de un usuario al iniciar el servidor. |
| `TEST_NODEMAILER_HOST`| Corresponde a la dirección del host que provee el servicio de correo electrónico en el ambiente de **PRUEBAS**. El utilizado para este sistema es Mailhog. |
| `TEST_NODEMAILER_PORT`| Corresponde al puerto del host que provee el servicio de correo electrónico en el ambiente de **PRUEBAS**. El utilizado para este sistema es Mailhog. |
| `TEST_NODEMAILER_USER`| Corresponde al usuario del host que provee el servicio de correo electrónico en el ambiente de **PRUEBAS**. El utilizado para este sistema es Mailhog. |
| `TEST_NODEMAILER_PASS`| Corresponde a la contraseña del usuario del host que provee el servicio de correo electrónico en el ambiente de **PRUEBAS**. El utilizado para este sistema es Mailhog. |
| `TEST_NODEMAILER_APIV2`| Corresponde al puerto del host que provee una API. Usado únicamente para el servicio Mailhog en el ambiente de **PRUEBAS** |
| `NODEMAILER_HOST`| Corresponde a la dirección del host que provee el servicio de correo electrónico en el ambiente de **PRODUCCION**. El utilizado para este sistema es Mailhog. |
| `NODEMAILER_PORT`| Corresponde al puerto del host que provee el servicio de correo electrónico en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `NODEMAILER_USER`| Corresponde al usuario del host que provee el servicio de correo electrónico en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `NODEMAILER_PASS`| Corresponde a la contraseña del usuario del host que provee el servicio de correo electrónico en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `FTP_CLIENT_HOST`| Corresponde a la dirección del host que provee el servicio FTP en el ambiente de **PRODUCCION**. El utilizado para este sistema es Mailhog. |
| `FTP_CLIENT_USER`| Corresponde al puerto del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `FTP_CLIENT_PASSWORD`| Corresponde al usuario del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `FTP_CLIENT_PORT`| Corresponde a la contraseña del usuario del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `TEST_FTP_CLIENT_HOST`| Corresponde a la dirección del host que provee el servicio FTP en el ambiente de **PRODUCCION**. El utilizado para este sistema es Mailhog. |
| `TEST_FTP_CLIENT_USER`| Corresponde al puerto del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `TEST_FTP_CLIENT_PASSWORD`| Corresponde al usuario del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |
| `TEST_FTP_CLIENT_PORT`| Corresponde a la contraseña del usuario del host que provee el servicio FTP en el ambiente de **PRODUCCION**.. El utilizado para este sistema es Mailhog. |



