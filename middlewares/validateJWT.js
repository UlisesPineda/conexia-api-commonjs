const { response } = require("express");
const jwt = require('jsonwebtoken');

const validateJWT = ( req, res = response, next ) => {
    const token = req.header('x-token');
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No existe el token'
        });
    }
    else {
        try {
            const { uid, user } = jwt.verify( token, process.env.JWT_KEY );  
            req.uid = uid;
            req.user = user;
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido'
            });
        };
    }
    next();
};

module.exports = validateJWT;
