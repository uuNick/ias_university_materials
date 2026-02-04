require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
//const sequelize = require("./db");
//const models = require("./models/Models");
const router = require("./routes/allRoutes");
//const { EmployeeSeed, DocumentSeed, SickLeaveSeed, VacationSeed, DayOffSeed, UserSeed, RoleSeed, UserRoleSeed } = require("./seed");

const port = process.env.SERVER_PORT;
const app = express()

const corsOptions = {
    origin: process.env.DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
//app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/api", router);
app.get("/", function(request, response){
     
    response.send("<h2>Привет Express!</h2>");
});

const start = async () => {
    try {
        //await sequelize.authenticate();
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (e) {
        console.log(e);
    }
};

start();