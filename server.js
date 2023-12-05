// ! for dotenv the following order must be assured 
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });


const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})


