const ExceptionType = {
	USER: {
		BAD_PASSWORD: "La contraseña proporcionada es incorrecta",
		EMAIL_ALREADY_REGISTERED: "El correo electrónico proporcionado ya está registrado",
		INVALID_INPUT: "Los datos proporcionados son inválidos",
		PERMISSION_DENIED: "No tienes permisos suficientes para realizar esta acción",
		NOT_FOUND: "No se encontró el usuario",
		INVALID_DATA: "Los datos proporcionados son inválidos",
		MISSING_FIELD: "Falta uno o más campos obligatorios",
		DATA_TOO_LONG: "Los datos proporcionados son demasiado largos"
	},
	SERVICES: {
		API_ERROR: "Error al comunicarse con un servicio externo",
		CONNECTION_ERROR: "Error de conexión con un servicio externo",
		TIMEOUT_ERROR: "Tiempo de espera agotado al comunicarse con un servicio externo",
		AUTHENTICATION_ERROR: "Error de autenticación al acceder a un servicio externo"
	},
	SYSTEM: {
		CONFIGURATION_ERROR: "Error de configuración del sistema",
		DATABASE_ERROR: "Error en la base de datos",
		DISK_FULL: "El disco está lleno, no se pueden realizar más operaciones",
		INTERNAL_ERROR: "Error interno del sistema"
	}
};

module.exports = ExceptionType;

