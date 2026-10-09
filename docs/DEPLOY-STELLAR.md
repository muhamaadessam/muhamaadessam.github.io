# نشر البورتفوليو على Stellar خلف Cloudflare

الحزمة تشغّل Next.js 16 باستخدام Node وPassenger؛ ليست static export. الدومين النهائي الموجود في `src/lib/seo.ts` هو `https://muhammadessam.me`؛ يستخدمه robots وsitemap وcanonical وOpen Graph وJSON-LD. اجعل `SITE_ORIGIN` نفس الأصل تمامًا بدون path. إذا تغيّر الدومين، عدّل هذا المصدر وأعد البناء؛ تغيير runtime وحده لا يغيّر SEO المولّد أثناء البناء.

هذه خطوات يدوية. لم يتم الدخول إلى cPanel أو Cloudflare أو Firebase، ولم يُعدّل أو يُنشر مشروع notification backend. CI يبقى للتحقق فقط، بدون نشر أو credentials.

## المتغيرات

| المتغير | المكان | التوقيت / القيمة |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | shell المحلي قبل التغليف | build-time؛ رابط HTTPS الفعلي لـ`/api/contact` في backend. يُضمّن في JavaScript؛ تغييره على Stellar لا يغير الحزمة |
| `FIREBASE_PROJECT_ID` | cPanel Node.js App Environment variables | runtime؛ مشروع Firestore الحالي |
| `FIREBASE_CLIENT_EMAIL` | cPanel | runtime؛ service account بصلاحية `roles/datastore.user` |
| `FIREBASE_PRIVATE_KEY` | cPanel | runtime؛ PEM كامل بدون علامات اقتباس خارجية |
| `VISITOR_NOTIFICATION_SECRET` | cPanel وVercel backend | runtime؛ نفس السر العشوائي في الطرفين |
| `SITE_ORIGIN` | cPanel | runtime؛ `https://muhammadessam.me`، للتحقق من Origin خلف proxy |
| `NODE_ENV` | cPanel Production mode / startup | runtime؛ `production` |
| `NODE_OPTIONS` | cPanel، اختياري | runtime؛ ابدأ بـ`--max-old-space-size=256` ثم قِس الاستخدام |
| `HOSTNAME` | ملف `app.js` | runtime؛ يضبطه إلى `0.0.0.0` لتجنب hostname الخاص بالجهاز |
| `PORT` | Passenger / منصة التشغيل | runtime؛ لا تختَر port يدويًا في cPanel ولا تشغّل process إضافيًا |
| `CONTACT_ALLOWED_ORIGIN` | Vercel backend فقط | runtime؛ `https://muhammadessam.me` ثم redeploy |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Vercel backend فقط | runtime؛ أبقِ القيم الحالية؛ لا تحتاجها حزمة Stellar |

إعداد Firebase الخاص بالمتصفح في `src/lib/firebase.ts` موجود في الكود؛ ليس service-account key ولا يحتاج نقله إلى env جديد. لا تضع أسرارًا في `NEXT_PUBLIC_*`.

للمفتاح: أدخل `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` كسطر واحد مع `\n` حرفية، أو ألصق PEM بأسطر حقيقية إذا واجهة cPanel تحفظها. الكود يحول `\n` إلى newline ويترك الأسطر الحقيقية سليمة؛ الاختبارات توقع JWT بالحالتين. طريقة حفظ واجهة cPanel نفسها لا يمكن التحقق منها محليًا. لا تطبع القيمة للتشخيص؛ راجع وجودها وصلاحيات service account فقط.

## 1. تجهيز Cloudflare والأصل

