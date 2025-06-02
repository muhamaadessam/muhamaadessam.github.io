'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "5553f8116633d74a32e3c7876fd31184",
"version.json": "25d035d8a90afa8391206d83e3cd7ba8",
"index.html": "899307ee30641ae02565a6a296f35fbc",
"/": "899307ee30641ae02565a6a296f35fbc",
"main.dart.js": "01a608d0312e6e1518f9c06b00426dd6",
"404.html": "7aa7e95562b19d44a0571a06cf6fb857",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"_redirects": "6a02faf7ea2a9584134ffe15779a0e44",
"favicon.png": "892c78f79930ea34e3e823249b9da78e",
"icons/Icon-192.png": "3d563e64b9ec60e46784ce2e05e0610c",
"icons/Icon-maskable-192.png": "3d563e64b9ec60e46784ce2e05e0610c",
"icons/Icon-maskable-512.png": "1279e56af9f571ae76f552041fe59371",
"icons/Icon-512.png": "1279e56af9f571ae76f552041fe59371",
"manifest.json": "46075679b3ca51d7452cbcf769ffbb85",
".git/config": "6322ed9696dc38758f8da74ed6f44e6b",
".git/objects/0d/01fca5233d2b143fc926e8eda59f5afe48b133": "36f3a4c3c68ed1bf36bd7a898a997fe3",
".git/objects/0d/0632a99bad071e3860a6be769f0d7650a50f06": "089f9d6adf1a689ca817e1afb3b718fa",
".git/objects/50/c94c684f556ecbf4a1c21b51f2e15a6505d27f": "c397445e604254eb96b65cccbe6a211b",
".git/objects/50/a463356b7d89bc7f17cfe56003eab71b56d8ad": "604dcda5259cee556b0d49cccce957ca",
".git/objects/35/df79d4d6e3cff19e4af0d66bc4c418d482b85b": "eebc4fc9b35d22fd7120656cefcc8c2f",
".git/objects/58/cb62614f03e9e154904eff52b9c4e1201665de": "059bcabcf69c796964f243ae9bd045c3",
".git/objects/0e/1efbd402fc573aa151dfdc1d3fa42f03e25556": "127c8c174fb99ccca6a081f47dc5895d",
".git/objects/5a/c361c3c99873c5a3411820e8b35375c13e72e7": "37d05b4020acf0af9869222e01fc76da",
".git/objects/a4/41011faf58f7ea6e96846259188b2269791a21": "584072f286bae8a9df7e5ed4620b9e38",
".git/objects/a3/2948ca5015e5c8633e81f1afb12481ca3ceb6b": "7895d33a29d65a9b6e4c83ae5bdfb80f",
".git/objects/b2/55abebbcd8dcf302381eeb6cb56fc1dfd689ce": "8f807406260d98c9122d09883ddab208",
".git/objects/bb/83c4cfc2999a51c8ab685361895175c5ed8e05": "d17a84893aba0bf4c609e5e6dc61d3fa",
".git/objects/b3/5cd2b0c8b6b9c4fe26f7041117d5215148d0bd": "754c15af738d91db76437aa9a973d272",
".git/objects/da/31e26b5dfa0ed268e5cc2f12c38c0a016f8e4b": "fc417931f3b3f8b4ca4a94b2dbc9319b",
".git/objects/a2/1f335aa36660b8700e92b039a1773accc334e7": "61b7f99c2f2caa79fd4a9d1849f38d8d",
".git/objects/a2/74cb441de4cbaaf795cda279e49373c59d65aa": "9fbd1b334caa7cc72b7bc383a4d00b8f",
".git/objects/a5/f22d653b7281969ef866a63c5ea90def5c05bf": "d16bb9767a3c9e062be241972068df08",
".git/objects/a5/fa1223da9378811718c2eb66b796d861c8012b": "ec70ee0c8d3125ca35b6554ae4eeb928",
".git/objects/d6/2ecb769d1913a2f739200ba19e85e583bb8bca": "81e8111c973aef8fef52f71adf558a5b",
".git/objects/bc/97230f213efd4f6ceb2d8ac7b5c2b41fc81a5b": "ecedbf5ccf7f63d9d502f6b3147e26d7",
".git/objects/ae/a443fba0c072c93d722f7dde0ad891d34ad085": "8b6dbe59aca9e2308b4c2696596955b5",
".git/objects/f4/741d12d5485e49e01047e7586e259e1cd33555": "9a93bf621051a2fe7357ad2d98405722",
".git/objects/c0/1a76e3e4429c2144b5794fb0e09d074de194d4": "cfe3cdc332f012e204d81af395dd3f83",
".git/objects/f2/04823a42f2d890f945f70d88b8e2d921c6ae26": "6b47f314ffc35cf6a1ced3208ecc857d",
".git/objects/cf/b2fba402d35459c468cbc7e0dd8c8a28f3c422": "1fff053f06e7bf5dbbaaf8cae236b132",
".git/objects/ca/8482c88c44dcfdf9ead9d3726df9574ac9775c": "81cbf504c8b90bc81a07b514349a4ac5",
".git/objects/c6/06caa16378473a4bb9e8807b6f43e69acf30ad": "ed187e1b169337b5fbbce611844136c6",
".git/objects/ec/361605e9e785c47c62dd46a67f9c352731226b": "d1eafaea77b21719d7c450bcf18236d6",
".git/objects/18/abcca8061266cd92016e6d5b081c9d8a495ca4": "6e4c10dfa5ab17f4bd87e89b186a75bd",
".git/objects/27/a297abdda86a3cbc2d04f0036af1e62ae008c7": "51d74211c02d96c368704b99da4022d5",
".git/objects/7c/09d499f23e8c9cfadbd067e09e62b423cd8b4a": "4f5d6ea007527788d254cd3ceeb9b8a8",
".git/objects/1f/45b5bcaac804825befd9117111e700e8fcb782": "7a9d811fd6ce7c7455466153561fb479",
".git/objects/73/7f149c855c9ccd61a5e24ce64783eaf921c709": "1d813736c393435d016c1bfc46a6a3a6",
".git/objects/10/92aa892936bf28a47a10cfc92a9a7a9a71d3ae": "d900a93476400750c83c40d7ca266bc6",
".git/objects/10/6a28c828caf1e4f0f93c2a8fc5e1e204cd3a27": "725bd39abce74bf2217176b503eeb13f",
".git/objects/72/fabda8f0f9ade6a777ab066416420cf6099415": "f37fa24f82b6540521e23beb5957041f",
".git/objects/2f/be135dd079c7f49c655c6f37bba1b7ba8e7e15": "3986856d7a3d97176d738a62950e9a4e",
".git/objects/43/1452296d6c8041396bc830d408fd69a010c251": "e8a784bb2f27eae7744b7e7676536265",
".git/objects/5c/a3c6c189d9baa649772c01f0eb25cd296f86a1": "91629958a656739ccd6e47df679c4ee9",
".git/objects/31/72756a5be8c24dad01c4052bc0438a851d8856": "45026a93978f9934f5b1230c7d87e4be",
".git/objects/31/671db4b8bb48743f3aa272f54d044376f90494": "1514a1e9af7824f1f9568e6b6cb46706",
".git/objects/91/45b3b1e2b4693d0cd3b217f71392097d72bb08": "88bd129cf08b609f6516ba2f1625252c",
".git/objects/62/f315e0674249f1fda08158914ee9a639c0d155": "538c6c6cb1e9c7bc73699217e983d9c5",
".git/objects/96/9124f69edb595b03958ad47d8e4f13619e1bac": "b200b3cd909a1d3183f4ebe84349ca05",
".git/objects/3a/9d34c3739d1d108ffae8f57bc7c74625422a39": "bb9123b2317389d12b814f4b6d90432c",
".git/objects/3a/57209a97f2880b3d5f643c75999a8f777059eb": "2baa05c38871295e9086333af1a4d707",
".git/objects/98/b21cb1f22dd2ba0417983f465c542e3abb1b69": "8d69688f4522ce5dfda43ff213be6569",
".git/objects/6d/5f0fdc7ccbdf7d01fc607eb818f81a0165627e": "2b2403c52cb620129b4bbc62f12abd57",
".git/objects/01/640a6beec106476b2dabbec5c9f162c29ec1c0": "1577f0c90c7bbdf791a0974e67b39c8d",
".git/objects/06/9010b0f288eef75c461fea6f2b35801ecea2de": "11d8da00e3d7580369a5eb659b9ecf58",
".git/objects/39/217f7303f6701991377303da6e6369096a91d1": "82ee2a745d2afd2a09042bd1348f8acc",
".git/objects/39/ac17a015974e83f52fe46fe4212bdc8559c8e4": "42a2c10873c7c71c4c4cb387ec20f833",
".git/objects/97/8a4d89de1d1e20408919ec3f54f9bba275d66f": "dbaa9c6711faa6123b43ef2573bc1457",
".git/objects/63/6931bcaa0ab4c3ff63c22d54be8c048340177b": "8cc9c6021cbd64a862e0e47758619fb7",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/ba/5317db6066f0f7cfe94eec93dc654820ce848c": "9b7629bf1180798cf66df4142eb19a4e",
".git/objects/b1/5ad935a6a00c2433c7fadad53602c1d0324365": "8f96f41fe1f2721c9e97d75caa004410",
".git/objects/b1/afd5429fbe3cc7a88b89f454006eb7b018849a": "e4c2e016668208ba57348269fcb46d7b",
".git/objects/d2/d789f9fbef51fe26cb70d01cbc98e9d910fffa": "e61693076e5d4ca1eb0ab75c7fb59b31",
".git/objects/af/31ef4d98c006d9ada76f407195ad20570cc8e1": "a9d4d1360c77d67b4bb052383a3bdfd9",
".git/objects/c3/e81f822689e3b8c05262eec63e4769e0dea74c": "8c6432dca0ea3fdc0d215dcc05d00a66",
".git/objects/e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391": "c70c34cbeefd40e7c0149b7a0c2c64c2",
".git/objects/f0/f8288a633d45cb5227ca2010c972960ff817ea": "ed7fd3306ce8f1c501cfc7387291e699",
".git/objects/f7/c04683d082487094808c320eb6f95d5f9d8a27": "d78e383a0d3dd627a188e2d7ae04a55e",
".git/objects/e8/77f7c98e520bafa51c6f04ad922cac885f6624": "34308a13998c96a6de5eb11ea22228ee",
".git/objects/ce/4606c795ef8f4cacf9ccff6da098b5bd8ce86f": "4e68637738a4ad51e80cb34444342804",
".git/objects/2c/cdba6d84a8d92f7554051eb069ce069aef974b": "e25d48aae9931580f7a2f76cd51b3f7d",
".git/objects/2d/fcdbe9f2df0332cee24295b9c0a4cdbf2478b7": "b40637ed7a305a7a7296f4f96b139cc1",
".git/objects/83/ca5374d3aadbff22e036beaf167c050498061a": "389a26f2fc70d7038a48bd43f55d0eca",
".git/objects/83/dbfafa05124bbcd2e276ebb2aac41466be53f3": "357361466a08d5c74ec1666a690595ac",
".git/objects/77/8d428f24473cb86a4f84aa6d1d146c53389646": "ca5309884ce474c914369f0fe06d7e4d",
".git/objects/48/5838b89ac76c75535a4871bacc6efd917ad088": "bf86b3132d78ad4c3e54f4a2c398f721",
".git/objects/48/b5d2050bdea1fb3ae6e57947aea6baf739a0d5": "4140e96f45c4895218fbecdc3d7b9051",
".git/objects/24/c8a3476b9f407ae1182d659dc9e4a18ab570a4": "3bfb6e0eff6492f0d3367b8441c3591c",
".git/objects/24/6d41f5cc2a3ea38f10cede7bc72e4f37ed4de3": "6051f51adf4f7d4eefcdb7ee13fa7ca9",
".git/objects/4f/346c3e43f95e778d7cef3cb6ceede9cd2bf1c8": "99981890f1649c8ef95c28d9e5a27d4e",
".git/objects/4f/2526f5c72d9ef806f1c4e8dc52f72ea2570732": "b8a4923b0f102e4217260faf2391e766",
".git/objects/85/6a39233232244ba2497a38bdd13b2f0db12c82": "eef4643a9711cce94f555ae60fecd388",
".git/objects/76/e5ff51fc87ae68e38f329aaf6d92272e01abd2": "06e967954f148fa0288d09f741f487f1",
".git/objects/8b/b3904c37507e2263b3efcbebe6143f2a808872": "031facbb49a784e4fd23ba1fd67448ca",
".git/objects/13/307cdd8ee8059b7936efd2848c95da7fb7cd9c": "d4db23e43e12b3499396e2dd33ebc6d2",
".git/objects/13/b9da4b0d8238526358b0b8ad2667dd622dc5f2": "df1bf4f17af530abaa44de437fcec742",
".git/objects/13/3fe010c0ca042cc50a255bad7aaeaf308396d7": "54d3f430a973f28ffd4a30f5161561b1",
".git/objects/7a/4085f695c62d023ee876fdf268cd91408c817f": "2291bc7e9fd9c8136a2c21eea3711809",
".git/objects/22/51573449c1bc68f4f6ea5b3d8ad97d7107f2d8": "c007842d1f4865b556a5d2c7a6989007",
".git/objects/25/8b3eee70f98b2ece403869d9fe41ff8d32b7e1": "05e38b9242f2ece7b4208c191bc7b258",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "fc785b7423c72a19041bf12c858dce03",
".git/logs/refs/heads/main": "fc785b7423c72a19041bf12c858dce03",
".git/logs/refs/remotes/deploy/main": "09193f03500a3c4c58f897081504b544",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/refs/heads/main": "b8da0fa0d294ee346b08162c33aa173b",
".git/refs/remotes/deploy/main": "b8da0fa0d294ee346b08162c33aa173b",
".git/index": "c3f0a20ff46c212f4082a6f13b8a9898",
".git/COMMIT_EDITMSG": "71196c44e6d76705d88b9a73bfcae484",
"assets/AssetManifest.json": "4eee1ea3686c809a98e90031fdcce18c",
"assets/NOTICES": "4335f4e0625452378c9b0f3029c979d3",
"assets/FontManifest.json": "f2fec6825346de23cb4c7273dd693788",
"assets/AssetManifest.bin.json": "09672beea1e75fbe7e486a075ee2f744",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "0af4e29d3be96dcd0789271f843c9840",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/assets/images/aboutMeImage.png": "f2c53ebee3025919805811d4cf48674a",
"assets/assets/images/myFunFactsImage.png": "afd5d8dc81534387feb2f6f98b7f1246",
"assets/assets/images/skillsImage.png": "680a036a126f36fc36b651ec7a7c9f0d",
"assets/assets/images/profileImage.png": "98a665f69f69564521e1d02458ea8204",
"assets/assets/images/mudawi.jpg": "04033814666e8ae5dfe617b7ecca6f47",
"assets/assets/images/sportsmanship.jpg": "ba5f5e59efe9ee213f7a1d7834eeba74",
"assets/assets/images/ceoBuffet.jpg": "32d602296bf747c6b8e1e82c48610ae6",
"assets/assets/images/myFunFacts.png": "e94cfb72ef8b3ffbeb7e7c1c46b8fe16",
"assets/assets/images/ceo.jpg": "32108fbfaeab61a39380e7a86cdac969",
"assets/assets/logos/essamLogoWithText.png": "ce59f8201ba6ce5052aeba94ece3f3be",
"assets/assets/logos/essamLogo.png": "04b5887a88fc2ffecb6edbd058e6e059",
"assets/assets/json/myFunFacts.json": "cf9bed57b344be2fcd275d6a761b58be",
"assets/assets/json/projects.json": "72f1985f5e89835c56cbdbf36db7f660",
"assets/assets/json/skills.json": "bd5098fdf4cf667b57112ad41c64c705",
"assets/assets/icons/instagram.png": "e09140821cca8c8c8795ac03b4439767",
"assets/assets/icons/github.png": "a29dc3691124638b000809a7696281d5",
"assets/assets/icons/rectangle.png": "50bd28e5080510a6e527f2716fb99602",
"assets/assets/icons/dots.png": "01c10eb18d33484a95f119fd8b9b1c5c",
"assets/assets/icons/linkedin.png": "dbce0cfd7ae44f852e206c24bb8c4318",
"assets/assets/icons/whatsapp.png": "97aed291fe7172d9370fd7dd5e951056",
"assets/assets/icons/facebook.png": "01710b5fcb0658fc5a81dd19cf2397f6",
"assets/assets/icons/rightRectangle.png": "b0cb64cfafa31f910ce463e45e7f8f11",
"assets/assets/pdfs/Muhammad%2520Essam.pdf": "752816eacde7657124439fa98814ccb7",
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
