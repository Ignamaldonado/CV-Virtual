const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '../data/user.JSON');
const user = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

const controller = {
    index: (req,res) => {
        res.render('index' , {user})
    },

    login: (req,res) => {
        res.render('login')
    },

    auth: (req,res) => {
        let {email, password} = req.body
        
        res.send('anda el post douuuu')
    },

    editview: (req,res) => {
        res.render('edit' , {user})
    }
}

module.exports = controller;