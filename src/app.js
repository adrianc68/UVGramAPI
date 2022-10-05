const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");


app.set("port", 8080);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.disable("etag");

app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(require("./routers/auth"));

const server = app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});

module.exports = {server};
