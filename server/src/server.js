const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require("./routes/allRoutes");
const prisma = require('./db');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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

app.get('/api/materials', async (req, res) => {
  try {
    const materials = await prisma.authors.findMany();

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Ошибка при получении materials:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

const start = async () => {
    try {
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (e) {
        console.log(e);
    }
};

start();