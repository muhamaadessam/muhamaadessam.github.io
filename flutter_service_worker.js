'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "ee7ef91905574ab4761b71dd29b59da7",
"version.json": "25d035d8a90afa8391206d83e3cd7ba8",
"index.html": "a683c6a0aeff66ddc0192c3103eb29f5",
"/": "a683c6a0aeff66ddc0192c3103eb29f5",
"main.dart.js": "7ae43bb453c354c6518ac69114c963ee",
"404.html": "1f636ed4fb6c728dd3a1534779b0c680",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"_redirects": "6a02faf7ea2a9584134ffe15779a0e44",
"favicon.png": "300d940a1765e2b16f058e225b2f8be3",
"icons/Icon-192.png": "ddf61ceec60f3d9a073526eb248e4521",
"icons/Icon-maskable-192.png": "ddf61ceec60f3d9a073526eb248e4521",
"icons/Icon-maskable-512.png": "86f51ed0722db70cc48fff5e3c7cca08",
"icons/Icon-512.png": "86f51ed0722db70cc48fff5e3c7cca08",
"manifest.json": "00e7004637b42d705af57f7ddc9fb714",
"assets/AssetManifest.json": "596d70c1490464dfebf1fe4f40e7adc9",
"assets/NOTICES": "50887ef3b1f7d18f791705698ce6b007",
"assets/FontManifest.json": "f2fec6825346de23cb4c7273dd693788",
"assets/AssetManifest.bin.json": "fa8f4b477d2ec2ebb57ff032220703db",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "9ff270ad8fb482d76bc330cabb07b5a5",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/assets/images/chertNodes.png": "9fb4098e694a8e0f31bb1d4a7565da33",
"assets/assets/images/aboutMeImage.png": "9ff03b3ed6e13156b2595fa0f7c482d2",
"assets/assets/images/protectX.png": "fd1420a8b7718cf24ae489ac85c31ea2",
"assets/assets/images/skillsImage.png": "d94f5d55e8e8394c6f113f740a1c3e39",
"assets/assets/images/profileImage.png": "513d234888a815b9bdb82b84d0eed05a",
"assets/assets/images/mudawi.jpg": "04033814666e8ae5dfe617b7ecca6f47",
"assets/assets/images/sportsmanship.jpg": "ba5f5e59efe9ee213f7a1d7834eeba74",
"assets/assets/images/ceoBuffet.jpg": "32d602296bf747c6b8e1e82c48610ae6",
"assets/assets/images/kahoot.png": "99bec9666f3525c1bdcffc6614da9598",
"assets/assets/images/myFunFacts.png": "e94cfb72ef8b3ffbeb7e7c1c46b8fe16",
"assets/assets/images/ceo.jpg": "32108fbfaeab61a39380e7a86cdac969",
"assets/assets/json/projects.json": "72f1985f5e89835c56cbdbf36db7f660",
"assets/assets/json/skills.json": "2de739a725a3331b29ff96c1d7a7c196",
"assets/assets/icons/instagram.png": "e09140821cca8c8c8795ac03b4439767",
"assets/assets/icons/github.png": "a29dc3691124638b000809a7696281d5",
"assets/assets/icons/rectangle.png": "50bd28e5080510a6e527f2716fb99602",
"assets/assets/icons/dots.png": "01c10eb18d33484a95f119fd8b9b1c5c",
"assets/assets/icons/essamLogo.png": "b9224bf2932c92089f738d010c49892d",
"assets/assets/icons/linkedin.png": "dbce0cfd7ae44f852e206c24bb8c4318",
"assets/assets/icons/whatsapp.png": "97aed291fe7172d9370fd7dd5e951056",
"assets/assets/icons/facebook.png": "01710b5fcb0658fc5a81dd19cf2397f6",
"assets/assets/pdfs/Muhammad%2520Essam.pdf": "a1832e22bffdc81d4cc854109c2297bb",
"assets/assets/fonts/FiraCode-Regular.ttf": "6c0e247027e8aafe474e53f07365969d",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
