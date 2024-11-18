const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ari.boehm9@ethereal.email',
        pass: 'GbrmydnEK5YCQp5mCC'
    }
});