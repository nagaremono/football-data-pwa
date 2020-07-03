/* eslint-disable max-len */
const webPush = require('web-push');

const vapidKeys = {
  'publicKey': 'BFs11SEAEATI0GFf_vKv4MT4qFeolZo6MTWc44qg7MM8_q8gspzHK2n49-zUAg0jUoFQvQ-o-rYBEwcURNAOFTg',
  'privateKey': 'sumZX-UhtVor-Zqmn92n8wG7k4dHz-Rxgm_aNU_KX70',
};

webPush.setVapidDetails(
    'mailto:guruhedipurwanto@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,
);

const pushSubscription = {
  'endpoint': 'https://fcm.googleapis.com/fcm/send/df1mSBakQUE:APA91bF2SJWjpt1QVGVCSpYluTEJs-v56AaCJ5DvtflAXskmuLhJXYN4LH1KgdD7PDFDcaCvQIn_Bcr5p_I5mt9zsRjqtplZx6WpymSAEGjFmAvj0451U_WGWdnKVc__OTshtcpjNkP1',
  'keys': {
    'p256dh': 'BAVpvXQwx5joelbWcul1EJzcWnJ4btXVkX/c2lA0HBKwwXSYg5Dg9E4Hz4o4AYzwIb028H5BENt5efxIg9QmdLY=',
    'auth': 'QYVHrv3TqL5ak2eisc//wA==',
  },
};

const payload = 'Thanks for visiting! Be sure to check out current standings!';

const options = {
  gcmAPIKey: '278550486261',
  TTL: 60,
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options,
);
