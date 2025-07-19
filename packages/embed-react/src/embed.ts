import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { WidgetClient } from './components/widget.client';

/**
 * <div id="reviewsup-embed-7980448d249"></div>
 * <script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js"></script>
 */
const mountPoints = document.querySelectorAll('[id^="reviewsup-embed-"]');
mountPoints.forEach((mountPoint) => {
  const id = mountPoint.id;
  const match = id.match(/^reviewsup-embed-(.+)$/);
  if (match) {
    const widgetId = match[1];
    const root = ReactDOMClient.createRoot(mountPoint);
    root.render(
      React.createElement(WidgetClient, {
        widgetId: widgetId,
      }),
    );
  }
});
