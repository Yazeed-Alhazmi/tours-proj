
// const dotenv = require('dotenv');
// dotenv.config({path: './config.env'});

// const app = require('./myUdemy');


// // console.log(process.env);

// const port = process.env.PORT;
// app.listen(port, () => {
//     console.log("Listening on port " + port);
// });









// ================ mongoose

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({path: './config.env'});

const app = require('./app');

const db = process.env.DATABASE;
mongoose.connect(db)
.then(() => {
    console.log("connected");
});






// (async () => {
//     console.log(await Tour.find({}));
// })();

// const newTour = new tourModel({name:"The Forest Hiker", temp:"hh"});
// newTour.save();

// console.log(process.env);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("Listening on port " + port);
});
