import { test, expect } from '@playwright/test';
import { VideoPage } from '../pages/VideoPage';
import { ChannelPage } from '../pages/ChannelPage';

test.describe('Aparat Full Flow', () => {
  test('User visits channel and opens another video', async ({ page }) => {
    // eslint-disable-next-line no-console
    console.log('Starting Aparat automation test');
    const videoPage = new VideoPage(page);
    const channelPage = new ChannelPage(page);

    // 1) Open video page
    await videoPage.goto('https://www.aparat.com/v/eff2n45');

    // 2) Click like and comment buttons
    await videoPage.clickLikeButton();
    await videoPage.clickCommentButton();

    // 3) Subscribe and copy link
    await videoPage.clickSubscribeButton();
    await videoPage.clickCopyLinkButton();

    // 4) Navigate to channel page
    await videoPage.goToChannel('علی یاسینی Ali Yasini');

    // 5) Open a new music video
    await channelPage.openVideoByTitle('موزیک ویدئو جدید علی یاسینی و پوری به نام نفهمیدم');

    // 6) Assert - wait for video page to load and check for text
    // eslint-disable-next-line no-console
    console.log('Verifying video title is visible');
    await expect(
      page.getByText('موزیک ویدئو جدید علی یاسینی و پوری به نام نفهمیدم'),
    ).toBeVisible({ timeout: 15000 });
    // eslint-disable-next-line no-console
    console.log('Test completed successfully');
  });
});
