const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const app = require('./app');

// connect to database
const db = process.env.DATABASE;
mongoose.connect(db)
.then(() => {
    console.log("connected");
});


const port = process.env.PORT;
app.listen(port, () => {
    console.log("Listening on port " + port);
});
