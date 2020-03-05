const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());

app.use("/", require("./compare_carros/routes/servicos"));

app.listen(3000, () => {
    console.log("Listening to por 3000");
});