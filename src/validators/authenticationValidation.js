const { httpResponseInternalServerError, httpResponseUnauthorized, httpResponseNotFound } = require("../helpers/httpResponses");
const { Account } = require("../models/Account");
const { encondePassword } = require("../helpers/cipher");
const { Op } = require("sequelize");
const { User } = require("../models/User");

const getAccountExist = async (emailOrUsername) => {
    const user = await User.findAll({
        where: {
            [Op.or]: [{ usuario: emailOrUsername }, { '$Cuentum.correo$': emailOrUsername }]
        },
        attributes: ["id"],
        include: [{
            model: Account,
            as: "Cuentum",
            attributes: ["contraseña"],
        }],
        plain: true,
        raw: true
    });
    return user;
}

const validationLoginData = async (request, response) => {
    const { emailOrUsername, password } = request.body;
    try {
        await getAccountExist(emailOrUsername).then(user => {
            if (user != undefined && user.length != 0) {
                if (encondePassword(password) == user["Cuentum.contraseña"]) {
                    // Add TOKEN and attempts validation
                    //return response.status(StatusCodes.OK).json({ message: "User and password match" });
                    return response.send("OK");
                } else {
                    return httpResponseUnauthorized(response, "password does not match");
                }
            } else {
                return httpResponseNotFound(response, "No data found");
            }
        });
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
}

module.exports = { validationLoginData }