- احتفظ بنسخة من DNS وnameservers الحالية، واستورد سجلات البريد MX/TXT قبل التبديل. أضف الدومين إلى Cloudflare وغيّر nameservers عند Namecheap للقيم التي يوفرها Cloudflare.
- وجّه A/AAAA إلى عنوان الاستضافة الصحيح واحذف AAAA قديمًا إن لم تدعمه الاستضافة. فعّل orange-cloud للسجلات الخاصة بالموقع؛ سجلات البريد تبقى DNS-only.
- أضف الدومين في cPanel وثبّت شهادة HTTPS صالحة عليه أولًا، ثم اختر **Full (strict)**. لا تستخدم Flexible لأنه قد يسبب redirect loops. يمكنك تفعيل Always Use HTTPS عند Cloudflare بعد صلاحية شهادة الأصل.
- Rules → Transform Rules / Managed Transforms → **Add visitor location headers**. الكود يقرأ `cf-ipcountry` ثم `cf-ipcity` و`cf-region-code`، ويرجع لـVercel headers عند غيابها. `XX` و`T1` لا يُعاملان كدول/مدن. تحديد الموقع تقريبي وقد تغيب المدينة حتى مع تفعيل التحويل.
- اجعل `/api/*` و`/admin*` bypass cache؛ لا تضف Cache Everything للصفحات وRSC. Next يرسل `no-store` لكل ردود POST tracking وimmutable للأصول `/_next/static`؛ احترم Origin Cache-Control ولا تفرض Edge TTL على API. اترك caching HTML الافتراضي لتجنب خلط HTML وRSC أو إخفاء تحديثات ISR.
- لا توجد redirects خاصة بالـHTTPS في التطبيق. Next يقرأ `x-forwarded-proto`، وCloudflare يمرّر البروتوكول؛ تأكد أن Apache/Passenger لا يستبدله بقيمة HTTP. `SITE_ORIGIN` يجعل تحقق API مستقلًا عن origin الداخلي.
- لا تعتمد على geo headers كوسيلة صلاحيات، ولا تسمح بقواعد أو Worker يحقن بيانات موقع من العميل؛ احمِ الوصول المباشر إلى الأصل إن أمكن عبر الاستضافة.

