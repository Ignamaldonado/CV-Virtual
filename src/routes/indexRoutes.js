const express = require('express'); // llamado express
const controller = require ('../controllers/indexController'); // llamado controllers

const router = express.Router(); // parametro enrutador de express 

router.get('/', controller.index); // rooteo de get

router.get('/login' , controller.login)
router.post('/login', controller.auth)

router.get('/edit', controller.editview)

module.exports = router; // export