const express = require('express')
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router()


let dogs = [
    {name: 'Stranga Thangz', image: 'https://ae01.alicdn.com/kf/HTB1cINhc7fb_uJkSnfoq6z_epXaf/American-Bully-Dog-Model-Ornaments-Resin-Crafts-Simulation-Gift-Car-Home-Decorative.jpg'},
    {name: 'The Big Bang Theory', image: "https://i.ytimg.com/vi/dRBD4mFabGA/maxresdefault.jpg"},
    {name: 'Swole-On', image: "https://thereview.ca/wp-content/uploads/2018/06/Submitted_American-Bully-dog-show_WEB.jpg"},
    {name: 'Big Bucks', image: 'https://www.usbones.com/wp-content/uploads/2017/06/Bully-Dog.jpg'},
    {name: 'Zoo-Zoo', image: 'https://i.pinimg.com/originals/8b/ab/79/8bab79f1cfd48c3baa022f5f8d756edc.jpg'},
    {name: "Wham-Wham", image: 'https://t1.uc.ltmcdn.com/en/images/9/5/6/walks_and_exercise_5659_3_600.jpg'}
]

let post = [
    {postTitle: 'POST ONE', postBody: "Hello this is post one"}
]



router.get('/', (req, res) => {
    res.render('dogs', {dogs})
})

router.post('/',ensureAuthenticated, (req, res) => {
    let newDog = {
        name: req.body.name,
        image: req.body.image
    }
    dogs.push(newDog)
    res.redirect('/dogs')
})

router.get('/new',ensureAuthenticated, (req, res) => {
    res.render('new-dog')
})

module.exports = router