const {validationResult} = require('express-validator');

const handleValidation = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()){
        return res.status(422).json({
            error:error.array()
        });
    }
    next();
}

module.exports = handleValidation;