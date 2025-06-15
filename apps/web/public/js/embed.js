
(function() {
    const domain = 'http://localhost:5510';
    console.log('Embed script running from domain:', domain);
    // window.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('[id^="reviewsup-showcase-"]');

    widgets.forEach((el) => {
      const widgetId = el.id.split('reviewsup-showcase-')[1];

      const iframe = document.createElement('iframe');
      iframe.src = domain + '/showcases/' + widgetId;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      el.appendChild(iframe);
      });
    // });
})();
