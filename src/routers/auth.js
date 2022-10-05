const router = require('express').Router();

router.get("/", function(request, response){
    const message = "hello world";
    response.json({message: message});
})

module.exports = router;