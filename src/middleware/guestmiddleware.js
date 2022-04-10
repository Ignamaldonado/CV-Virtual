let guest = (req, res , next) => {
    if (req.session.logged != undefined) {
        res.render ('guest-auth')
    } else {
        next()
    }
} 

module.exports = guest