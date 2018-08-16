(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

importScripts('/js/idb.js');
//import idb from 'idb';

var cacheID = 'mws-restaruant-001';

var dbPromise = idb.open('fm-udacity-restaurant', 1, function (upgradeDB) {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', { keyPath: 'id' });
  }
});

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(cacheID).then(function (cache) {
    return cache.addAll(['/', '/index.html', '/restaurant.html', '/css/styles.css',
    /* '/js/dbhelper.js',
     '/js/main.js',
     '/js/restaurant_info.js',*/
    '/js/all.js', '/img/na.png']
    /* '/js/register.js'*/
    ).catch(function (error) {
      console.log('Caches open failed: ' + error);
    });
  }));
});

self.addEventListener('fetch', function (event) {
  var cacheRequest = event.request;
  var cacheUrlObj = new URL(event.request.url);
  if (event.request.url.indexOf('restaurant.html') > -1) {
    var cacheURL = 'restaurant.html';
    cacheRequest = new Request(cacheURL);
  }

  // Requests going to the API get handled separately from those
  // going to other destinations
  var checkURL = new URL(event.request.url);
  if (checkURL.port === '1337') {
    var parts = checkURL.pathname.split('/');
    var id = parts[parts.length - 1] === 'restaurants' ? '-1' : parts[parts.length - 1];
    handleAJAXEvent(event, id);
  } else {
    handleNonAJAXEvent(event, cacheRequest);
  }
});

var handleAJAXEvent = function handleAJAXEvent(event, id) {
  // Check the IndexedDB to see if the JSON for the API
  // has already been stored there. If so, return that.
  // If not, request it from the API, store it, and then
  // return it back.
  event.respondWith(dbPromise.then(function (db) {
    return db.transaction('restaurants').objectStore('restaurants').get(id);
  }).then(function (data) {
    return data && data.data || fetch(event.request).then(function (fetchResponse) {
      return fetchResponse.json();
    }).then(function (json) {
      return dbPromise.then(function (db) {
        var tx = db.transaction('restaurants', 'readwrite');
        tx.objectStore('restaurants').put({
          id: id,
          data: json
        });
        return json;
      });
    });
  }).then(function (finalResponse) {
    return new Response(JSON.stringify(finalResponse));
  }).catch(function (error) {
    return new Response('Error fetching data', { status: 500 });
  }));
};

