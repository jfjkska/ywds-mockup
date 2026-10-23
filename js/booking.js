/* Fired once when a cal.com booking completes on this site (contact page or /book/).
   Sends book_call to Google Analytics and Schedule to the Meta Pixel. */
window.ywdsBooked = function () {
  try {
    if (sessionStorage.getItem('ywds-booked')) { return; }
    sessionStorage.setItem('ywds-booked', '1');
  } catch (e) {}
  if (window.gtag) { gtag('event', 'book_call', { event_category: 'booking', event_label: 'cal.com 20min' }); }
  if (window.fbq) { fbq('track', 'Schedule'); }
};
