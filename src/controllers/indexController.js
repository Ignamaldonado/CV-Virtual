const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const userFilePath = path.join(__dirname, "../data/user.JSON");
var user = JSON.parse(fs.readFileSync(userFilePath, "utf8"));

const controller = {
  index: (req, res) => {
    if (!req.session.logged) {  
        let myUser = user.find (obj => obj.id === 1650149618085)
        res.render('index' , {user : myUser , loggedUser: req.session.logged})}
    else {
        let userToShow = user.find (obj => obj.email === req.session.logged)
        res.render('index' , {user : userToShow , loggedUser: req.session.logged})
        } 
  },

  loginview: (req, res) => {
    let comeFromEdit = false
    res.render("login" , {comeFromEdit});
  },

  login: (req, res) => {
    let comeFromEdit = false
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        errors: errors.array(),
        old: req.body,
        comeFromEdit
      });
    } else {
      let userLogin = user.find(
        (obj) => obj.email.toLowerCase() === req.body.email.toLowerCase()
      );
      if (!userLogin) {
        res.render("login", {
          errors: [
            {
              msg: "Email invalido",
              comeFromEdit
            },
          ],
        });
      } else {
        if (!bcrypt.compareSync(req.body.password, userLogin.password)) {
          let changepassword = true;
          res.render("login", {
            errors: [
              {
                msg: "Contraseña invalida",
                old: req.body,
                comeFromEdit
              },
            ],
            old: req.body,
            changepassword,
          });
        } else {
          req.session.logged = userLogin.email;
          if (userLogin.name == '') {
            res.render("edit", { user: userLogin });
          } else {
            res.redirect("/");
          }
        }
      }
    }
  },

  registerview: (req, res) => {
    res.render("register");
  },

  register: (req, res) => {
    let emailCheck = user.find(
      (obj) => obj.email.toLowerCase() === req.body.email.toLowerCase()
    );
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render("register", {
            errors: errors.array(),
            old: req.body,
          });
    } else {
    if (!emailCheck) {
      let passwordObj = bcrypt.hashSync(req.body.password, 10);
      let userRegister = {id: Date.now(),name:'',position:'',avatar:'',about:'',phone:'',email: req.body.email,web:'',location:'',HTML:1,CSS:1,Bootstrap:1,JavaScript:1,Python:1,mySQL:1,password: passwordObj ,jobtitle:'',jobdate:'',jobsubtitle:'',jobcomment:'',studytitle1:'',studydate1:'',studysubtitle1:'',studytitle2:'',studydate2:'',studysubtitle2:''};
      user.push(userRegister);
      let newUser = JSON.stringify(user);
      fs.writeFileSync(userFilePath, newUser);
      res.redirect("/login");
    } else {
      res.render("register", {
        errors: [
          {
            msg: "El email ya existe",
            old: req.body,
          },
        ],
        old: req.body,
      });
    }
  }
},

  passchangeview: (req, res) => {
    res.render("password-edit");
  },

  passchange: (req, res) => {
    let newPassword = req.body.password;
    if (newPassword) {
      user.password = bcrypt.hashSync(newPassword, 10);
      let passwordedit = JSON.stringify(user);
      fs.writeFileSync(userFilePath, passwordedit);
      res.redirect("/");
    }
  },

  editview: (req, res) => {
    let editUser = user.find (obj => obj.email == req.session.logged)
    res.render("edit", {
      user : editUser,
    });
  },

  editput: (req, res) => {
      for (let i = 0; i <user.length; i++) {
          if (user[i].email == req.session.logged) {
            let {name,position,about,phone,web,location,HTML,CSS,Bootstrap,JavaScript,Python,mySQL,jobtitle,jobdate,jobsubtitle,jobcomment,studytitle1,studydate1,studysubtitle1,studytitle2,studydate2,studysubtitle2} = req.body;
            let id = user[i].id
            let avatar;
            let email = req.body.email.toLowerCase()
            let password = user[i].password
            if (jobtitle == "") {
              jobdate = "";
              jobsubtitle = "";
              jobcomment = "";
            }
            if (studytitle2 == "") {
                studydate2 = "";
                studysubtitle2 = "";
              }
            if (!req.file) {
                avatar = '/img/avatars/defaultUser.png'
                user[i] = {id,name,position,avatar,about,phone,email,web,location,HTML,CSS,Bootstrap,JavaScript,Python,mySQL,password,jobtitle,jobdate,jobsubtitle,jobcomment,studytitle1,studydate1,studysubtitle1,studytitle2,studydate2,studysubtitle2}
            } else {
                avatar = '/img/avatars/' + req.file.filename
                user[i] = {id,name,position,avatar,about,phone,email,web,location,HTML,CSS,Bootstrap,JavaScript,Python,mySQL,password,jobtitle,jobdate,jobsubtitle,jobcomment,studytitle1,studydate1,studysubtitle1,studytitle2,studydate2,studysubtitle2}
            }
            let editedUser = JSON.stringify(user)
            fs.writeFileSync(userFilePath,editedUser)
            let comeFromEdit = true
            res.render('login' , {comeFromEdit})
          if (user[i] == user[user.length - 1] && user[i].email != req.session.logged) {
            res.send('se te fue el loggeo')
          }
          } 
    }
  }
}
module.exports = controller
