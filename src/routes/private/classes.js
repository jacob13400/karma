var express = require('express')
var router = express.Router()
var methods = require('_/data/methods')

router.post('/', function (req, res) {
  var info = {}
  info.class_slug = req.body.slug
  info.start_date = req.body.start_date
  info.end_date = req.body.end_date
  methods.Academics.addClasses(info)
    .then((model) => {
      res.send(model)
    })
    .catch((err) => {
      res.send({
        'status': 'error',
        'error': err
      })
    })
})
router.get('/', function (req, res) {
  res.json({success: true})
})
module.exports = router
