require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { sequelize } = require("./database/connectionDatabaseSequelize");
const { User } = require("./models/User");
const { Account } = require("./models/Account");
const { AccountVerification } = require("./models/AccountVerification");
const { UserConfiguration } = require("./models/UserConfiguration");


app.set("port", process.env.SV_PORT);

//middlewares

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.disable("etag");
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// app.use(require("./routers/autentication"));

async function main() {
    try {
        await sequelize.sync({ force: false })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ;
        // const users = await User.findAll();
        // console.log("All users:", JSON.stringify(users, null));
        
        
        console.log("**************** :) ***************");


        // const accounts = await Account.findAll();
        // console.log("All accounts:", JSON.stringify(accounts, null));




        console.log("*******************")
        // const accountverification = await AccountVerification.findAll();
        // console.log(JSON.stringify(accountverification, null, 1));
        console.log("*******************")
        const userConfiguration = await UserConfiguration.findAll();
        console.log(JSON.stringify(userConfiguration, null, 2));


        app.listen(app.get("port"), () => {
            console.log(`Server on port ${app.get("port")}`);
        });
    } catch( error ) {
        console.error("Unable to connect to the database", error)
    }    
}

main();

