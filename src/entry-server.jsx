import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

// SSR entry used at build time to prerender each route to static HTML (see prerender.js).
// The live Firebase subscription is client-only, so this renders the app's initial shell.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
