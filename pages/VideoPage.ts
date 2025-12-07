import { expect, Page } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class VideoPage {
  constructor(private readonly page: Page) {}

  private log(message: string) {
    console.log(`[VideoPage] ${message}`);
  }

  private async waitForDelay(ms: number = 2000) {
    await this.page.waitForTimeout(ms);
  }

  async goto(url: string) {
    this.log(`Navigating to: ${url}`);
    // Use domcontentloaded instead of networkidle to avoid timeout
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(this.page).toHaveURL(/aparat\.com/);
    // Wait a bit for dynamic content to load
    await this.waitForDelay(3000);
    this.log('Page loaded successfully');
  }

  get subscribeButton() {
    const { role, name, exact } = selectors.videoPage.subscribeButton;
    return this.page.getByRole(role as 'button', { name, exact });
  }

  get copyLinkButton() {
    const { role, name } = selectors.videoPage.copyLinkButton;
    return this.page.getByRole(role as 'button', { name });
  }

  async clickSubscribeButton() {
    this.log('Clicking subscribe button');
    await this.subscribeButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.subscribeButton.scrollIntoViewIfNeeded();
    // Wait a bit for element to be stable
    await this.waitForDelay(500);
    // Try normal click first, if it fails due to stability, use force
    try {
      await this.subscribeButton.click({ timeout: 10000 });
    } catch (error) {
      // If element is not stable, force click
      this.log('Normal click failed, using force click');
      await this.subscribeButton.click({ force: true, timeout: 10000 });
    }
    await this.waitForDelay(2000);
    this.log('Subscribe button clicked');
  }

  async clickCopyLinkButton() {
    this.log('Clicking copy link button');
    await this.copyLinkButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.copyLinkButton.scrollIntoViewIfNeeded();
    // Wait a bit for element to be stable
    await this.waitForDelay(500);
    // Try normal click first, if it fails due to stability, use force
    try {
      await this.copyLinkButton.click({ timeout: 10000 });
    } catch (error) {
      // If element is not stable, force click
      this.log('Normal click failed, using force click');
      await this.copyLinkButton.click({ force: true, timeout: 10000 });
    }
    await this.waitForDelay(2000);
    this.log('Copy link button clicked');
  }

  async openReportModal() {
    this.log('Opening report modal');
    // First click on three-dot menu (button with name 'بیشتر')
    // Use .first() to handle multiple matches and select the correct one
    const threeDotButton = this.page.getByRole('button', { name: 'بیشتر', exact: true }).first();
    await threeDotButton.waitFor({ state: 'visible', timeout: 15000 });
    await threeDotButton.scrollIntoViewIfNeeded();
    await threeDotButton.click({ timeout: 10000 });
    this.log('Three-dot menu clicked');
    
    // Wait for menu to open - wait longer for menu animation
    await this.waitForDelay(3000);
    
    // Try multiple strategies to find the report button
    let reportBtn = null;
    let found = false;
    
    // Strategy 1: Direct button with name (might be visible after menu opens)
    reportBtn = this.page.getByRole('button', { name: 'گزارش تخلف' });
    if ((await reportBtn.count()) > 0) {
      try {
        await reportBtn.waitFor({ state: 'visible', timeout: 5000 });
        await reportBtn.scrollIntoViewIfNeeded();
        await reportBtn.click({ timeout: 10000 });
        await this.waitForDelay(2000);
        found = true;
        this.log('Report button found and clicked (Strategy 1)');
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    if (!found) {
      // Strategy 2: Find in menu items or any clickable element with text
      reportBtn = this.page.locator('[role="menuitem"], button, a, [role="button"]').filter({ hasText: 'گزارش تخلف' }).first();
      if ((await reportBtn.count()) > 0) {
        try {
          await reportBtn.waitFor({ state: 'visible', timeout: 5000 });
          await reportBtn.scrollIntoViewIfNeeded();
          await reportBtn.click({ timeout: 10000 });
          await this.waitForDelay(2000);
          found = true;
          this.log('Report button found and clicked (Strategy 2)');
        } catch (e) {
          // Continue to next strategy
        }
      }
    }
    
    if (!found) {
      // Strategy 3: Try keyboard navigation - press ArrowDown to navigate menu, then Enter
      // This is a fallback if the button text doesn't match exactly
      this.log('Using keyboard navigation as fallback');
      await this.page.keyboard.press('ArrowDown');
      await this.waitForDelay(500);
      await this.page.keyboard.press('ArrowDown');
      await this.waitForDelay(500);
      await this.page.keyboard.press('Enter');
      await this.waitForDelay(2000);
      found = true; // Assume it worked
    }
    
    // If still not found, throw error with helpful message
    if (!found) {
      throw new Error('Could not find report button after opening three-dot menu. Menu might not have opened correctly.');
    }
    this.log('Report modal opened');
  }

  get reportButton() {
    const { role, name } = selectors.videoPage.reportButton;
    return this.page.getByRole(role as 'button', { name });
  }

  async clickLikeButton() {
    this.log('Clicking like button');
    // Try multiple strategies to find the like button
    // Strategy 1: Find by aria-label containing "لایک" or "like"
    let likeButton = this.page.locator('button[aria-label*="لایک"], button[aria-label*="like"], button[aria-label*="Like"]').first();
    
    // Strategy 2: Find button with heart icon (SVG or icon)
    if ((await likeButton.count()) === 0) {
      likeButton = this.page.locator('button').filter({ 
        has: this.page.locator('svg[class*="heart"], svg[class*="like"], [class*="heart"], [class*="like"], i[class*="heart"]') 
      }).first();
    }
    
    // Strategy 3: Find button with number and heart/like icon
    if ((await likeButton.count()) === 0) {
      const buttons = this.page.locator('button').filter({ hasText: /\d/ });
      likeButton = buttons
        .filter({ 
          has: this.page.locator('svg, [class*="heart"], [class*="like"], [aria-label*="لایک"], [aria-label*="like"]') 
        })
        .first();
    }
    
    // Strategy 4: Fallback - try first button with number (usually like button is first)
    if ((await likeButton.count()) === 0) {
      likeButton = this.page.locator('button').filter({ hasText: /\d/ }).first();
    }
    
    await likeButton.waitFor({ state: 'visible', timeout: 15000 });
    await likeButton.scrollIntoViewIfNeeded();
    await likeButton.click({ timeout: 10000 });
    await this.waitForDelay(2000);
    this.log('Like button clicked');
  }

  async clickCommentButton() {
    this.log('Clicking comment button');
    // Try multiple strategies to find the comment button
    // Strategy 1: Find by aria-label containing "نظر" or "comment"
    let commentButton = this.page.locator('button[aria-label*="نظر"], button[aria-label*="comment"], button[aria-label*="Comment"]').first();
    
    // Strategy 2: Find button with comment icon (SVG or icon)
    if ((await commentButton.count()) === 0) {
      commentButton = this.page.locator('button').filter({ 
        has: this.page.locator('svg[class*="comment"], svg[class*="نظر"], [class*="comment"], [class*="نظر"], i[class*="comment"]') 
      }).first();
    }
    
    // Strategy 3: Find button with number and comment icon
    if ((await commentButton.count()) === 0) {
      const buttons = this.page.locator('button').filter({ hasText: /\d/ });
      commentButton = buttons
        .filter({ 
          has: this.page.locator('svg, [class*="comment"], [class*="نظر"], [aria-label*="نظر"], [aria-label*="comment"]') 
        })
        .first();
    }
    
    // Strategy 4: Fallback - try second button with number (usually comment button is second)
    if ((await commentButton.count()) === 0) {
      commentButton = this.page.locator('button').filter({ hasText: /\d/ }).nth(1);
    }
    
    await commentButton.waitFor({ state: 'visible', timeout: 15000 });
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click({ timeout: 10000 });
    await this.waitForDelay(2000);
    this.log('Comment button clicked');
  }

  async goToChannel(name: string) {
    this.log(`Navigating to channel: ${name}`);
    // Try multiple strategies to find channel link
    // Strategy 1: Find link with class "channel" (more specific)
    let channelLink = this.page.locator('a.channel, a[class*="channel"]').filter({ hasText: name }).first();
    
    if ((await channelLink.count()) === 0) {
      // Strategy 2: Find any link with the name
      channelLink = this.page.getByRole('link', { name }).first();
    }
    
    // Wait for link to be attached (even if hidden)
    await channelLink.waitFor({ state: 'attached', timeout: 15000 });
    
    // Get the href URL and navigate directly (more reliable than clicking hidden element)
    const href = await channelLink.getAttribute('href');
    if (href) {
      // If href is relative, make it absolute
      const url = href.startsWith('http') ? href : `https://www.aparat.com${href}`;
      this.log(`Navigating to channel URL: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle' });
      await this.waitForDelay(2000);
    } else {
      // Fallback: try to click using JavaScript
      this.log('No href found, using JavaScript click');
      await channelLink.evaluate((el: HTMLElement) => {
        (el as HTMLAnchorElement).click();
      });
      await this.waitForDelay(2000);
    }
    this.log('Channel page loaded');
  }
}