[Cloudflare Managed Transforms](https://developers.cloudflare.com/rules/transform/managed-transforms/reference/)، [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

## 2. بناء الحزمة محليًا

استخدم Node 22 (أو 20.9+ إذا كانت متاحة؛ يُفضّل 22)، و`npm ci` مع lockfile. للبناء المطابق للاستضافة يُفضّل Linux x64 بنفس إصدار Node، خصوصًا إذا احتجت native dependencies مستقبلًا. تحسين الصور معطّل حاليًا فلا يُستخدم sharp في الطلبات، لكن حزمة مبنية على macOS ليست ضمانًا لكل native module على Linux.

```bash
npm ci
export NEXT_PUBLIC_CONTACT_ENDPOINT='https://YOUR-BACKEND.vercel.app/api/contact'
npm run lint
node --test tests/*.test.mjs
bash scripts/package-stellar.sh
npx tsc --noEmit
unzip -l deploy/portfolio-stellar.zip
```

السكريبت يبني بـ`npm run build -- --webpack`، ثم ينشئ `deploy/stellar/` و`deploy/portfolio-stellar.zip`. يتطلب env مصدّرًا صراحةً؛ وجوده في `.env.local` فقط لا يكفي لفحص السكريبت. لا تكتب أسرارًا في الأمر. يحتفظ بالـstandalone وdependencies المتتبّعة، ويضيف `.next/static` و`public` و`app.js`. يستبعد `.env*` وPEM/KEY وservice-account filenames والمجلدات docs/design-system/functions/tests، ويرفض JSON يحتوي `private_key` وsymlinks قبل نسخها للحزمة. `deploy/` مستثنى من Git وESLint. راجع أي ملفات عامة حساسة وضعتها يدويًا في `public`؛ لا تنشرها.

الحزمة لا تحتاج `npm install` في الاستضافة. تحتوي `.next/cache` فارغة قابلة للكتابة؛ لا ننقل كاش webpack المحلي. صلاحيات الحساب بعد الرفع يجب إعادة فحصها.

## 3. cPanel وPassenger

1. احتفظ بالحزمة السابقة ونسخة إعدادات التطبيق الحالية في مكان خاص. أنشئ application root منفصلًا مثل `portfolio-app` خارج `public_html`؛ لا تستخدم root أو domain الخاص بمشروع interviews.
2. cPanel → **Setup Node.js App**: اختر Node 22 إن توفر (20.9+ بديل)، Application mode **Production**، root الجديد، domain `muhammadessam.me` وURL `/`، startup file **app.js**. أنشئ التطبيق.
3. أوقف تطبيق البورتفوليو فقط أثناء استبدال الملفات. ارفع ZIP بـFile Manager واستخرجه داخل root مباشرةً؛ يجب أن يكون `app.js` و`server.js` و`node_modules` و`.next` في المستوى نفسه. لا تترك archive أو credentials في public_html.
4. بعض إصدارات Node selector تفرض symlink باسم `node_modules` إلى virtualenv. لا تخلط symlink أنشأه selector بمجلد الحزمة بصمت: احتفظ بالمحتوى المتتبّع داخل target الخاص بتطبيق البورتفوليو فقط، أو اطلب من دعم Namecheap تهيئة standalone. لا تضغط Run NPM Install على package.json المتتبّع؛ ذلك قد يحاول تثبيت المشروع كاملًا.
5. أضف runtime env من الجدول. لا تنقل `.env` إلى السيرفر. أعطِ مستخدم التطبيق ملكية وكتابة `.next/cache` **وكل `.next/server`**، بما فيه app/pages ومجلدات route cache، مع صلاحيات directories المعتادة مثل 755 إذا كان المالك هو نفسه. لا تستخدم 777.
6. Restart من الواجهة. لا تشغّل `npm start` أو `node app.js` كعملية أخرى بالتوازي؛ Passenger يدير العملية.

في standalone stock، `server.js` يستخدم `parseInt(PORT, 10) || 3000`؛ لذلك socket path وحده لا يعمل كـPORT عادي. `app.js` يضبط HOSTNAME، ويترك port الرقمي كما هو. في Passenger auto-binding يظل اعتراض أول `http.Server.listen` مسؤولًا عن socket حتى لو الرقم 3000؛ لا يتعارض مع تطبيق interviews. خارج Passenger، إذا كان PORT نص socket، يعترض wrapper استدعاء listen ليستخدم المسار بدل الرقم. لا ينشئ HTTP server إضافيًا. الأخطاء المتزامنة يسجلها wrapper باسم/code فقط؛ أخطاء التشغيل غير المتزامنة يسجلها Next ويخرج. هذه التوافقية مختبرة محليًا وبتحاكي Passenger، وليست اختبارًا على Stellar الحقيقي.

[Namecheap Node.js App](https://www.namecheap.com/support/knowledgebase/article.aspx/10047/2182/how-to-work-with-nodejs-app/)، [Passenger reverse port binding](https://www.phusionpassenger.com/docs/advanced_guides/in_depth/node/reverse_port_binding.html).

## 4. Vercel backend

عدّل يدويًا `CONTACT_ALLOWED_ORIGIN` إلى الأصل الجديد و`VISITOR_NOTIFICATION_SECRET` إلى نفس قيمة Stellar ثم redeploy. إذا كانت notification endpoints تستعمل CORS أو allowlist منفصلًا، راجعه أيضًا. لا تغيّر bot/chat القائمين.

**تنسيق Telegram يحتاج مراجعة في المشروع الآخر قبل اعتماد النشر:** هذا repo يرسل `city: ''` و`region: ''` عند غيابهما، مع country/source، ولا يرسل placeholder باسم Unknown للمدينة. في formatter الخاص بـvisitor وcv-download، صفِّ الأجزاء الغائبة و`Unknown` و`XX` و`T1` ثم join. مثلًا:

```js
const location = [payload.city, payload.region, payload.country]
  .filter(value => value && !['Unknown', 'XX', 'T1'].includes(value))
  .join(', ') || 'Unknown';
```

مع country-only يجب أن تكون النتيجة `EG` (أو اسم الدولة حسب formatter الحالي)، بدون `Unknown, Egypt`. لم تتم مراجعة/تعديل backend لأن نطاق المهمة يمنع الوصول خارجه؛ إذا كان formatter يستخدم `city || 'Unknown'` فهذه خطوة يدوية لازمة. Dashboard يسجّل country-only بدون `/ Unknown`، ويخفي suffix القديم من labels بدون تغيير counters التاريخية.

## 5. Smoke tests بعد النشر

الأوامر التالية للتنفيذ اليدوي على الإنتاج؛ لا تُنفّذ تلقائيًا في هذه المهمة. اختبار الحدث الحقيقي يكتب Firestore ويرسل Telegram؛ استخدمه مرة واحدة فقط بعد ضبط env.

```bash
SITE='https://muhammadessam.me'
curl -fsS -o /dev/null -w '%{http_code}\n' "$SITE/"
curl -fsS "$SITE/robots.txt"
curl -fsS "$SITE/sitemap.xml"
curl -sS -D - -o /dev/null "$SITE/api/track" -X POST \
  -H 'Origin: https://other.example' -H 'Content-Type: application/json' -d '{}'
# Expected: 403 and Cache-Control: no-store
curl -sS -D - -o /dev/null "$SITE/api/track" -X POST \
  -H "Origin: $SITE" -H 'DNT: 1' -H 'Content-Type: application/json' -d '{}'
# Expected: 204 and no-store; this probe intentionally stores nothing
```

اختبار same-origin الحقيقي:

```bash
node <<'NODE' > /tmp/portfolio-track-smoke.json
const { randomUUID } = require('node:crypto');
const pageId = randomUUID();
const source = { utmSource: 'stellar-smoke', utmMedium: '', utmCampaign: '', ref: '', referrer: '' };
console.log(JSON.stringify({ visitorId: randomUUID(), sessionId: randomUUID(), eventId: pageId, pageId, event: 'page_view', target: 'homepage', path: '/', source, firstTouch: source, language: 'en', timezone: 'Africa/Cairo', screen: '1280x720' }));
NODE
curl -sS -D - -o /dev/null "$SITE/api/track" -X POST \
  -H "Origin: $SITE" -H 'Content-Type: application/json' \
  --data-binary @/tmp/portfolio-track-smoke.json
# Expected: 204; inspect Telegram, visitor_sessions and dashboard
rm /tmp/portfolio-track-smoke.json
```

لا ترسل cf-* يدويًا إلى الإنتاج لاختبار الموقع؛ افتح الصفحة من اتصال حقيقي وتحقق من country/city/region إن توفرت، ومصدر `stellar-smoke` في الطلب السابق أو query `?utm_source=stellar-smoke` في المتصفح. قارِن sessionId من ملف الاختبار قبل حذفه بوثيقة `visitor_sessions`. تحقق من وصول Telegram بعد انتهاء الرد (الإرسال يستخدم `after`) ومن admin dashboard بصلاحية admin. افتح Contact وتحقق من endpoint الصحيح وCORS؛ إرسال رسالة حقيقية قرار يدوي.

انسخ رابط JS/CSS حقيقيًا من HTML أو Network:

```bash
curl -sSI "$SITE/_next/static/REPLACE-WITH-REAL-ASSET.js"
# Expected: 200; Cache-Control public, max-age=31536000, immutable
curl -sSIL --max-redirs 5 "$SITE/"
# No HTTPS redirect loop
```

تحقق من canonical وog:image في HTML بأصل `https://muhammadessam.me`. راقب 503/restarts وResource Usage أثناء استخدام الصفحات والإدارة ومشروع interviews معًا.

## 6. Firestore يأتي أخيرًا

بعد نجاح التتبع والخادم الجديد وbackend وdashboard، ومن هذا repo مع Firebase CLI وحساب صحيح:

```bash
firebase deploy --only firestore:indexes
# Wait in Firebase console until visitor timeline index is ready
firebase deploy --only firestore:rules
```

راجع project المستهدف من `.firebaserc` قبل أي deploy. القواعد تمنع browser writes إلى analytics؛ إذا نشرتها قبل انتقال المستخدمين إلى server tracking تتوقف النسخة القديمة عن تسجيل الزيارات. Service account يستخدم IAM ويتجاوز client rules؛ تعطّل `/api/track` بعد تشديد القواعد ليس مبررًا لإعادة فتح writes للعامة. انتظر جاهزية indexes وتحقق من admin read قبل قواعد الإنتاج.

## الذاكرة وISR

- `cacheMaxMemorySize` صار 10 MiB بدل default 50 MiB. التخزين على القرص وrevalidate=86400 باقيان؛ الضغط على الذاكرة أقل مقابل disk reads إضافية. تحسين الصور معطّل، ولا توجد Firebase Admin SDK أو cache لوثائق الزوار؛ `/api/track` يحتفظ بـOAuth token واحد وبيانات الطلب/وثائق محدودة العمر، مع 4 محاولات conflict وtimeout للشبكة. حد body في الكود 8192 حرف/declared bytes، لكنه يقرأ text قبل التحقق من الطول الحقيقي؛ اطلب حد request-body مناسبًا في Apache/Passenger لأن limit التطبيق وحده لا يمنع تخصيص ذاكرة لطلب كبير مجهول Content-Length.
- توقّع للتخطيط **بضع مئات MiB لكل process**، وليس 10 MiB فقط؛ هذا تقدير غير مقاس على Stellar ولا ضمان. `--max-old-space-size=256` يحد V8 old heap فقط؛ RSS يشمل buffers/native/code وغير ذلك. قِس Resource Usage وprocess RSS قبل وبعد ضغط واقعي، واجمعه مع interviews. تأكد من عدد Passenger processes من الدعم؛ التوسع أو إعادة التشغيل قد يضاعف الذاكرة مؤقتًا. ابنِ محليًا؛ لا تعمل production build تحت LVE.
- تجاوز PMEM/CPU/entry processes قد يظهر 503 أو بطء/restarts. V8 heap exhaustion قد يظهر `Reached heap limit`. لا ترفع heap عشوائيًا إذا كان الحساب أصلًا يصطدم بـLVE؛ راجع التطبيقات والprocess count مع الدعم.
- `.next/cache` للـfetch cache، لكن هذه النسخة من Next تكتب ISR page/route artifacts داخل `.next/server/app` و`.next/server/pages` ومجلدات cache تحت server أيضًا. جميعها يجب أن تكون writable، والقرص دائم ويتوفر فيه مساحة. عدم الكتابة يسبب cache errors وفشل حفظ regeneration، وقد تبقى صفحات قديمة أو يتكرر العمل/يفشل الطلب؛ راجع logs ولا تعتمد على cache ذاكرة لتغطية المشكلة.
- لاختبار ISR الحقيقي انتظر 86400 ثانية بعد توليد الصفحة ثم اطلبها مرتين (أول طلب قد يرى stale ثم يحدث التحديث في الخلفية)، وتأكد من ظهور تعديل محتوى آمن معروف ومن عدم وجود cache write errors. لا تقلّل TTL في الإنتاج لمجرد الاختبار، ولا تمسح `.next/server` لأنه يحتوي output اللازم للتشغيل.

## التراجع

| المرحلة | التراجع |
| --- | --- |
| Cloudflare/DNS | استعد السجلات/المسار السابق حسب النسخة المحفوظة وانتظر propagation. DNS-only ممكن للتشخيص مع شهادة origin صالحة؛ لا تستخدم Flexible كحل |
| الحزمة/cPanel | أوقف البورتفوليو فقط، استعد release كاملة سابقة وenv وstartup file السابق ثم restart. استبدل الملفات كاملة بدل مزج builds؛ احتفظ بـnode_modules virtualenv configuration |
| Vercel | استعد env السابقة وredeploy أو promote deployment السابقة بعد التأكد من origin والسر المطابقين. لا تكشف السر في logs |
| Firestore indexes | اترك index الإضافي ما لم يسبب مشكلة؛ حذف index مطلوب يكسر timeline |
| Firestore rules | استعد نسخة rules موثوقة متوافقة مع release المقصودة ثم deploy فقط عند الحاجة؛ لا تفتح browser writes للعامة تلقائيًا. rollback لنسخة browser tracking القديمة يحتاج خطة قواعد مؤقتة مدروسة قبل تبديل الموقع |

## تشخيص سريع

| العَرَض | الفحص |
| --- | --- |
| 503 / restarts | cPanel logs وResource Usage؛ heap/LVE/process counts والتطبيق الآخر. لا تشغيل يدوي موازي |
| خطأ port / spawn timeout | startup=`app.js` و`server.js` بجواره، HOSTNAME صحيح، Passenger hook موجود؛ لا PORT يدوي/socket بديل بلا سبب. اطلب نسخة Passenger/config من الدعم |
| المدينة غائبة | orange-cloud وManaged Transform؛ توفر البلد وحده طبيعي. لا تعرض Unknown مع البلد في formatter |
| 403 tracking | `SITE_ORIGIN` مطابق Origin بـHTTPS وبدون slash/path أو www مختلف؛ تحقق من Sec-Fetch-Site ومن domain المختار |
| 503 tracking فقط | service-account PEM/newlines وIAM والمشروع والسر وOAuth/Firestore outbound HTTPS. الخطأ العام لا يطبع مفاتيح |
| Telegram لا يصل | backend redeploy/secret/endpoint وlogs؛ تخزين tracking قد ينجح رغم فشل notification |
| ISR لا يتحدث | كتابة `.next/cache` وكل `.next/server` ومساحة القرص، 24h revalidate، وCloudflare HTML cache overrides |
| الأصول 404 | نسخ `.next/static` وpublic، استخراج ZIP بالمستوى الصحيح وعدم مزج build IDs |

المراجع المحلية التي روجعت: Next `output`, `self-hosting`, `environment-variables`, `cacheMaxMemorySize` في `node_modules/next/dist/docs/`، وstandalone generator و`start-server` و`file-system-cache` من الإصدار المثبّت. قياس Passenger الحقيقي، cloud geo headers، memory/LVE وواجهة PEM والتدفق الإنتاجي الكامل تبقى تحققًا يدويًا.

## التحقق المحلي المنفذ

نجح lint وtypecheck و15 اختبارًا والبناء بـwebpack مع قراءة المحتوى الفعلي من Firestore. نجحت الحزمة عبر TCP وUnix socket: الصفحة 200، Origin مختلف 403، DNT 204، no-store على tracking وimmutable على static assets. هذه الطلبات لم تكتب بيانات ولم ترسل notifications. هذا لا يثبت تشغيل Passenger على Stellar أو قياس LVE في الإنتاج.
