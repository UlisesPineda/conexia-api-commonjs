const nodemailer = require('nodemailer');

const sendResetPassMail = async(email, usuario, token) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
         from: 'CRM CONEXIA POINT <contacto@conexiapoint.com>',
         to: email,
         subject: "ACTUALIZA TU PASSWORD DE CONEXIA POINT",
         text: 'Actualiza tu password',
         html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ACTUALIZA TU PASSWORD DE CONEXIA POINT</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="background-color: #ffffff; margin-top: 20px;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <img src="${ process.env.IMG_USER_URL }" alt="Avatar Conexia Point" style="display: block; margin: 10px auto; height: 100px; width: 100px;">
                            <p style="font-size: 16px; color: #333; text-align: center;">Hola <strong style="color: #845ec2">${ usuario }</strong>, da clic en el siguiente enlace para actualizar tu password y administra tus contactos en tu CRM CONEXIAPOINT.</p>
                            <a href="${ process.env.FRONT_END_URL }/cambiar-password/${ token }" style="display: inline-block; padding: 10px 20px; background-color: #845ec2; border-radius: 5px; color: #fff; text-decoration: none; font-size: 16px; margin-top: 50px;">ACTUALIZAR PASSWORD</a>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
         `,
    });
};

module.exports = sendResetPassMail;
