const express = require('express'); // llamado express
const controller = require ('../controllers/indexController'); 
const {check} = require('express-validator');
const multer = require('multer');
const path = require('path');// llamado controllers

const auth = require('../middleware/authmiddleware')
const guest = require('../middleware/guestmiddleware')

const validator = [
    check('email')
        .notEmpty()
        .withMessage('Tienes que completar el campo de email')
        .bail()
        .isEmail()
        .withMessage('Tienes que completar con un email valido'),
    check('password')
        .notEmpty()
        .withMessage('Tienes que completar el campo de contraseña')
]   

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        let imgFolder = path.join(__dirname, '../../public/img/avatars')
       cb(null, imgFolder); 
    },
    filename: function(req,file,cb){
        let fileName = file.fieldname + Date.now() + path.extname(file.originalname) 
       cb(null, fileName);
    }
})
var uploadFile = multer({storage: storage})

const router = express.Router(); // parametro enrutador de express 

router.get('/', controller.index); // rooteo de get

router.get('/login' , guest , controller.login)
router.post('/login', validator , controller.auth)

router.get('/password' , guest , controller.passchange)
router.put('/password' , controller.passwordput)

router.get('/edit', auth , controller.editview)
router.put('/edit', auth , uploadFile.single('avatar') , controller.editput)
/*router.get('/check', (req,res) => {
    if (req.session.logged == undefined) {
        res.send('no te logueaste papu')
    } else {
        res.send('tas logueado')
    }
})*/

module.exports = router // export