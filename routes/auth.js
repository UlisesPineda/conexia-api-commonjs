const { Router } = require('express'); 

const { body, check } = require('express-validator');

const { activateUser, getUserData, login, register, renewToken, resetPassword, sendResetPasswordMail, setNewAvatar, setNewEmail, setNewEnterprise, setNewPassword, setNewUser, setTheme } = require("../controllers/auth.js");
const validateInput = require("../middlewares/validateInput.js");
const validateJWT = require("../middlewares/validateJWT.js");
const isAcceptedTerms = require("../helpers/isAcceptedTerms.js");

const authRouter = Router();
module.exports = authRouter;
// module.exports = authRouter = Router();

authRouter.post(
    '/register',
    [
        check('user', '-Todos los campos son obligatorios').not().isEmpty(),
        check('email', '-Todos los campos son obligatorios').not().isEmpty(),
        check('password', '-Todos los campos son obligatorios').not().isEmpty(),
        check('email', '-El formato de correo es inválido').isEmail(),
        check('password', '-Tu password debe contener de 8 a 16 caracteres, al menos una mayúscula, una minúscula y al menos un número').matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/),
        check('isAccepted', 'Debes aceptar los términos y condiciones' ).custom( isAcceptedTerms ),
        validateInput,
    ],
     register
);

authRouter.get(
    '/activate-user/:token',
    activateUser
);

authRouter.post(
    '/login',
    login
);

authRouter.post(
    '/request-reset-password',
    sendResetPasswordMail
),

authRouter.post(
    '/reset-password/:token',
    resetPassword
);

authRouter.get(
    '/renew',
    validateJWT,
    renewToken
);

authRouter.put(
    '/theme',
    validateJWT,
    setTheme
);

authRouter.get(
    '/settings',
    validateJWT,
    getUserData
);

authRouter.put(
  '/settings/new-enterprise',
  validateJWT,
  [
    check('enterprise', 'Todos los campos son obligatorios').not().isEmpty(),
    validateInput,
  ],
  setNewEnterprise  
);

authRouter.put(
    '/settings/new-user',
    validateJWT,
    [
        check('user', 'Todos los campos son obligatorios').not().isEmpty(),
        validateInput,
    ],
    setNewUser
);

authRouter.put(
    '/settings/new-email',
    validateJWT,
    [
        check('email', '-Todos los campos son obligatorios').not().isEmpty(),
        check('email', '-El formato de correo es inválido').isEmail(),
        validateInput,
    ],
    setNewEmail
);

authRouter.put(
    '/settings/new-password',
    validateJWT,
    [
        check('password', '-Todos los campos son obligatorios').not().isEmpty(),
        check('password', '-Tu password debe contener de 8 a 16 caracteres, al menos una mayúscula, una minúscula y al menos un número').matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/),
        check('confirmPassword', '-Todos los campos son obligatorios').not().isEmpty(),
        body('password').custom(
            ( value, { req } ) => {
                if( value !== req.body.confirmPassword ) {
                    throw new Error('Los passwords no coinciden');
                }
                return true;
            }
        ),
        validateInput,
    ],
    setNewPassword
);

authRouter.put(
    '/settings/new-avatar',
    validateJWT,
    [
        check('avatar', '-No has seleccionado una imagen').not().isEmpty(),
        validateInput,
    ],
    setNewAvatar
);

