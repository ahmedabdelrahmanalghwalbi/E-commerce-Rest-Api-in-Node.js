const express = require("express");
const app = express();
const morgan = require("morgan");
const createError = require("http-errors");
require('./helpers/mongo_init');
const authRouter = require('./routes/Auth-route');
const productRouter = require("./routes/products");
const orderProducts = require('./routes/order');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter);
app.use('/order', orderProducts);
app.use('/product', productRouter);

//handling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Controll-Allow-Orign", "*");
    res.setHeader("Access-Controll-Allow-Methods", "*");
    res.setHeader("Access-Controll-Allow-Headers", "Authorization");
    next();
});

//handling not found the router error
app.use(async (req, res, next) => {
    next(createError.NotFound("the router that you try to access it is not found"));
});

app.use((err, req, res, next) => {
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server on in port ${port}`);
});