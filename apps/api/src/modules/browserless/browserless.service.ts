import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { hash } from '@src/libs/utils';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import axios from 'axios';

@Injectable()
export class BrowserlessService {
  private logger = new Logger('BrowserlessService');
  private endpoint = `${process.env.BROWSERLESS_ENDPOINT}`;
  private extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/gif': 'gif',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
  };

  constructor() {}

  async extract(
    url: string,
    options?: {
      contentEnable?: boolean;
      faviconEnable?: boolean;
      screenshotEnable?: boolean;
    },
  ): Promise<{
    title: string;
    description: string;
    content?: string;
    faviconFilePath?: string;
    screenshotFilePath?: string;
  }> {
    const contentEnable = options.contentEnable || false;
    const faviconEnable = options.faviconEnable || false;
    const screenshotEnable = options.screenshotEnable || false;
    const { page, browser } = await this.openUrl(url);
    // 生成首页截图，转换成 png, jpeg, webp 等格式
    const title = await page.title();
    const content = await page.content();
    const $ = cheerio.load(content);
    const description = $('meta[name="description"]').attr('content') || '';
    const faviconFilePath = faviconEnable
      ? await this.getFaviconFilePath($, url)
      : undefined;
    const screenshotFilePath = screenshotEnable
      ? await this.screenshot(page, url)
      : undefined;

    // 关闭浏览器
    await browser.close();
    return {
      title: title,
      description: description,
      content: contentEnable ? content : undefined,
      faviconFilePath: faviconFilePath,
      screenshotFilePath: screenshotFilePath,
    };
  }

  async openUrl(url: string) {
    if (!url) {
      throw new Error('URL or output path is not provided');
    }
    const browser: puppeteer.Browser = await puppeteer.connect({
      browserWSEndpoint: this.endpoint,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    );
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    return {
      browser: browser,
      page: page,
    };
  }

  async screenshot(page: puppeteer.Page, url: string) {
    try {
      const outputPath = `/tmp/${hash(url)}.png`;
      const screenshot = await page.screenshot({
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 1600,
          height: 900,
        },
      });
      fs.writeFileSync(outputPath, screenshot);
      this.logger.log(`Screenshot saved to ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Error taking screenshot:', error);
      return null;
    }
  }

  async getFaviconFilePath($: CheerioAPI, url: string) {
    const favicon = $('link[rel="icon"]').attr('href') || '';
    if (!favicon) {
      this.logger.error('No favicon found');
      return '';
    }
    const faviconURL = favicon.startsWith('http')
      ? favicon
      : new URL(favicon, url).href;
    this.logger.debug(`favicon: ${favicon} faviconURL: ${faviconURL}`);
    // hashcode the url
    const timestamp = Date.now();
    let faviconOutputPath = `/tmp/${timestamp}-favicon`;
    faviconOutputPath = await this.downloadImage(faviconURL, faviconOutputPath);
    if (!faviconOutputPath || faviconOutputPath === '') {
      this.logger.error('Error downloading favicon');
      return '';
    }
    return faviconOutputPath;
  }

  async downloadImage(url: string, outputPathNoExtension: string) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      const contentType = response.headers['content-type'] as string;
      const extension = this.extMap[contentType.toLowerCase()];
      if (!extension) {
        this.logger.error(
          `No extension found for the image, contentType: ${contentType}`,
        );
        return '';
      }
      const outputPath = `${outputPathNoExtension}.${extension}`;
      const buffer = Buffer.from(response.data, 'binary');
      fs.writeFileSync(outputPath, buffer);
      this.logger.debug('Image downloaded to %s', outputPath);
      return outputPath;
    } catch (error) {
      this.logger.error('Error downloading image:', error);
      return '';
    }
  }
}
