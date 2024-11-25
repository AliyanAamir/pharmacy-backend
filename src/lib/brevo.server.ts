import nodemailer from 'nodemailer';
import config from '../config/config.service';

const brevoTransport = nodemailer.createTransport({
  host: config.BREVO_HOST,
  port: 587,
  secure: false,
  auth: {
    user: config.BREVO_USER,
    pass: config.BREVO_PASSWORD,
  },
});

export default brevoTransport;
