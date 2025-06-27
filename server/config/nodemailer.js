import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SNMTP_USER,
        pass:process.env.SNMTP_PASSWORD ,

    },

    

}
);


export default transporter;