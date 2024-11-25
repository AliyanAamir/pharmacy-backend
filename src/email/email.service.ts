import { render } from '@react-email/render';
import ResetPasswordEmail from './templates/ResetPassword';
import brevoTransport from '../lib/brevo.server';
import config from '../config/config.service';
import logger from '../lib/logger.service';
import Mail from 'nodemailer/lib/mailer';

export type SendResetPasswordTypePayload = {
  email: string;
  resetLink: string;
  userName: string;
};

class EmailError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'EmailError';
  }
}

export class EmailService {
  private static async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const messageData: Mail.Options = {
        from: config.BREVO_USER,
        to,
        subject,
        html,
      };

      const result = await brevoTransport.sendMail(messageData);

      logger.info({
        msg: 'Email sent successfully',
        to,
        subject,
      });

      return result;
    } catch (error) {
      logger.error({
        msg: 'Failed to send email',
        error,
        to,
        subject,
      });

      throw new EmailError('Failed to send email', error);
    }
  }

  static async sendResetPasswordEmail(payload: SendResetPasswordTypePayload) {
    const { email, resetLink, userName } = payload;

    try {
      // Render the React email template to HTML
      const emailHtml = await render(
        ResetPasswordEmail({
          resetLink,
          userName,
        }),
      );

      // Send the email with the rendered HTML
      await this.sendEmail({
        to: email,
        subject: 'Reset Your Password',
        html: emailHtml,
      });
    } catch (error) {
      logger.error({
        msg: 'Failed to send reset password email',
        error,
        email,
      });

      throw new EmailError('Failed to send reset password email', error);
    }
  }
}

// Export the sendResetPasswordEmail function to maintain backward compatibility
export const sendResetPasswordEmail =
  EmailService.sendResetPasswordEmail.bind(EmailService);
