const nodemailer = require('nodemailer');

const sendConfirmMail = async(email, usuario, token) => {

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
         subject: "ACTIVA TU USUARIO DE CONEXIA POINT",
         text: 'Comienza a usar tu administrador de contactos',
         html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ACTIVA TU USUARIO DE CONEXIA POINT</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="background-color: #ffffff; margin-top: 20px;">
                    <tr>
                        <td align="center" style="padding: 25px 5px;">
                            <img src="${ process.env.IMG_USER_URL }" alt="Avatar Conexia Point" style="display: block; margin: 10px auto; height: 100px; width: 100px;">
                            <p style="font-size: 16px; color: #333; text-align: center;">Hola <strong style="color: #845ec2">${ usuario }</strong>, da clic en el siguiente enlace para activar tu usuario y comienza a administrar tus contactos en tu CRM CONEXIAPOINT.</p>
                            <a href="${ process.env.FRONT_END_URL }/activar-usuario/${ token }" style="display: inline-block; padding: 10px 20px; background-color: #845ec2; border-radius: 5px; color: #fff; text-decoration: none; font-size: 16px; margin-top: 50px;">ACTIVAR USUARIO</a>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
         `,
    });
};

module.exports = sendConfirmMail;
