const bcrypt = require('bcrypt')
const User = require('../database/models/User')

module.exports = (req, res) => {
    console.log("data is :",req.body)
    const {
        email,
        password
    } = req.body;
    // try to find the user
    User.findOne({
        email
    }, (error, user) => {
        if (user) {
            // compare passwords.
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    // store user session.
                    console.log("Session data is:",req.session)
                    console.log("User id is :",user._id)
                    res.redirect('/')
                } else {
                    res.redirect('/auth/login')
                }
            })
        } else {
            return res.redirect('/auth/login')
        }
    })
}