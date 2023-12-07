const mongoose = require('mongoose')

// ! for dotenv the following order must be assured 
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// this connect function returns a promise 
mongoose.connect(process.env.DB_STRING)
    .then(() => console.log('DB connection successful!'))
    .catch(err => {
        console.log('Could not connect to db -> ' + err)
        process.exit(1)
    })





const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})


