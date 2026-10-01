/* Cloudflare Web Analytics, skipped on the owners' own browsers.
   Visit any page with ?notrack once on each browser/device to stop counting
   your own visits; ?track turns counting back on for that browser. */
(function () {
  try {
    var q = location.search;
    if (/[?&]notrack(=|&|$)/.test(q)) {
      localStorage.setItem('ywds-notrack', '1');
      alert('Analytics is now off for this browser. Visit with ?track to turn it back on.');
    } else if (/[?&]track(=|&|$)/.test(q)) {
      localStorage.removeItem('ywds-notrack');
      alert('Analytics is back on for this browser.');
    }
    if (localStorage.getItem('ywds-notrack')) return;
  } catch (e) {}
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token": "d754841b02a54cd2a53eca73c463e19e"}');
  document.head.appendChild(s);
})();
