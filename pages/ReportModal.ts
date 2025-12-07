import { Page } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class ReportModal {
  constructor(private readonly page: Page) {}

  private log(message: string) {
    console.log(`[ReportModal] ${message}`);
  }

  private async waitForDelay(ms: number = 2000) {
    await this.page.waitForTimeout(ms);
  }

  get reasonSelector() {
    const { role, name } = selectors.reportModal.reasonSelector;
    return this.page.getByRole(role as 'button', { name });
  }

  get fakeNewsOption() {
    const { role, name } = selectors.reportModal.fakeNewsOption;
    return this.page.getByRole(role as 'button', { name });
  }

  get descriptionBox() {
    const { role, name } = selectors.reportModal.descriptionBox;
    return this.page.getByRole(role as 'textbox', { name });
  }

  get submitButton() {
    const { role, name } = selectors.reportModal.submitButton;
    return this.page.getByRole(role as 'button', { name });
  }

  get closeButton() {
    return this.page.locator(selectors.reportModal.closeButton);
  }

  async submitReport(text: string) {
    this.log('Submitting report');
    // Wait for modal to be fully loaded
    await this.waitForDelay(2000);
    
    // Try multiple strategies to find reason selector
    let reasonBtn = null;
    let found = false;
    
    // Strategy 1: Direct button with exact name
    reasonBtn = this.page.getByRole('button', { name: '* دلیل گزارش(اﺟﺒﺎری) انتخاب کنید' });
    if ((await reasonBtn.count()) > 0) {
      try {
        await reasonBtn.waitFor({ state: 'visible', timeout: 5000 });
        await reasonBtn.click({ timeout: 10000 });
        await this.waitForDelay(2000);
        found = true;
        this.log('Reason selector found and clicked (Strategy 1)');
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    if (!found) {
      // Strategy 2: Find by partial text match
      reasonBtn = this.page.locator('button, [role="button"]').filter({ hasText: /دلیل.*گزارش|گزارش.*دلیل/ }).first();
      if ((await reasonBtn.count()) > 0) {
        try {
          await reasonBtn.waitFor({ state: 'visible', timeout: 5000 });
          await reasonBtn.click({ timeout: 10000 });
          await this.waitForDelay(2000);
          found = true;
          this.log('Reason selector found and clicked (Strategy 2)');
        } catch (e) {
          // Continue to next strategy
        }
      }
    }
    
    if (!found) {
      // Strategy 3: Find any dropdown/select button in modal
      reasonBtn = this.page.locator('button, select').filter({ hasText: /انتخاب|دلیل/ }).first();
      if ((await reasonBtn.count()) > 0) {
        try {
          await reasonBtn.waitFor({ state: 'visible', timeout: 5000 });
          await reasonBtn.click({ timeout: 10000 });
          await this.waitForDelay(2000);
          found = true;
          this.log('Reason selector found and clicked (Strategy 3)');
        } catch (e) {
          // Skip if not found
        }
      }
    }
    
    // If reason selector found and clicked, select fake news option
    if (found) {
      this.log('Selecting fake news option');
      // Select "اخبار جعلی" option from dropdown
      let fakeNewsBtn = this.page.getByRole('button', { name: 'اخبار جعلی' });
      if ((await fakeNewsBtn.count()) === 0) {
        fakeNewsBtn = this.page.locator('button, [role="menuitem"]').filter({ hasText: 'اخبار جعلی' }).first();
      }
      if ((await fakeNewsBtn.count()) > 0) {
        try {
          await fakeNewsBtn.waitFor({ state: 'visible', timeout: 5000 });
          await fakeNewsBtn.click({ timeout: 10000 });
          await this.waitForDelay(2000);
        } catch (e) {
          // Continue anyway
        }
      }
    }
    
    // Fill description - try multiple strategies
    this.log(`Filling description: ${text}`);
    let descBox = this.page.getByRole('textbox', { name: '* توضیحات گزارش(اﺟﺒﺎری)' });
    if ((await descBox.count()) === 0) {
      descBox = this.page.locator('textarea, input[type="text"]').filter({ hasText: /توضیحات|گزارش/ }).first();
    }
    if ((await descBox.count()) > 0) {
      try {
        await descBox.waitFor({ state: 'visible', timeout: 5000 });
        await descBox.click({ timeout: 10000 });
        await this.waitForDelay(1000);
        await descBox.fill(text);
        await this.waitForDelay(2000);
      } catch (e) {
        // Continue anyway
      }
    }
    
    // Submit report - try multiple strategies
    this.log('Submitting report');
    let submitBtn = this.page.getByRole('button', { name: 'ارسال گزارش' });
    if ((await submitBtn.count()) === 0) {
      submitBtn = this.page.locator('button').filter({ hasText: /ارسال.*گزارش|گزارش.*ارسال/ }).first();
    }
    if ((await submitBtn.count()) > 0) {
      try {
        await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
        await submitBtn.click({ timeout: 10000 });
        await this.waitForDelay(2000);
        this.log('Report submitted successfully');
      } catch (e) {
        // Continue anyway
      }
    }
  }

  async close() {
    this.log('Closing report modal');
    await this.closeButton.waitFor({ state: 'visible' });
    await this.closeButton.click();
    await this.waitForDelay(2000);
    this.log('Report modal closed');
  }
}
