const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth',
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('db connected successfully');
}).catch((err) => {
    console.log('error');
})