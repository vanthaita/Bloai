import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import { sendConfirmationEmail } from "@/lib/notifySubscribers";

const resend = new Resend(process.env.RESEND_API_KEY);

export const newsletterRouter = createTRPCRouter({
  unsubscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingSubscriber = await ctx.db.newsletterSubscription.findUnique({
          where: { email: input.email },
        });

        if (!existingSubscriber) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email not found in our subscription list",
          });
        }

        if (!existingSubscriber.active) {
          return { success: true, message: "Email was already unsubscribed" };
        }

        await ctx.db.newsletterSubscription.update({
          where: { email: input.email },
          data: {
            active: false,
            unsubscribedAt: new Date(),
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Unsubscription error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unsubscribe from newsletter",
          cause: error,
        });
      }
    }),

  subscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingSubscriber = await ctx.db.newsletterSubscription.findUnique({
          where: { email: input.email },
        });

        if (existingSubscriber) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already subscribed" });
        }

        const subscription = await ctx.db.newsletterSubscription.create({
          data: {
            email: input.email,
            subscribedAt: new Date(),
            active: true,
          },
        });

        try {
          await sendConfirmationEmail({ email: input.email });
          console.log(`Successfully sent confirmation email to ${input.email}`);
        } catch (emailError) {
          console.error(`Failed to send confirmation email to ${input.email}:`, emailError);
          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(input.email)}`;
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'newsletter@bloai.blog',
            to: input.email,
            subject: 'Chào mừng bạn đến với Bloai!',
            text: `Cảm ơn bạn đã đăng ký nhận tin từ Bloai! Chúng tôi sẽ gửi cho bạn những bài viết mới nhất về công nghệ và AI.\n\nĐội ngũ Bloai\n\nHủy đăng ký: ${unsubscribeUrl}`,
          });
          console.log(`Sent fallback text confirmation email to ${input.email}`);
        }

        return { success: true, subscription };
      } catch (error) {
        console.error("Subscription error:", error);
        if (error instanceof TRPCError) throw error;
        if (error instanceof Error) console.error("Error details:", error.message, error.stack);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
          cause: error,
        });
      }
    }),
});
