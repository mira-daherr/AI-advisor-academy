import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL as string;

/**
 * Sends an email using Resend
 */
export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html: string
): Promise<boolean> => {
    if (!process.env.RESEND_API_KEY || !FROM_EMAIL) {
        console.error('RESEND_API_KEY or FROM_EMAIL is missing from environment variables.');
        return false;
    }

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            text,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return false;
        }

        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (err) {
        console.error('Unexpected error sending email:', err);
        return false;
    }
};

/**
 * Sends a welcome email upon successful registration
 */
export const sendWelcomeEmail = async (to: string, name: string): Promise<boolean> => {
    const subject = 'مرحباً بك في المستشار الأكاديمي الذكي';
    const text = `أهلاً ${name}،\n\nمرحباً بك في المستشار الأكاديمي الذكي! نحن سعداء بانضمامك إلينا.\n\nمع أطيب التحيات،\nفريق المستشار الأكاديمي الذكي`;
    const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: right;">
      <h2>مرحباً بك في المستشار الأكاديمي الذكي!</h2>
      <p>أهلاً ${name}،</p>
      <p>نحن سعداء بانضمامك إلينا. تم تصميم منصتنا لتزويدك بتوصيات أكاديمية مخصصة بناءً على ملفك الشخصي الفريد.</p>
      <p>دعنا نجد المسار الأكاديمي المثالي لك!</p>
      <p>مع أطيب التحيات،<br><strong>فريق المستشار الأكاديمي الذكي</strong></p>
    </div>
  `;

    return sendEmail(to, subject, text, html);
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async (to: string, resetLink: string): Promise<boolean> => {
    const subject = 'طلب إعادة تعيين كلمة المرور';
    const text = `لقد تلقيت هذا البريد الإلكتروني لأنك طلبت إعادة تعيين كلمة المرور لحسابك.\n\nالرجاء النقر على الرابط التالي لإكمال العملية:\n\n${resetLink}\n\nإذا لم تطلب ذلك، فيرجى تجاهل هذا البريد الإلكتروني.`;
    const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: right;">
      <h2>طلب إعادة تعيين كلمة المرور</h2>
      <p>لقد تلقيت هذا البريد الإلكتروني لأنك (أو أي شخص آخر) طلبت إعادة تعيين كلمة المرور لحسابك.</p>
      <p>الرجاء النقر على الرابط أدناه لإكمال العملية:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">إعادة تعيين كلمة المرور</a>
      <p>أو الصق هذا الرابط في متصفحك:</p>
      <p><a href="${resetLink}" dir="ltr" style="display: block; text-align: left;">${resetLink}</a></p>
      <p>إذا لم تطلب ذلك، فيرجى تجاهل هذا البريد الإلكتروني وستظل كلمة المرور الخاصة بك دون تغيير.</p>
    </div>
  `;

    return sendEmail(to, subject, text, html);
};
