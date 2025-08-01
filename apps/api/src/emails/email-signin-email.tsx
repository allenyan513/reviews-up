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

export const EmailSigninEmail = (props: { url: string }) => {
  const { url } = props;
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Continue your sign-in process by clicking the button below.
        </Preview>
        <Container style={container}>
          <Section style={box}>
            <Img
              style={logo}
              src={`https://reviewsup.io/img/logo-128.png`}
              width="49"
              height="49"
              alt="reviewsup.io logo"
            />
            <Text style={paragraph}>Dear User,</Text>
            <Text style={paragraph}>
              To continue your sign-in process, please click the button below.
            </Text>
            <Button style={button} href={url}>
              Continue Sign-in
            </Button>
            <Text style={footer}>
              {/*Powered by{' '}*/}
              {/*<Link href="https://reviewsup.io" style={anchor}>*/}
              {/*  Reviewsup.io*/}
              {/*</Link>*/}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailSigninEmail;

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
};

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
