const { User } = require("../models/User");
const { Accounts } = require("../models/Account");

const getUser = (request, response) => {
    response.send("Getting user")
}

const createUser = async (request, response) => {
    const { password, email, name, presentation, username } = request.body;
    let confirmationCode = "PLEASE GENERATE ME";
    // const newUser = new User({
    //     name,
    //     presentation,
    //     username,
    //     Accounts: {
    //         contraseña,
    //         correo,
    //         id,
    //     }
    // });
    // const newAccount = new Accounts.create({
    //     contraseña,
    //     correo,
    //     id,
    //     User: {
    //         name,
    //         presentation,
    //         username
    //     } 
    // });

    console.log(request.body);
    response.send("Hola");

}

module.exports = {createUser, getUser}