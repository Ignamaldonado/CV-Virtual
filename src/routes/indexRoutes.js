const express = require('express'); // llamado express
const controller = require ('../controllers/indexController'); 
const {check} = require('express-validator');
const multer = require('multer');
const path = require('path');// llamado controllers

const auth = require('../middleware/authmiddleware')
const guest = require('../middleware/guestmiddleware')

const validatorRegister = [
    check('email')
        .notEmpty()
        .withMessage('Tienes que completar el campo de email')
        .bail()
        .isEmail()
        .withMessage('Tienes que completar con un email valido'),
    check('password')
        .notEmpty()
        .withMessage('Tienes que completar el campo de contraseña'),
    check('confirmPassword')
        .notEmpty().withMessage("Tienes que confirmar la contraseña")
        .custom((password,{req}) =>{
            if(password !== req.body.password){
                throw new Error('Las contraseñas no coinciden')     
            }   
        return true;
        }
    )      
]   

const validatorLogin = [
    check('email')
        .notEmpty()
        .withMessage('Tienes que completar el campo de email')
        .bail()
        .isEmail()
        .withMessage('Tienes que completar con un email valido'),
    check('password')
        .notEmpty()
        .withMessage('Tienes que completar el campo de contraseña'),    
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

router.get('/login', controller.loginview)
router.post('/login', validatorLogin , controller.login)

router.get('/password' , guest , controller.passchangeview)
router.put('/password' , controller.passchange)

router.get('/edit', auth , controller.editview)
router.put('/edit', uploadFile.single('avatar') , controller.editput)

router.get('/register', guest , controller.registerview)
router.post('/register', guest, validatorRegister, controller.register)
/*router.get('/check', (req,res) => {
    if (req.session.logged == undefined) {
        res.send('no te logueaste papu')
    } else {
        res.send('tas logueado')
    }
})*/

module.exports = router // export