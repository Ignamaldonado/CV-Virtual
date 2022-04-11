const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator')

const userFilePath = path.join(__dirname, '../data/user.JSON');
var user = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

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
        if (user.email.toLowerCase() == req.body.email.toLowerCase()) {
            if (bcrypt.compareSync(req.body.password , user.password)) {
            logged = user.email
            req.session.logged = logged
            res.render('index' , {user , loggedUser : req.session.logged})
        } else {
            let changepassword = true
            res.render('login' , {errors: [{msg: "Contrasenia invalida" , old: req.body}] , old: req.body , changepassword})
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
    },

    editput: (req,res) => {
            let {name, position, about, phone, location, HTML, CSS, Bootstrap, JavaScript, Python, mySQL, jobtitle, jobdate, jobsubtitle, jobcomment, studytitle1, studydate1, studysubtitle1, studytitle2, studydate2, studysubtitle2} = req.body
            let avatar;
            let email;
            let web;
            let password;
            if (jobtitle == '') {
                jobdate = ''
                jobsubtitle = ''
                jobcomment = ''
            }
            if (req.file) {
                avatar = "/img/avatars/" + req.file.filename
                password = user.password
                email = req.body.email.toLowerCase()
                web = req.body.web.toLowerCase()
                user = {name, position, avatar, about, phone, email, web, location, HTML, CSS, Bootstrap, JavaScript, Python, mySQL, password, jobtitle, jobdate, jobsubtitle, jobcomment, studytitle1, studydate1, studysubtitle1, studytitle2, studydate2, studysubtitle2}
            } else {
                password = user.password
                avatar = user.avatar
                email = req.body.email.toLowerCase()
                web = req.body.web.toLowerCase()
                user = {name, position, avatar, about, phone, email, web, location, HTML, CSS, Bootstrap, JavaScript, Python, mySQL, password, jobtitle, jobdate, jobsubtitle, jobcomment, studytitle1, studydate1, studysubtitle1, studytitle2, studydate2, studysubtitle2}
            }
            let editedUser = JSON.stringify (user)
            fs.writeFileSync (userFilePath , editedUser)
            res.render ('index' , {user, loggedUser : req.session.logged})
        }
}

module.exports = controller;