var handleNonAJAXEvent = function handleNonAJAXEvent(event, cacheRequest) {
  // Check if the HTML request has previously been cached.
  // If so, return the response from the cache. If not,
  // fetch the request, cache it, and then return it.
  event.respondWith(caches.match(cacheRequest).then(function (response) {
    return response || fetch(event.request).then(function (fetchResponse) {
      return caches.open(cacheID).then(function (cache) {
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      });
    }).catch(function (error) {
      if (event.request.url.indexOf('.jpg') > -1) {
        return caches.match('/img/na.png');
      }
      return new Response('Application is not connected to the internet', {
        status: 404,
        statusText: 'Application is not connected to the internet'
      });
    });
  }));
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGNBQWMsWUFBZDtBQUNBOztBQUVBLElBQUksVUFBVSxvQkFBZDs7QUFFQSxJQUFNLFlBQVksSUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsQ0FBbEMsRUFBcUMscUJBQWE7QUFDbEUsVUFBUSxVQUFVLFVBQWxCO0FBQ0UsU0FBSyxDQUFMO0FBQ0UsZ0JBQVUsaUJBQVYsQ0FBNEIsYUFBNUIsRUFBMkMsRUFBRSxTQUFTLElBQVgsRUFBM0M7QUFGSjtBQUlELENBTGlCLENBQWxCOztBQU9BLEtBQUssZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsaUJBQVM7QUFDeEMsUUFBTSxTQUFOLENBQ0UsT0FBTyxJQUFQLENBQVksT0FBWixFQUFxQixJQUFyQixDQUEwQixpQkFBUztBQUNqQyxXQUFPLE1BQ0osTUFESSxDQUNHLENBQ04sR0FETSxFQUVOLGFBRk0sRUFHTixrQkFITSxFQUlOLGlCQUpNO0FBS1A7OztBQUdDLGdCQVJNLEVBU04sYUFUTTtBQVVQO0FBWEksTUFhSixLQWJJLENBYUUsaUJBQVM7QUFDZCxjQUFRLEdBQVIsQ0FBWSx5QkFBeUIsS0FBckM7QUFDRCxLQWZJLENBQVA7QUFnQkQsR0FqQkQsQ0FERjtBQW9CRCxDQXJCRDs7QUF1QkEsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixpQkFBUztBQUN0QyxNQUFJLGVBQWUsTUFBTSxPQUF6QjtBQUNBLE1BQUksY0FBYyxJQUFJLEdBQUosQ0FBUSxNQUFNLE9BQU4sQ0FBYyxHQUF0QixDQUFsQjtBQUNBLE1BQUksTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFrQixPQUFsQixDQUEwQixpQkFBMUIsSUFBK0MsQ0FBQyxDQUFwRCxFQUF1RDtBQUNyRCxRQUFNLFdBQVcsaUJBQWpCO0FBQ0EsbUJBQWUsSUFBSSxPQUFKLENBQVksUUFBWixDQUFmO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLE1BQU0sV0FBVyxJQUFJLEdBQUosQ0FBUSxNQUFNLE9BQU4sQ0FBYyxHQUF0QixDQUFqQjtBQUNBLE1BQUksU0FBUyxJQUFULEtBQWtCLE1BQXRCLEVBQThCO0FBQzVCLFFBQU0sUUFBUSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsQ0FBd0IsR0FBeEIsQ0FBZDtBQUNBLFFBQU0sS0FDSixNQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLE1BQTRCLGFBQTVCLEdBQ0ksSUFESixHQUVJLE1BQU0sTUFBTSxNQUFOLEdBQWUsQ0FBckIsQ0FITjtBQUlBLG9CQUFnQixLQUFoQixFQUF1QixFQUF2QjtBQUNELEdBUEQsTUFPTztBQUNMLHVCQUFtQixLQUFuQixFQUEwQixZQUExQjtBQUNEO0FBQ0YsQ0FyQkQ7O0FBdUJBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsS0FBRCxFQUFRLEVBQVIsRUFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU0sV0FBTixDQUNFLFVBQ0csSUFESCxDQUNRLGNBQU07QUFDVixXQUFPLEdBQ0osV0FESSxDQUNRLGFBRFIsRUFFSixXQUZJLENBRVEsYUFGUixFQUdKLEdBSEksQ0FHQSxFQUhBLENBQVA7QUFJRCxHQU5ILEVBT0csSUFQSCxDQU9RLGdCQUFRO0FBQ1osV0FDRyxRQUFRLEtBQUssSUFBZCxJQUNBLE1BQU0sTUFBTSxPQUFaLEVBQ0csSUFESCxDQUNRO0FBQUEsYUFBaUIsY0FBYyxJQUFkLEVBQWpCO0FBQUEsS0FEUixFQUVHLElBRkgsQ0FFUSxnQkFBUTtBQUNaLGFBQU8sVUFBVSxJQUFWLENBQWUsY0FBTTtBQUMxQixZQUFNLEtBQUssR0FBRyxXQUFILENBQWUsYUFBZixFQUE4QixXQUE5QixDQUFYO0FBQ0EsV0FBRyxXQUFILENBQWUsYUFBZixFQUE4QixHQUE5QixDQUFrQztBQUNoQyxjQUFJLEVBRDRCO0FBRWhDLGdCQUFNO0FBRjBCLFNBQWxDO0FBSUEsZUFBTyxJQUFQO0FBQ0QsT0FQTSxDQUFQO0FBUUQsS0FYSCxDQUZGO0FBZUQsR0F2QkgsRUF3QkcsSUF4QkgsQ0F3QlEseUJBQWlCO0FBQ3JCLFdBQU8sSUFBSSxRQUFKLENBQWEsS0FBSyxTQUFMLENBQWUsYUFBZixDQUFiLENBQVA7QUFDRCxHQTFCSCxFQTJCRyxLQTNCSCxDQTJCUyxpQkFBUztBQUNkLFdBQU8sSUFBSSxRQUFKLENBQWEscUJBQWIsRUFBb0MsRUFBRSxRQUFRLEdBQVYsRUFBcEMsQ0FBUDtBQUNELEdBN0JILENBREY7QUFnQ0QsQ0FyQ0Q7O0FBdUNBLElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLEtBQUQsRUFBUSxZQUFSLEVBQXlCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLFFBQU0sV0FBTixDQUNFLE9BQU8sS0FBUCxDQUFhLFlBQWIsRUFBMkIsSUFBM0IsQ0FBZ0Msb0JBQVk7QUFDMUMsV0FDRSxZQUNBLE1BQU0sTUFBTSxPQUFaLEVBQ0csSUFESCxDQUNRLHlCQUFpQjtBQUNyQixhQUFPLE9BQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsSUFBckIsQ0FBMEIsaUJBQVM7QUFDeEMsY0FBTSxHQUFOLENBQVUsTUFBTSxPQUFoQixFQUF5QixjQUFjLEtBQWQsRUFBekI7QUFDQSxlQUFPLGFBQVA7QUFDRCxPQUhNLENBQVA7QUFJRCxLQU5ILEVBT0csS0FQSCxDQU9TLGlCQUFTO0FBQ2QsVUFBSSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQWtCLE9BQWxCLENBQTBCLE1BQTFCLElBQW9DLENBQUMsQ0FBekMsRUFBNEM7QUFDMUMsZUFBTyxPQUFPLEtBQVAsQ0FBYSxhQUFiLENBQVA7QUFDRDtBQUNELGFBQU8sSUFBSSxRQUFKLENBQ0wsOENBREssRUFFTDtBQUNFLGdCQUFRLEdBRFY7QUFFRSxvQkFBWTtBQUZkLE9BRkssQ0FBUDtBQU9ELEtBbEJILENBRkY7QUFzQkQsR0F2QkQsQ0FERjtBQTBCRCxDQTlCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydFNjcmlwdHMoJy9qcy9pZGIuanMnKTtcbi8vaW1wb3J0IGlkYiBmcm9tICdpZGInO1xuXG52YXIgY2FjaGVJRCA9ICdtd3MtcmVzdGFydWFudC0wMDEnO1xuXG5jb25zdCBkYlByb21pc2UgPSBpZGIub3BlbignZm0tdWRhY2l0eS1yZXN0YXVyYW50JywgMSwgdXBncmFkZURCID0+IHtcbiAgc3dpdGNoICh1cGdyYWRlREIub2xkVmVyc2lvbikge1xuICAgIGNhc2UgMDpcbiAgICAgIHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmVzdGF1cmFudHMnLCB7IGtleVBhdGg6ICdpZCcgfSk7XG4gIH1cbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2luc3RhbGwnLCBldmVudCA9PiB7XG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMub3BlbihjYWNoZUlEKS50aGVuKGNhY2hlID0+IHtcbiAgICAgIHJldHVybiBjYWNoZVxuICAgICAgICAuYWRkQWxsKFtcbiAgICAgICAgICAnLycsXG4gICAgICAgICAgJy9pbmRleC5odG1sJyxcbiAgICAgICAgICAnL3Jlc3RhdXJhbnQuaHRtbCcsXG4gICAgICAgICAgJy9jc3Mvc3R5bGVzLmNzcycsXG4gICAgICAgICAvKiAnL2pzL2RiaGVscGVyLmpzJyxcbiAgICAgICAgICAnL2pzL21haW4uanMnLFxuICAgICAgICAgICcvanMvcmVzdGF1cmFudF9pbmZvLmpzJywqL1xuICAgICAgICAgICcvanMvYWxsLmpzJyxcbiAgICAgICAgICAnL2ltZy9uYS5wbmcnLFxuICAgICAgICAgLyogJy9qcy9yZWdpc3Rlci5qcycqL1xuICAgICAgICBdKVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDYWNoZXMgb3BlbiBmYWlsZWQ6ICcgKyBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIGV2ZW50ID0+IHtcbiAgbGV0IGNhY2hlUmVxdWVzdCA9IGV2ZW50LnJlcXVlc3Q7XG4gIGxldCBjYWNoZVVybE9iaiA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xuICBpZiAoZXZlbnQucmVxdWVzdC51cmwuaW5kZXhPZigncmVzdGF1cmFudC5odG1sJykgPiAtMSkge1xuICAgIGNvbnN0IGNhY2hlVVJMID0gJ3Jlc3RhdXJhbnQuaHRtbCc7XG4gICAgY2FjaGVSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoY2FjaGVVUkwpO1xuICB9XG5cbiAgLy8gUmVxdWVzdHMgZ29pbmcgdG8gdGhlIEFQSSBnZXQgaGFuZGxlZCBzZXBhcmF0ZWx5IGZyb20gdGhvc2VcbiAgLy8gZ29pbmcgdG8gb3RoZXIgZGVzdGluYXRpb25zXG4gIGNvbnN0IGNoZWNrVVJMID0gbmV3IFVSTChldmVudC5yZXF1ZXN0LnVybCk7XG4gIGlmIChjaGVja1VSTC5wb3J0ID09PSAnMTMzNycpIHtcbiAgICBjb25zdCBwYXJ0cyA9IGNoZWNrVVJMLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgaWQgPVxuICAgICAgcGFydHNbcGFydHMubGVuZ3RoIC0gMV0gPT09ICdyZXN0YXVyYW50cydcbiAgICAgICAgPyAnLTEnXG4gICAgICAgIDogcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgaGFuZGxlQUpBWEV2ZW50KGV2ZW50LCBpZCk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlTm9uQUpBWEV2ZW50KGV2ZW50LCBjYWNoZVJlcXVlc3QpO1xuICB9XG59KTtcblxuY29uc3QgaGFuZGxlQUpBWEV2ZW50ID0gKGV2ZW50LCBpZCkgPT4ge1xuICAvLyBDaGVjayB0aGUgSW5kZXhlZERCIHRvIHNlZSBpZiB0aGUgSlNPTiBmb3IgdGhlIEFQSVxuICAvLyBoYXMgYWxyZWFkeSBiZWVuIHN0b3JlZCB0aGVyZS4gSWYgc28sIHJldHVybiB0aGF0LlxuICAvLyBJZiBub3QsIHJlcXVlc3QgaXQgZnJvbSB0aGUgQVBJLCBzdG9yZSBpdCwgYW5kIHRoZW5cbiAgLy8gcmV0dXJuIGl0IGJhY2suXG4gIGV2ZW50LnJlc3BvbmRXaXRoKFxuICAgIGRiUHJvbWlzZVxuICAgICAgLnRoZW4oZGIgPT4ge1xuICAgICAgICByZXR1cm4gZGJcbiAgICAgICAgICAudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJylcbiAgICAgICAgICAub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJylcbiAgICAgICAgICAuZ2V0KGlkKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAoZGF0YSAmJiBkYXRhLmRhdGEpIHx8XG4gICAgICAgICAgZmV0Y2goZXZlbnQucmVxdWVzdClcbiAgICAgICAgICAgIC50aGVuKGZldGNoUmVzcG9uc2UgPT4gZmV0Y2hSZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRiUHJvbWlzZS50aGVuKGRiID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgICAgICB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKS5wdXQoe1xuICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgZGF0YToganNvblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBqc29uO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZmluYWxSZXNwb25zZSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoZmluYWxSZXNwb25zZSkpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoJ0Vycm9yIGZldGNoaW5nIGRhdGEnLCB7IHN0YXR1czogNTAwIH0pO1xuICAgICAgfSlcbiAgKTtcbn07XG5cbmNvbnN0IGhhbmRsZU5vbkFKQVhFdmVudCA9IChldmVudCwgY2FjaGVSZXF1ZXN0KSA9PiB7XG4gIC8vIENoZWNrIGlmIHRoZSBIVE1MIHJlcXVlc3QgaGFzIHByZXZpb3VzbHkgYmVlbiBjYWNoZWQuXG4gIC8vIElmIHNvLCByZXR1cm4gdGhlIHJlc3BvbnNlIGZyb20gdGhlIGNhY2hlLiBJZiBub3QsXG4gIC8vIGZldGNoIHRoZSByZXF1ZXN0LCBjYWNoZSBpdCwgYW5kIHRoZW4gcmV0dXJuIGl0LlxuICBldmVudC5yZXNwb25kV2l0aChcbiAgICBjYWNoZXMubWF0Y2goY2FjaGVSZXF1ZXN0KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHJlc3BvbnNlIHx8XG4gICAgICAgIGZldGNoKGV2ZW50LnJlcXVlc3QpXG4gICAgICAgICAgLnRoZW4oZmV0Y2hSZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVzLm9wZW4oY2FjaGVJRCkudGhlbihjYWNoZSA9PiB7XG4gICAgICAgICAgICAgIGNhY2hlLnB1dChldmVudC5yZXF1ZXN0LCBmZXRjaFJlc3BvbnNlLmNsb25lKCkpO1xuICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hSZXNwb25zZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5yZXF1ZXN0LnVybC5pbmRleE9mKCcuanBnJykgPiAtMSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FjaGVzLm1hdGNoKCcvaW1nL25hLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICAgICAgJ0FwcGxpY2F0aW9uIGlzIG5vdCBjb25uZWN0ZWQgdG8gdGhlIGludGVybmV0JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNDA0LFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6ICdBcHBsaWNhdGlvbiBpcyBub3QgY29ubmVjdGVkIHRvIHRoZSBpbnRlcm5ldCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KVxuICApO1xufTtcbiJdfQ==
