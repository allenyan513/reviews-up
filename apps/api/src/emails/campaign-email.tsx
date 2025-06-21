import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const data = {
  content: `Hi {{name}},

Your feedback is incredibly important in helping us improve and provide the best possible experience.
Would you kindly take a moment to click the link below and share your thoughts? Your insights mean the world to us!

Thank you so much for your support!

Cheers,<br/>
Allen Yan<br/>
Developer of [ReviewsUp.io](https://reviewsup.io)
`,
  formUrl: 'https://dashboard.stripe.com/login',
  buttonText: 'Leave a testimonial',
};

export const CampaignEmail = (props: {
  content: string
  formUrl: string
  buttonText: string
}) => (
  <Html>
    <Head/>
    <Body style={main}>
      <Preview>
        We would love to hear your feedback. Click the button below to leave a testimonial.
      </Preview>
      <Container style={container}>
        <Section style={box}>
          <Img
            style={logo}
            src={`https://app.reviewsup.io/img/logo-128.png`}
            width="49"
            height="49"
            alt="reviewsup.io logo"
          />
          <Markdown
            markdownCustomStyles={{
              h1: { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' },
              p: paragraph,
            }}
            markdownContainerStyles={{}}
          >{props.content || data.content}</Markdown>

          <Button style={button} href={props.formUrl}>
            {props.buttonText || data.buttonText}
          </Button>
          {/*<PoweredBy/>*/}
          <Text style={footer}>
            Powered by <Link href="https://reviewsup.io" style={anchor}>Reviewsup.io</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CampaignEmail;

const main = {
  padding: '16px',
  color: 'black',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
};

const logo = {
  display: 'block',
  margin: '0 auto',
}

const box = {
  padding: '0 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  cursor: 'pointer',
};

const footer = {
  textAlign: 'center' as const,
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
