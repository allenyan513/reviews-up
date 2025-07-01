// data.ts
export const howItWorksSteps = [
  {
    stepNumber: 1,
    title: 'Create a review collection form',
    description:
      'Customize a form and share it with your customers via link, email, or QR code.',
    imageSrc: '/img/img.png',
  },
  {
    stepNumber: 2,
    title: 'Collect and manage reviews',
    description:
      'Manage all your collected reviews in one place. View, edit, and moderate them easily. Modify review status to public, hidden, or pending.',
    imageSrc: '/img/img_1.png',
  },
  {
    stepNumber: 3,
    title: 'Design your showcase widget',
    description:
      'Choose different layouts, set sorting methods, maximum number of reviews to display, and customize the display style.',
    imageSrc: '/img/img_2.png',
  },
  {
    stepNumber: 4,
    title: 'Embed your showcase widget with one line of code',
    description:
      'Install reviewsup-react package and use the `ReviewsUp` component to embed your showcase widget.',
    codeBlocks: [
      {
        lang: 'bash',
        content: ['npm install reviewsup-react'].join('\n'),
      },
      {
        lang: 'javascript',
        content: [
          'import { ReviewsUp } from "reviewsup-react";',
          '',
          'export default function App() {',
          '  return (',
          '    <ReviewsUp showcaseId="895ef5c94b4" />',
          '  );',
          '}',
        ].join('\n'),
      },
    ],
  },
];
