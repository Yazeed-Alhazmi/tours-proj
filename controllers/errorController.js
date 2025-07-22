module.exports = (err, req, res, next) => {
    console.log({err})
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode*1).json({
        status: err.status,
        message: err.message
    });
}