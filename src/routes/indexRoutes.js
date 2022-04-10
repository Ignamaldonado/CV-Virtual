const express = require('express'); // llamado express
const controller = require ('../controllers/indexController'); 
const {check} = require('express-validator');// llamado controllers

const auth = require('../middleware/authmiddleware')
const guest = require('../middleware/guestmiddleware')

const validator = [
    check('email')
        .notEmpty()
        .withMessage('capo te falto un email')
        .bail()
        .isEmail()
        .withMessage('alto tonto no sabes ni poner un email'),
    check('password')
        .notEmpty()
        .withMessage('Tienes que ingresar una contrasenia')
]   

const router = express.Router(); // parametro enrutador de express 

router.get('/', controller.index); // rooteo de get

router.get('/login' , guest , controller.login)
router.post('/login', validator , controller.auth)

router.get('/password' , controller.passchange)
router.put('/password' , controller.passwordput)

router.get('/edit', auth , controller.editview)

/*router.get('/check', (req,res) => {
    if (req.session.logged == undefined) {
        res.send('no te logueaste papu')
    } else {
        res.send('tas logueado')
    }
})*/

module.exports = router // export