const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/UserModel.js');

const generateJWT = require('../helpers/generateJWT.js');
const activeJWT = require('../helpers/activeJWT.js');
const sendConfirmMail = require('../helpers/sendConfirmMail.js');
const sendResetPassMail = require('../helpers/sendResetPassMail.js');

const register = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        if( usuario ){
            return res.status(400).json({
                ok: false,
                message: 'El usuario ya existe',
            });
        }
        else {
            usuario = new Usuario( req.body );
            const token = await activeJWT( usuario.email );
            const encodedToken = btoa( token );
            const salt = bcrypt.genSaltSync();

            usuario.password = bcrypt.hashSync( password, salt );
            usuario.enterprise = 'Conexia Point CRM';
            usuario.image = process.env.IMG_USER_URL;
            usuario.isDark = true;
            usuario.isActive = false;
            usuario.isSuspended = false;
            usuario.token = encodedToken;
            
            await usuario.save();
            const { email, user } = usuario;
            sendConfirmMail( email, user, encodedToken );

            return res.status(201).json({
                ok: true,
                message: 'Te hemos enviado un correo con las instrucciones para activar tu usuario',
                uid: usuario._id,
                user: usuario.user,
                token,
            });        
        }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: 'No se pudo crear el nuevo usuario',
      }); 
    };
};

const activateUser = async( req, res = response ) => {
    const { token } = req.params;

    try {
        const usuario = await Usuario.findOne({ token });

        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario ya fue activado o no existe',
            });
        }
        else {
            const decodedToken = atob( usuario.token );
            try {
                jwt.verify( decodedToken, process.env.JWT_KEY );
    
                usuario.isActive = true;
                usuario.token = null;
                usuario.save();
                return res.status(200).json({
                    ok: true,
                    msg: 'El usuario fue activado exitosamente, ya puedes iniciar sesión',
                });    
            } catch (error) {
                console.log(error);
                return res.status(401).json({
                    ok: false,
                    msg: 'Error al activar el usuario'
                });    
            }       
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No se pudo activar el usuario'
          });     
    };
};

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        const isUserActive = usuario.isActive;
        if( !isUserActive ){
            return res.status(401).json({
                ok: false,
                message: 'El usuario no se ha activado, revisa tu correo y sigue las instrucciones para activar tu usuario',
            });
        }
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(401).json({
                ok: false,
                message: 'El password es incorrecto',
            });
        }
        if( usuario.isSuspended ){
            return res.status(403).json({
                ok: false,
                message: 'Tu cuenta presentó un problema de seguridad y ha sido suspendida',
            });
        }
        else {
            const { user, image, enterprise, isDark, isActive, _id } = usuario;
            const token = await generateJWT( usuario._id, usuario.user );
            return res.status(201).json({
                ok: true,
                message: `El usuario: ${ user } ha iniciado sesión correctamente`,
                _id,
                isDark,
                email,
                token,
                user,
                image,
                enterprise,
                isActive
            });    
        }      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: 'Hubo un error de autenticación'
        }); 
    };
};

const sendResetPasswordMail = async(req, res = response) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        if( usuario.isSuspended ){
            return res.status(403).json({
                ok: false,
                message: 'Tu cuenta presentó un problema de seguridad y ha sido suspendida',
            });
        }
        const isUserActive = usuario.isActive;
        if( !isUserActive ){
            return res.status(401).json({
                ok: false,
                message: 'El usuario no se ha activado, revisa tu correo y sigue las instrucciones para activar tu usuario',
            });
        }
        else {
            const token = await activeJWT( usuario.email );
            const encodedToken = btoa( token );
            usuario.token = encodedToken;
            usuario.save();
            const { email, user } = usuario;
            sendResetPassMail( email, user, encodedToken );
            return res.status(201).json({
                ok: true,
                message: 'Te hemos enviado un correo con las instrucciones para cambiar tu password',
            });        
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: 'No se pudo generar el cambio de password',
        }); 
    };
};

