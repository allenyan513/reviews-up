export const defaultUserData = {
  workspace: 'Default Workspace',
  form: 'Default Form',
  showcase: 'Default Showcase',
  reviews: [
    {
      reviewerName: 'Bob Smith',
      reviewerImage: 'https://example.com/default-avatar.png',
      reviewerEmail: 'bob.smith@gmail.com',
      rating: 5,
      text: 'Great product! Exceeded my expectations.',
      status: 'public',
    },
    {
      reviewerName: 'John Doe',
      reviewerImage: 'https://example.com/john-avatar.png',
      reviewerEmail: 'john.doe@gmail.com',
      rating: 4,
      text: 'It works fine, but there\'s room for improvement.',
      status: 'public',
    },
    {
      reviewerName: 'Mary Johnson',
      reviewerImage: 'https://example.com/jane-avatar.png',
      reviewerEmail: 'mary.johnson@gmail.com',
      rating: 3,
      text: 'Delivery was late, but the item was in good condition.',
      status: 'pending',
    },{
      reviewerName: 'Alice Brown',
      reviewerImage: 'https://example.com/alice-avatar.png',
      reviewerEmail: 'alice.brown@gmail.com',
      rating: 2,
      text: 'Not satisfied with the quality. Expected better.',
      status: 'hidden',
    }
  ],
};
