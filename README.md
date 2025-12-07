# Aparat Video Page Automation (POM + Playwright)

This project implements a complete end-to-end automation scenario for Aparat website using Page Object Model pattern.

## Project Structure

- `pages/`
  - `VideoPage.ts` – Actions and elements for video page
  - `ReportModal.ts` – Report modal (currently not used in main test)
  - `ChannelPage.ts` – Channel page actions
- `utils/`
  - `selectors.ts` – All selectors and role-based locators centralized
- `tests/`
  - `aparat-flow.spec.ts` – Complete test scenario: visit video, interact with buttons, navigate to channel, and open another video
- `playwright.config.ts` – Playwright configuration (browser, timeout, etc.)

## Setup

```bash
# Install dependencies
npm install
npx playwright install
```

## Running Tests

```bash
# Run test with visible browser (recommended)
npm run test:headed

# Run test in headless mode
npm run test

# Run test in debug mode
npm run test:debug

# Run with specific browser (Chromium)
npm run test:chromium:headed

# Run all tests
npm run test:all
```

## Features

- ✅ **Page Object Model (POM)** for separating test logic from UI logic
- ✅ Centralized selectors in `utils/selectors.ts` for easier maintenance
- ✅ Using `getByRole` and Persian text for more stable locators
- ✅ Multiple fallback strategies for finding elements
- ✅ Comprehensive logging for debugging
- ✅ TypeScript with strict mode
- ✅ Clean and maintainable structure
- ✅ Error handling with multiple strategies
- ✅ Support for hidden elements using force click and direct navigation

## Test Flow

1. Navigate to a video page
2. Click like and comment buttons
3. Subscribe and copy link
4. Navigate to channel page
5. Open a new video by title
6. Verify video title is visible

## Best Practices

- Using role-based locators instead of CSS selectors for better stability
- Waiting for element visibility before interaction
- Using `domcontentloaded` for faster page loads (instead of `networkidle`)
- Separating concerns: each Page Object is responsible for its own page
- Centralized selectors for easier UI change management
- Comprehensive logging for debugging
- Multiple fallback strategies for element finding
- Direct URL navigation for hidden elements

## Logging

The project includes comprehensive logging. All major actions are logged with prefixes:
- `[VideoPage]` - Video page actions
- `[ChannelPage]` - Channel page actions
- `[ReportModal]` - Report modal actions

Logs are output to console during test execution.
