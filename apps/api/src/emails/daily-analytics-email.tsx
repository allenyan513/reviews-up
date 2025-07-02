import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const DailyAnalyticsEmail = (props: {
  userName?: string;
  totalUsers: number;
  totalAccount: number;
  totalForms: number;
  totalShowcase: number;
  totalWorkspace: number;
  totalReview: number;
  totalReviewMedia: number;
  totalCampaign: number;
}) => {
  const {
    userName,
    totalUsers,
    totalAccount,
    totalForms,
    totalShowcase,
    totalWorkspace,
    totalReview,
    totalReviewMedia,
    totalCampaign,
  } = props;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Your daily Reviewsup.io analytics summary is ready.
        </Preview>
        <Container style={container}>
          <Section style={box}>
            <Img
              style={logo}
              src="https://app.reviewsup.io/img/logo-128.png"
              width="49"
              height="49"
              alt="reviewsup.io logo"
            />
            <Text style={paragraph}>
              Hello {userName || 'User'},
            </Text>
            <Text style={paragraph}>
              Here is your daily business analytics summary from Reviewsup.io:
            </Text>
            <table style={table}>
              <tbody>
              <tr>
                <td style={tdLabel}>Total Users</td>
                <td style={tdValue}>{totalUsers}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Accounts</td>
                <td style={tdValue}>{totalAccount}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Forms</td>
                <td style={tdValue}>{totalForms}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Showcases</td>
                <td style={tdValue}>{totalShowcase}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Workspaces</td>
                <td style={tdValue}>{totalWorkspace}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Reviews</td>
                <td style={tdValue}>{totalReview}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Review Media</td>
                <td style={tdValue}>{totalReviewMedia}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Total Campaigns</td>
                <td style={tdValue}>{totalCampaign}</td>
              </tr>
              </tbody>
            </table>
            <Hr style={hr} />
            <Button style={button} href="https://app.reviewsup.io">
              View Dashboard
            </Button>
            <Text style={footer}>
              &copy; {new Date().getFullYear()} Reviewsup.io
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default DailyAnalyticsEmail;

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

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  margin: '16px 0',
};

const tdLabel = {
  color: '#555',
  fontSize: '15px',
  padding: '6px 8px',
  textAlign: 'left' as const,
  background: '#f7f7f7',
};

const tdValue = {
  color: '#222',
  fontWeight: 600,
  fontSize: '15px',
  padding: '6px 8px',
  textAlign: 'right' as const,
  background: '#fff',
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
  marginTop: '16px',
};

const footer = {
  textAlign: 'center' as const,
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '24px',
};
