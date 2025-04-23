import { Resend } from "resend";
import type { PrismaClient } from "@prisma/client";
import { env } from "@/env"; 
import { generateFactAndknowledge } from "./action";

export interface BlogNotificationProps {
  type: "new" | "update" | "confirmation";
  blogTitle: string;
  blogUrl: string;
  description?: string;
  authorName?: string;
  subscriberName?: string;
  unsubscribeUrl?: string;
  blogName?: string;
  logoUrl?: string;
  blogImgUrl?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBlogNotificationsParams {
  db: PrismaClient;
  blogId: string;
  type: "new" | "update"; 
}

interface SendConfirmationEmailParams {
  email: string;
}

export async function sendBlogNotifications({ db, blogId, type }: SendBlogNotificationsParams) {
  console.log(`Starting sendBlogNotifications for blogId: ${blogId}, type: ${type}`);

  if (type !== "new") {
      console.warn(`Notification type "${type}" is not supported.`);
      return;
  }

  try {
    const blog = await db.blog.findUnique({
      where: { id: blogId },
      select: {
        title: true,
        slug: true,
        metaDescription: true, 
        imageUrl: true, 
        author: {
          select: {
            name: true
          }
        }
      },
    });

    if (!blog) {
      console.error(`Blog with id ${blogId} not found for notification.`);
      return;
    }

    const blogUrl = `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${blog.slug}`;
    const blogTitle = blog.title;
    const blogDescription = blog.metaDescription || ''; 
    const blogImgUrl = blog.imageUrl || ''; 
    const authorName = blog.author.name || 'Bloai';
    
    const subscribers = await db.newsletterSubscription.findMany({
      where: { active: true },
      select: { id: true, email: true }, 
    });

    console.log(`Found ${subscribers.length} active subscribers.`);

    if (subscribers.length === 0) {
      console.log("No active subscribers to notify.");
      return;
    }
    const factOrKnowLedge = await generateFactAndknowledge(blog.title);

    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || 'https://res.cloudinary.com/dq2z27agv/image/upload/v1745082810/hnckqv393urojneminwo.png';
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bài viết mới từ Bloai: ${blogTitle}</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
              <tr>
                <td>
                  <table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin: 0 auto;">
                    <tr>
                      <td align="center" style="padding: 20px;">
                        <a href="${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">
                          <img src="${logoUrl}" alt="Bloai Logo" width="150" style="display: block; max-width: 150px;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px;">
                        <h1 style="font-size: 24px; margin-bottom: 10px;">Chào bạn,</h1>
                        <p style="font-size: 16px; line-height: 1.6;">
                          Bloai vừa xuất bản một bài viết mới mà bạn có thể quan tâm:
                        </p>
                      </td>
                    </tr>
                     <tr>
                      <td style="padding: 0 20px 20px 20px;">
                        <p style="font-size: 15px; line-height: 1.6; color: #555;">
                            <strong>Bạn có biết:</strong> ${factOrKnowLedge}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="font-size: 20px; margin-bottom: 10px;">${blogTitle}</h2>
                        ${blogImgUrl ? `<a href="${blogUrl}" style="display: block; margin-bottom: 10px;">
                          <img src="${blogImgUrl}" alt="${blogTitle}" width="100%" style="max-width: 100%;">
                        </a>` : ''}
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${blogDescription}</p>
                        <p style="font-size: 14px; color: #555;">Tác giả: ${authorName}</p>
                        <a href="${blogUrl}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Đọc ngay!</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 16px; line-height: 1.6;">
                          Chúc bạn có những trải nghiệm thú vị và bổ ích trên Bloai!
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                          Đội ngũ từ Bloai.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 20px; font-size: 12px; color: #777;">
                        <a href="${unsubscribeUrl}" style="color: #777; text-decoration: none;">Hủy đăng ký nhận email</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </body>
          </html>
        `;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'newsletter@bloai.blog', 
          to: subscriber.email,
          subject: `Bài viết mới từ Bloai: ${blogTitle}`,
          html: emailHtml,
        });
        console.log(`Successfully sent notification to ${subscriber.email}`);
      } catch (emailError) {
        console.error(`Failed to send notification to ${subscriber.email}:`, emailError);
      }
    }
    console.log("Finished sending notifications.");
  } catch (error) {
    console.error("Error in sendBlogNotifications function:", error);
  }
}

export async function sendConfirmationEmail({ email }: SendConfirmationEmailParams) {
  try {
    const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || 'https://res.cloudinary.com/dq2z27agv/image/upload/v1745082810/hnckqv393urojneminwo.png';
    const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Xác nhận đăng ký Bloai</title>
          <style type="text/css">
              body {
                  width: 100% !important;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
              }

              img {
                  outline: none;
                  text-decoration: none;
                  border: none;
                  -ms-interpolation-mode: bicubic;
                  max-width: 100%;
                  height: auto;
              }

              a {
                  color: #29ABE2;
                  text-decoration: none;
              }

              a:hover {
                  text-decoration: underline;
              }

              .content-table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                  max-width: 600px !important;
                  margin: 0 auto !important;
              }

              .button {
                  background-color: #29ABE2;
                  color: #ffffff !important;
                  padding: 15px 25px !important;
                  text-decoration: none !important;
                  border-radius: 5px !important;
                  display: inline-block !important;
                  font-weight: bold !important;
              }

              .button:hover {
                  background-color: #1d7ea8 !important;
              }
          </style>
      </head>
      <body bgcolor="#f4f4f4">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                  <td>
                      <table class="content-table" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                              <td align="center" style="padding: 20px 0;">
                                  <a href="${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" target="_blank">
                                      <img src="${logoUrl}" alt="Bloai Logo" width="150" style="display: block;">
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" style="padding: 40px; border-radius: 5px;">
                                  <h1 style="font-size: 24px; margin-bottom: 20px; color: #333333; font-family: Arial, sans-serif;">Chào bạn,</h1>
                                  <p style="font-size: 16px; color: #555555; margin-bottom: 25px; font-family: Arial, sans-serif;">
                                      Cảm ơn bạn đã đăng ký nhận tin từ <a href="${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color:#29ABE2; text-decoration: none;"><strong>Bloai</strong></a>! Chúng tôi rất vui mừng được đồng hành cùng bạn trên hành trình khám phá thế giới AI và công nghệ.
                                  </p>
                                  <p style="font-size: 16px; color: #555555; margin-bottom: 25px; font-family: Arial, sans-serif;">
                                      Từ bây giờ, bạn sẽ nhận được những bản cập nhật mới nhất, những phân tích chuyên sâu và những thông tin hữu ích về AI, Machine Learning, Khoa học dữ liệu và nhiều hơn nữa.
                                  </p>

                                  <p style="font-size: 16px; color: #555555; margin-bottom: 25px; font-family: Arial, sans-serif;">
                                      Mong bạn sẽ có những trải nghiệm tuyệt vời với Bloai!
                                  </p>

                                  <p style="font-size: 16px; color: #555555; font-family: Arial, sans-serif;">
                                      Từ Đội ngũ Bloai
                                  </p>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0; text-align: center;">
                                  <p style="font-size: 12px; color: #777777; font-family: Arial, sans-serif;">
                                      © ${new Date().getFullYear()} Bloai. All rights reserved.
                                      <br/>
                                      <a href="${unsubscribeUrl}" style="color: #777777; text-decoration: underline;">Hủy đăng ký nhận email tại đây</a>
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'newsletter@bloai.blog',
      to: email,
      subject: 'Xác nhận đăng ký nhận tin từ Bloai',
      html: emailHtml,
    });

    console.log(`Successfully sent confirmation email to ${email}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to ${email}:`, error);
    throw error;
  }
}