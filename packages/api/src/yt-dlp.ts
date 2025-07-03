export type YtDlpRequest = {
  url: string;
  format?: string;
  output?: string;
};
export type YtDlpResponse = {
  title: string;
  uploader: string;
  duration: number;
  thumbnail: string;
  video_url: string;
};
