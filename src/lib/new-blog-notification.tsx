import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr } from "@react-email/components";
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#171a1b",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 20px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "40px 0 30px 0",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 20px 0 20px",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

interface NewBlogNotificationProps {
  type: "new" | "update" | "confirmation";
  blogTitle: string;
  blogUrl: string;
  description?: string;
  authorName?: string;
}

export const NewBlogNotification = ({
  type,
  blogTitle,
  blogUrl,
  description,
  authorName, 
}: NewBlogNotificationProps) => {
  const previewText =
    type === "new" ? `New Blog Post: ${blogTitle}` : `Updated Blog Post: ${blogTitle}`;

  const headingText =
    type === "new" ? `New Blog Post: ${blogTitle}` : `Blog Post Updated: ${blogTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={h1}>{headingText}</Text> 
          {authorName && (
            <Text style={text}>By: {authorName}</Text>
          )}
          {description && <Text style={text}>{description}</Text>}
          <Section style={btnContainer}>
            <Button style={button} href={blogUrl}>
              Read Now
            </Button>
          </Section>
          <Hr style={hr} /> 
          <Text style={footer}>
            If you no longer wish to receive these emails, you can unsubscribe.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};