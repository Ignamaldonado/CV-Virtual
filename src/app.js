const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const indexRoutes = require('./routes/indexRoutes');  
const session = require('express-session')// Requires

const app = express(); // llamado de express

app.use (express.static('public')); // middle para definir la carpeta public

app.use (express.urlencoded({extended: false})); // middle que trae los datos del form 
app.use(express.json()); // middle para que los datos que se envian provengan como JSON

app.use(session({secret: 'secret'}));

app.use(methodOverride('_method')) // method override para utilizar PUT y DELETE

app.set('view engine', 'ejs') // template engine
app.set ('views' , path.join(__dirname, '/views')) // directorio template engine

app.use('/' , indexRoutes) // rooteo del index

app.listen(3000 , () => {
    console.log('listening on port 3000')
}) // arranca el server