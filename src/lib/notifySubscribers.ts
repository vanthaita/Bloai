
import { Resend } from "resend";
import { generateHtmlForEmail } from "@/lib/action";
import type { PrismaClient } from "@prisma/client";
import { env } from "@/env"; 
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

export async function sendBlogNotifications({ db, blogId, type }: SendBlogNotificationsParams) {
  console.log(`Starting sendBlogNotifications for blogId: ${blogId}, type: ${type}`);

  if (type !== "new") {
      console.warn(`Notification type "${type}" is not supported by the AI email generator.`);
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
    const blogDescription = blog.metaDescription || undefined; 
    const blogImgUrl = blog.imageUrl || undefined; 
    const authorName = blog.author.name || 'Bloai'
    const subscribers = await db.newsletterSubscription.findMany({
      where: { active: true },
      select: { id: true, email: true }, 
    });

    console.log(`Found ${subscribers.length} active subscribers.`);

    if (subscribers.length === 0) {
      console.log("No active subscribers to notify.");
      return;
    }

    for (const subscriber of subscribers) {
      try {
        const dataForEmail = {
            type: "new" as const,
            blogTitle: blogTitle,
            blogUrl: blogUrl,
            authorName: authorName,
            description: blogDescription,
            blogImgUrl: blogImgUrl,
            subscriberName: undefined, 
            unsubscribeUrl: `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`,
            blogName: "Bloai", 
            logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || 'https://res.cloudinary.com/dq2z27agv/image/upload/v1745082810/hnckqv393urojneminwo.png',
        };

        const emailHtml = await generateHtmlForEmail(dataForEmail);

        if (!emailHtml) {
             console.warn(`AI failed to generate HTML for email to ${subscriber.email}. Skipping.`);
             continue; 
        }

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || '', 
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