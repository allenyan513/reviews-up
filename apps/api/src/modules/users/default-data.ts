import { $Enums } from '@reviewsup/database/generated/client';
import ReviewStatus = $Enums.ReviewStatus;

export const defaultUserData = {
  product: 'Default Product',
  form: 'Default Form',
  widget: 'Default Widget',
  reviews: [
    {
      reviewerName: 'Amanda K.',
      reviewerImage:
        'https://ph-avatars.imgix.net/8133446/a0814d12-6b25-4c82-adf0-257f0ebc28a3.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2',
      reviewerTitle: 'Marketing Manager at Driftly Tech',
      rating: 5,
      text:
        '"Simple, clean, and powerful!"\n' +
        "We switched to ReviewsUp.io after trying a few commercial platforms, and honestly, it's been a game-changer. The UI is intuitive, and setup took less than an hour. Love that it's open-source and customizable for our branding needs.",
      status: ReviewStatus.public,
    },
    {
      reviewerName: 'Leo M.',
      reviewerImage:
        'https://ph-avatars.imgix.net/3446381/b6491608-b428-4948-b07f-4fcda65b1cd3.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2',
      reviewerTitle: 'Founder of TaskPilot',
      rating: 4,
      text:
        '"Great for startups on a budget"\n' +
        'As a small SaaS company, we couldn’t justify the cost of some review tools out there. ReviewsUp.io gave us everything we needed—collecting, managing, and showcasing reviews—all without breaking the bank.',
      status: ReviewStatus.public,
    },
    {
      reviewerName: 'Carla D.',
      reviewerImage:
        'https://ph-avatars.imgix.net/4837062/ff9ab463-59f5-4905-b390-f7c4634677d0.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2',
      reviewerTitle: 'Growth Marketer at Bloomly',
      rating: 5,
      text:
        '"Helped boost our social proof almost instantly"\n' +
        'We added ReviewsUp.io widgets to our landing pages, and within days, bounce rates dropped and conversions improved. The fact that we can import from social media and add tags is a huge plus.',
      status: ReviewStatus.public,
    },
    {
      reviewerName: 'Raj P.',
      reviewerImage:
        'https://ph-avatars.imgix.net/8691210/c44eb371-3beb-4a8e-a058-5c799b8d75cd.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2',
      reviewerTitle: 'Full Stack Engineer at CodeNest',
      rating: 4,
      text:
        '"Flexible and developer-friendly"\n' +
        'I appreciate how easy it is to extend ReviewsUp.io. We integrated it with our existing backend in a couple of hours, and our frontend team had full control over the display.',
      status: ReviewStatus.pending,
    },
    {
      reviewerName: 'Jenna S.',
      reviewerImage:
        'https://ph-avatars.imgix.net/3420727/b006900d-3131-4b27-af77-c7ec4617cd6d.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2',
      reviewerTitle: 'Creative Director at Moonpixel Studio',
      rating: 4,
      text:
        '"One of the best open-source tools we’ve adopted"\n' +
        'I was surprised by how polished this tool is out of the box. We’ve used it to gather client testimonials for our agency portfolio, and clients love how professional it looks.',
      status: ReviewStatus.hidden,
    },
  ],
};
