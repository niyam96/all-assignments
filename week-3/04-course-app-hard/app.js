const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/index');
const cors = require('cors');

var config = require('./config/config');
var DB_URI = config.MONGODB_URI;
var port = config.APP_STARTUP_PORT || 3000;

app.use(cors());
app.use(express.json());

//MongoDB stuff
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(DB_URI);
}

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


