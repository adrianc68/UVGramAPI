const getUser = (request, response) => {
    response.send("Getting user")
}

const createUser = async (request, response) => {
    const { password, email, name, presentation, username } = request.body;
    let confirmationCode = "PLEASE GENERATE ME";
}

module.exports = {createUser, getUser}