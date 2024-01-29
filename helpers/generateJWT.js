const jwt = require('jsonwebtoken');

const generateJWT = ( uid, user ) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, user };
        jwt.sign( 
            payload, 
            process.env.JWT_KEY,
            {
                expiresIn: '1h',
            },
            (err, token) => {
                if( err ) {
                    console.log( err );
                    reject( 'No se pudo generar el token' );
                }
                else {
                    resolve( token );
                }
            }
         );
    });
};

module.exports = generateJWT;
