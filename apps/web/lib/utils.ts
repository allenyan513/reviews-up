import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '@/lib/api-client';
import { Tweet } from 'react-tweet/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalDateString(date: Date | string): string {
  const _date = new Date(date);
  // 获取浏览器语言
  const locale =
    typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(_date);
}

export function parseTweet(data: Tweet | undefined | null) {
  if (!data) {
    return;
  }
  const imageUrls = data.photos?.map((photo) => photo.url) || [];
  const videoUrls =
    data.video?.variants
      .map((variant) => {
        if (variant.type === 'video/mp4') {
          return variant.src;
        }
      })
      .filter((url) => url !== undefined && url !== null && url !== '') || [];
  const videoUrl = videoUrls.length > 0 ? videoUrls[0] : '';
  const userUrl = `https://x.com/${data.user.screen_name}`;
  const tweetUrl = `https://x.com/${data.user.screen_name}/status/${data.id_str}`;
  return {
    fullName: data.user.name,
    screen_name: data.user.screen_name,
    message: data.text,
    email: '',
    avatarUrl: data.user.profile_image_url_https,
    imageUrls: imageUrls,
    videoUrl: videoUrl || '',
    tweetId: data.id_str,
    userUrl: userUrl,
    tweetUrl: tweetUrl,
  };
}
