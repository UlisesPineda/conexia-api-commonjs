const jwt = require('jsonwebtoken');

const activeJWT = ( email ) => {
    return new Promise((resolve, reject) => {
        const payload = { email };
        jwt.sign( 
            payload, 
            process.env.JWT_KEY,
            {
                expiresIn: '7d',
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

module.exports = activeJWT;
