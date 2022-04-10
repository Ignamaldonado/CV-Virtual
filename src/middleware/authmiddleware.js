let auth = (req, res , next) => {
    if (req.session.logged == undefined) {
        res.render ('admin-auth')
    } else {
        next()
    }
} 

module.exports = auth