const express = require('express'); 
const cors = require('cors');
require('dotenv').config();

const dbMongoConection = require('./database/config.js');
const authRouter = require('./routes/auth.js');
const eventsRouter = require('./routes/events.js');
const contactsRouter = require('./routes/contacts.js');

dbMongoConection();

const app = express();
const port = process.env.PORT;

app.use( cors() );
app.use( express.static('public') );
app.use( express.json() );

app.use( '/api/auth', authRouter );
app.use( '/api/events', eventsRouter );
app.use( '/api/contacts', contactsRouter );


app.listen( port, () => {
    console.log(`Servidor corriendo en el puerto: ${ port }`);
});