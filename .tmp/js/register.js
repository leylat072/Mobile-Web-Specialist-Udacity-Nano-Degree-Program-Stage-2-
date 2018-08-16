/*Service Worker*/ 
if('serviceWorker' in navigator)
{
  navigator.serviceWorker
  .register('/sw.js')
  .then(reg =>
    {
      console.log('Service worker registration successful: ' + reg.scope);
    })
  .catch(error => {
    console.log('Service worker registration failed: ' + error);
  });
}