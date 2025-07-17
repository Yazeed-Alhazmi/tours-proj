const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../../models/tourModel');
const fs = require('fs');

dotenv.config({path:'./config.env'});


const db = process.env.DATABASE;
mongoose.connect(db)
.then(() => {
    console.log("connected");
});


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data Successfully loaded");

    }
    catch (err){
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data Successfully deleted");
    }
    catch (err){
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import'){
    importData();
}
else if (process.argv[2] === '--delete'){
    deleteData();
}
