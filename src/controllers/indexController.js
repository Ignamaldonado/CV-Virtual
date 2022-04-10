const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator')

const userFilePath = path.join(__dirname, '../data/user.JSON');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

const controller = {
    index: (req,res) => {
        res.render('index' , {user , loggedUser : req.session.logged})
    },

    login: (req,res) => {
        res.render('login')
    },

    auth: (req,res) => {
        let logged;
        let errors = validationResult(req)
        if (errors.isEmpty()) {
        if (user.email == req.body.email) {
            if (bcrypt.compareSync(req.body.password , user.password)) {
            logged = user
            req.session.logged = logged
            res.render('index' , {user , loggedUser : req.session.logged})
        } else {
            let changepassword = true
            res.render('login' , {errors: [{msg: "Contrasenia invalida"}] , old: req.body , changepassword})
        }
        } else {
            res.render('login' , {errors: [{msg: "Email invalido, prueba ignacio.maldonado96@gmail.com"}] , old: req.body})
        }
        } else {
            return res.render('login' , {errors : errors.array() , old : req.body , user})
        }}
        ,

        
    passchange: (req, res) => {
        res.render('password-edit')
    },
    
    passwordput: (req,res) => {
        let newPassword = req.body.password
        if (newPassword) {
            user.password = bcrypt.hashSync(newPassword , 10)
            let passwordedit = JSON.stringify(user)
            fs.writeFileSync (userFilePath, passwordedit)
            res.render('index' , {user , loggedUser : req.session.logged})
        }
    },

    editview: (req,res) => {
        res.render('edit' , {user})
    }
}

module.exports = controller;