const resetPassword = async(req, res = response) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const usuario = await Usuario.findOne({ token });

        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no se encontró en la base de datos',
            });
        }
        else {
            const decodedToken = atob( usuario.token );
            try {
                jwt.verify( decodedToken, process.env.JWT_KEY );
                
                const salt = bcrypt.genSaltSync();
                usuario.password = bcrypt.hashSync( password, salt );
                usuario.token = null;
                usuario.save();
                return res.status(200).json({
                    ok: true,
                    msg: 'El password fue actualizado exitosamente, ya puedes iniciar sesión',
                });    
            } catch (error) {
                console.log(error);
                return res.status(401).json({
                    ok: false,
                    msg: 'Hubo un problema con el cambio de password, envía un correo a soporte@conexiapoint.com',
                });    
            }       
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un problema con el cambio de password, envía un correo a soporte@conexiapoint.com',
        });   
    };
};

const renewToken = async(req, res = response) => {
    const { uid, user } = req;

    try {
        const token = await generateJWT( uid, user );
        const usuario = await Usuario.findById(uid);
        const { email, image, enterprise, isDark, _id } = usuario;
    
        return res.status(201).json({
            ok: true,
            message: 'Token Renovado',
            _id,
            isDark,
            user,
            email,
            token,
            image,
            enterprise
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al generar el token',
        });   
    }
};

const getUserData = async(req, res = response) => {   
    const usuarioID = req.uid;

    try {
        let { user, email, enterprise, image, isDark, _id } = await Usuario.findOne({ _id: usuarioID })
            .select('user email enterprise image');

        return res.status(200).json({
            ok: true,
            msg: "Información del usuario obtenida correctamente",
            id: _id,
            usuario: user,
            correo: email,
            empresa: enterprise,
            imagen: image,
            theme: isDark,
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: 'Error al obtener información del usuario'
        });   
    };
};

const setTheme = async(req, res = response) => {
    const _id = req.uid;

    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            usuario.isDark = !usuario.isDark;
            usuario.save();
            return res.status(200).json({
                ok: true,
                msg: 'El theme fue actualizado exitosamente',
                isDark: usuario.isDark,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: 'Hubo un error al cambiar el theme, intenta más tarde'
        });      
    };
};

const setNewEnterprise = async(req, res = response) => {
    const _id = req.uid;
    const { enterprise } = req.body;

    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            usuario.enterprise = enterprise;
            usuario.save();

            return res.status(200).json({
                ok: true,
                message: 'La empresa fue actualizada exitosamente',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          message: 'Error al actualizar la empresa',
        });      
    }
};

const setNewUser = async(req, res = response) => {
    const _id = req.uid;
    const { user } = req.body;

    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            usuario.user = user;
            usuario.save();
            const { image, enterprise, isDark, isActive, email } = usuario;
            const token = await generateJWT( usuario._id, usuario.user );

            return res.status(200).json({
                ok: true,
                message: 'El usuario fue actualizado exitosamente',
                isDark,
                email,
                token,
                user,
                image,
                enterprise,
                isActive
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          message: 'Error al actualizar el nombre de usuario',
        });      
    };
};

const setNewEmail = async(req, res = response) => {
    const _id = req.uid;
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            usuario.email = email;
            usuario.save();

            return res.status(200).json({
                ok: true,
                message: `Tu nuevo usuario es: ${ email }`,
                messageText: 'Asegúrate de cambiarlo en tu próximo inicio de sesión',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          message: 'Error al actualizar el email',
        });      
    }
};

const setNewPassword = async(req, res = response) => {
    const _id = req.uid;
    const { password } = req.body;

    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else{
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync( password, salt );
            usuario.save();
            return res.status(200).json({
                ok: true,
                message: 'Tu password ha sido actualizado',
                messageText: 'Asegúrate de cambiarlo en tu próximo inicio de sesión',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          message: 'Error al actualizar el password, intenta más tarde',
        });      
    }
};

const setNewAvatar = async(req, res = response) => {
    const _id = req.uid;
    const { avatar } = req.body;
    try {
        const usuario = await Usuario.findOne({ _id });
        if( !usuario ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            usuario.image = avatar;
            usuario.save();
            return res.status(200).json({
                ok: true,
                message: 'Tu imagen de perfil ha sido actualizada',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          message: 'Error al actualizar la imagen',
        });      
    }
};

module.exports = {
    register,
    activateUser,
    login,
    sendResetPasswordMail,
    resetPassword,
    renewToken,
    getUserData,
    setTheme,
    setNewEnterprise,
    setNewUser,
    setNewEmail,
    setNewPassword,
    setNewAvatar,
};