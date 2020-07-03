import {createHandlerBoundToURL, precacheAndRoute} from 'workbox-precaching';
import {NavigationRoute, registerRoute} from 'workbox-routing';
import * as strategies from 'workbox-strategies';

precacheAndRoute([
  {url: '/', revision: '1'},
  {url: '/index.html', revision: '7'},
  {url: '/standings.html', revision: '2'},
  {url: '/matches.html', revision: '2'},
  {url: '/saved.html', revision: '7'},
  {url: '/manifest.json', revision: '1'},
  {url: '/appbundle.js', revision: '46'},
  {url: '/appbundle.js.map', revision: '3'},
  {url: '/cff684e59ffb052d72cb8d5e49471553.woff2', revision: '1'},
  {url: '/4674f8ded773cb03e824323bfc950537.eot', revision: '1'},
  {url: '/83bebaf37c09c7e1c3ee52682892ae14.woff', revision: '1'},
  {url: '/5e7382c63da0098d634a356ff441614e.ttf', revision: '1'},
  {url: '/css/materialize.min.css', revision: '1'},
  {url: '/images/icons/icon-72x72.png', revision: '1'},
  {url: '/images/icons/icon-96x96.png', revision: '1'},
  {url: '/images/icons/icon-128x128.png', revision: '1'},
  {url: '/images/icons/icon-144x144.png', revision: '1'},
  {url: '/images/icons/icon-152x152.png', revision: '1'},
  {url: '/images/icons/icon-192x192.png', revision: '1'},
  {url: '/images/icons/icon-384x384.png', revision: '1'},
  {url: '/images/icons/icon-512x512.png', revision: '1'},
  {url: '/images/front.jpg', revision: '1'},
  {url: '/images/mega-ball.png', revision: '1'},
  {url: '/js/materialize.min.js', revision: '1'},
  {url: '/pages/links.html', revision: '1'},
  {url: '/pages/home.html', revision: '1'},
]);

const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

registerRoute(
    new RegExp(/\.(woff2|eot|woff|ttf|css|png|jpg|js|map|json|)$/),
    new strategies.CacheFirst({
      cacheName: 'assets',
    }),
);

const matchAPI = ({url, request, event}) => {
  return url.href.indexOf('api.football-data.org/v2') > -1;
};

registerRoute(
    matchAPI,
    new strategies.StaleWhileRevalidate({
      cacheName: 'apicall',
    }),
);

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body: body,
    icon: './images/icons/icon-72x72.png',
    silent: true,
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options),
  );
});

