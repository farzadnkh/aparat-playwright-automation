import { Page } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class ChannelPage {
  constructor(private readonly page: Page) {}

  private log(message: string) {
    console.log(`[ChannelPage] ${message}`);
  }

  private async waitForDelay(ms: number = 2000) {
    await this.page.waitForTimeout(ms);
  }

  async openVideoByTitle(title: string) {
    this.log(`Opening video with title: ${title}`);
    // Wait for page to load
    await this.waitForDelay(2000);
    
    // Try multiple strategies to find video link
    let videoLink = this.page.getByRole('link', { name: title });
    
    // If multiple matches, try to find the first visible one
    if ((await videoLink.count()) > 1) {
      this.log(`Found ${await videoLink.count()} video links, searching for visible one`);
      // Try to find first visible link
      for (let i = 0; i < await videoLink.count(); i++) {
        const link = videoLink.nth(i);
        try {
          await link.waitFor({ state: 'visible', timeout: 2000 });
          videoLink = link;
          this.log(`Using video link at index ${i}`);
          break;
        } catch (e) {
          // Continue to next
        }
      }
    }
    
    // Wait for link and click
    await videoLink.waitFor({ state: 'visible', timeout: 15000 });
    await videoLink.scrollIntoViewIfNeeded();
    await videoLink.click({ timeout: 10000 });
    this.log('Video link clicked');
    
    // Wait for video page to load
    await this.page.waitForLoadState('networkidle');
    await this.waitForDelay(3000);
    this.log('Video page loaded');
  }
}

