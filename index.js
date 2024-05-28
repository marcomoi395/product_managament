const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();

const database = require('./config/database');

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.admin.route");
const systemConfig = require("./config/system.js");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash Messages
app.use(cookieParser('keyboard cat'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Public
app.use(express.static(`${__dirname}/public`));

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
