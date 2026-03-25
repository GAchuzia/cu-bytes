import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Custom root document for static web export. ScrollViewStyleReset sets #root { display:flex }
 * but not flex-direction; CSS defaults to row and breaks RN column layouts on GitHub Pages.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
html, body {
  width: 100%;
  margin: 0;
  background-color: #ffffff;
  min-height: 100%;
}
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#root {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column !important;
  align-items: stretch !important;
  min-height: 100vh !important;
  min-height: 100dvh !important;
  background-color: #ffffff;
}
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
