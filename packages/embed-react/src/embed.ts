import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { Widget } from './components/widget';

/**
 * <div id="reviewsup-embed-7980448d249" data-api="http://localhost:3000/api" ></div>
 * <script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js"></script>
 */
const mountPoints = document.querySelectorAll('[id^="reviewsup-embed-"]');
mountPoints.forEach((mountPoint) => {
  const id = mountPoint.id;
  const match = id.match(/^reviewsup-embed-(.+)$/);
  const api = mountPoint.getAttribute('data-api');
  if (match) {
    const widgetId = match[1];
    const root = ReactDOMClient.createRoot(mountPoint);
    root.render(
      React.createElement(Widget, {
        id: widgetId,
        options: {
          url: api,
        },
      }),
    );
  }
});
