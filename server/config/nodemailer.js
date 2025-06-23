import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "8f3bfb001@smtp-brevo.com",
        pass: "1UV2D9jgAIWaRfn5",

    },

    

}
);


export default transporter;