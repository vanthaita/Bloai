import { Resend } from "resend";
import { render } from "@react-email/components";
import { NewBlogNotification } from "@/lib/new-blog-notification";
import type { PrismaClient } from "@prisma/client"; 

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBlogNotificationsParams {
  db: PrismaClient; 
  blogId: string;
  type: "new" | "update"; 
}

export async function sendBlogNotifications({ db, blogId, type }: SendBlogNotificationsParams) {
  console.log(`Starting sendBlogNotifications for blogId: ${blogId}, type: ${type}`);
  try {
    const blog = await db.blog.findUnique({
      where: { id: blogId },
      select: { title: true, slug: true },
    });

    if (!blog) {
      console.error(`Blog with id ${blogId} not found for notification.`);
      return; 
    }

    const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${blog.slug}`;
    const blogTitle = blog.title;

    const subscribers = await db.newsletterSubscription.findMany({
      where: { active: true },
      select: { email: true },
    });

    console.log(`Found ${subscribers.length} active subscribers.`);

    if (subscribers.length === 0) {
      console.log("No active subscribers to notify.");
      return;
    }

    for (const subscriber of subscribers) {
      try {
        const emailHtml = await render(
          NewBlogNotification({
            type: "new",
            blogTitle: blogTitle,
            blogUrl: blogUrl,
          })
        );

        await resend.emails.send({
          from: "ie204seo@gmail.com",
          to: subscriber.email,
          subject: `Bài viết mới: ${blogTitle}`,
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