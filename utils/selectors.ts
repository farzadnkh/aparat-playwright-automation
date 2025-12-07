// Common, centralized selectors and role-based locators for Aparat

export const selectors = {
  videoPage: {
    subscribeButton: { role: 'button', name: 'اشتراک', exact: true as const },
    copyLinkButton: { role: 'button', name: 'کپی لینک' },
    threeDotMenu: { role: 'button', name: /^(More|بیشتر|منوی بیشتر)$/i },
    reportButton: { role: 'button', name: 'گزارش تخلف' },
    channelLinkByName: (name: string) => ({ role: 'link', name }),
    // Like button - using CSS selector to find button containing heart icon
    likeButton: 'button:has(svg[class*="heart"], svg[class*="like"]), button:has([class*="heart"]), button[aria-label*="لایک"], button[aria-label*="like"]',
    // Comment button - using CSS selector to find button containing comment icon
    commentButton: 'button:has(svg[class*="comment"]), button:has([class*="comment"]), button[aria-label*="نظر"], button[aria-label*="comment"]',
  },
  reportModal: {
    reasonSelector: {
      role: 'button',
      name: '* دلیل گزارش(اﺟﺒﺎری) انتخاب کنید',
    },
    fakeNewsOption: { role: 'button', name: 'اخبار جعلی' },
    descriptionBox: {
      role: 'textbox',
      name: '* توضیحات گزارش(اﺟﺒﺎری)',
    },
    submitButton: { role: 'button', name: 'ارسال گزارش' },
    closeButton: 'button.modal-close-btn',
  },
  channelPage: {
    videoLinkByTitle: (title: string) => ({ role: 'link', name: title }),
  },
};

