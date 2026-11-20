'use client';

type PixelCommand =
  | ['init', { pixelId: string }]
  | ['measure', 'page_viewed', { type: 'contents' }];

type Pixel = ((...command: PixelCommand) => void) & { q?: IArguments[] };

export function measureOpenAIAdsPageView() {
  try {
    const browser = window as Window & { oaiq?: Pixel };
    if (!browser.oaiq) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';

      const queue: IArguments[] = [];
      const pixel: Pixel = function () {
        queue.push(arguments);
      };
      pixel.q = queue;
      browser.oaiq = pixel;
      pixel('init', { pixelId: '3X1eRD5F14XtudnJ4MLPJe' });
      document.head.appendChild(script);
    }

    browser.oaiq('measure', 'page_viewed', { type: 'contents' });
  } catch {
    // Measurement failures must not interrupt the site.
  }
}
