const dotenv = require('dotenv');
const mongoose = require('mongoose');
//environment config
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('success');
  });

const port = 3333;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
