# نشر البورتفوليو على Stellar خلف Cloudflare

الحزمة تشغّل Next.js 16 باستخدام Node وPassenger؛ ليست static export. الدومين النهائي الموجود في `src/lib/seo.ts` هو `https://muhammadessam.me`؛ يستخدمه robots وsitemap وcanonical وOpen Graph وJSON-LD. اجعل `SITE_ORIGIN` نفس الأصل تمامًا بدون path. إذا تغيّر الدومين، عدّل هذا المصدر وأعد البناء؛ تغيير runtime وحده لا يغيّر SEO المولّد أثناء البناء.

الحالة في 9 أكتوبر 2026: نُشر التطبيق على Stellar، Node 22.23.3 / Production / startup `app.js`، application root `portfolio-app` خارج public_html. Passenger شغّل standalone فعليًا؛ الموقع وAPI والإدارة تعمل. الباك إند نُشر على Vercel، وفهرس Firestore READY والقواعد منشورة. CI للتحقق فقط. تفاصيل الأدلة والحدود في [تقرير المراجعة](STELLAR-DEPLOYMENT-REVIEW.md).

## المتغيرات

| المتغير | المكان | التوقيت / القيمة |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | shell المحلي قبل التغليف | build-time؛ `https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact`. يُضمّن في JavaScript؛ تغييره على Stellar لا يغير الحزمة |
| `FIREBASE_PROJECT_ID` | cPanel Node.js App Environment variables | runtime؛ `portfolio-e05b2` |
| `FIREBASE_CLIENT_EMAIL` | cPanel | runtime؛ `portfolio-stellar@portfolio-e05b2.iam.gserviceaccount.com` بصلاحية `roles/datastore.user` |
| `FIREBASE_PRIVATE_KEY` | cPanel | runtime؛ PEM كامل بدون علامات اقتباس خارجية |
| `VISITOR_NOTIFICATION_SECRET` | cPanel وVercel backend | runtime؛ نفس السر العشوائي في الطرفين |
| `SITE_ORIGIN` | cPanel | runtime؛ `https://muhammadessam.me`، للتحقق من Origin خلف proxy |
| `NODE_ENV` | cPanel Production mode / startup | runtime؛ `production` |
| `NODE_OPTIONS` | cPanel، اختياري | runtime؛ القيمة المنشورة `--max-old-space-size=256`؛ راقب الاستخدام |
| `HOSTNAME` | ملف `app.js` | runtime؛ يضبطه إلى `0.0.0.0` لتجنب hostname الخاص بالجهاز |
| `PORT` | Passenger / منصة التشغيل | runtime؛ لا تختَر port يدويًا في cPanel ولا تشغّل process إضافيًا |
| `CONTACT_ALLOWED_ORIGIN` | Vercel backend فقط | runtime؛ `https://muhammadessam.me` ثم redeploy |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Vercel backend فقط | runtime؛ أبقِ القيم الحالية؛ لا تحتاجها حزمة Stellar |

إعداد Firebase الخاص بالمتصفح في `src/lib/firebase.ts` موجود في الكود؛ ليس service-account key ولا يحتاج نقله إلى env جديد. لا تضع أسرارًا في `NEXT_PUBLIC_*`.

للمفتاح: أدخل `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` كسطر واحد مع `\n` حرفية، أو ألصق PEM بأسطر حقيقية إذا واجهة cPanel تحفظها. الكود يحول `\n` إلى newline ويترك الأسطر الحقيقية سليمة؛ الاختبارات توقع JWT بالحالتين. حُفظت `\n` الحرفية في cPanel؛ نجاح كتابة الجلسة الحقيقية يثبت عمل المفتاح في runtime. لا تطبع القيمة للتشخيص؛ راجع وجودها وصلاحيات service account فقط.

## 1. Cloudflare والأصل: الإعداد المنشور

- apex A=`162.213.255.30` مع Proxy، وwww CNAME إلى `muhammadessam.me` مع Proxy. أُزيلت سجلات A/AAAA القديمة الخاصة بـGitHub فقط، مع حفظ البريد والتطبيقات الأخرى. لم تتغير nameservers أو registrar. النسخة السابقة: `deploy/dns-before-stellar.txt`.
- شهادة Cloudflare Origin لـapex وwww مثبتة في cPanel، مع **Full (strict)**. تنتهي **9 أكتوبر 2027 الساعة 20:21 UTC** (23:21 القاهرة وفق التوقيت الحالي). الثقة في الأصل اختُبرت بـOrigin CA الرسمي، دون تعطيل التحقق.
- Managed Transform **Add visitor location headers** فعّال. الجلسة الحقيقية سجلت `EG / Cairo / C`؛ تحديد الموقع تقريبي وليس وسيلة صلاحيات.
- Cache rule **Portfolio API and admin bypass** تخص apex/www ومسار يبدأ بـ`/api/` أو `/admin`. لا Cache Everything للـHTML/RSC؛ الأصول static تستخدم immutable والتتبع no-store.
- Redirect rule **Portfolio HTTPS and canonical host** تحول HTTP أو www إلى HTTPS apex بحالة **308** وتحافظ على path وquery string. الشرط: host في apex/www و`(not ssl or http.host eq "www.muhammadessam.me")`. لا توجد قاعدة تحويل عامة لبقية subdomains.

### تجديد الشهادة

ضع تذكيرًا في **25 سبتمبر 2027**؛ لا توجد أداة تقويم متصلة متاحة لهذه المهمة. أصدر Origin certificate جديدة لـapex وwww قبل الانتهاء، واحفظ المفتاح محليًا في مجلد خاص، ثم ثبّت الشهادة والمفتاح في SSL/TLS في cPanel للدومينين فقط. افحص hostname والصلاحية والثقة بمرجع Origin CA ثم HTTPS العام. أبقِ Proxy وFull (strict)، وسجل تاريخ الانتهاء الجديد. لا تنشر المفتاح ولا تضفه إلى ZIP/Git.

### تقييد الوصول المباشر للأصل

لم يُطبّق قيد جديد. Namecheap توثق allowlist عبر `.htaccess`، لكن IP Blocker في cPanel يؤثر في جميع المواقع والخدمات على الحساب، فلا يصلح لعزل هذا التطبيق. يلزم تأكيد الدعم أن شرط الدومين يستخدم IP اتصال Cloudflare الأصلي، لا `REMOTE_ADDR` الذي قد يُعاد إلى IP الزائر بواسطة LiteSpeed/mod_remoteip. بعد هذا التأكيد، يمكن إعداد allowlist داخل document root الخاص بهذا الدومين فقط، مع backup واختبار عبر Cloudflare/الأصل وموافقة المستخدم قبل التطبيق. لا تستخدم firewall على IP المشترك ولا تثق في header يرسله العميل لتحديد السماح.

[Namecheap IP blocking](https://www.namecheap.com/support/knowledgebase/article.aspx/9536/29/how-to-block-ips-from-accessing-your-website/)، [Cloudflare IP ranges](https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/)، [استعادة IP الزائر](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/)، [Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/).

## 2. بناء الحزمة محليًا

استخدم Node 22 (أو 20.9+ إذا كانت متاحة؛ يُفضّل 22)، و`npm ci` مع lockfile. للبناء المطابق للاستضافة يُفضّل Linux x64 بنفس إصدار Node، خصوصًا إذا احتجت native dependencies مستقبلًا. تحسين الصور معطّل حاليًا فلا يُستخدم sharp في الطلبات، لكن حزمة مبنية على macOS ليست ضمانًا لكل native module على Linux.

```bash
npm ci
export NEXT_PUBLIC_CONTACT_ENDPOINT='https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact'
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

في standalone stock، `server.js` يستخدم `parseInt(PORT, 10) || 3000`؛ لذلك socket path وحده لا يعمل كـPORT عادي. `app.js` يضبط HOSTNAME، ويترك port الرقمي كما هو. في Passenger auto-binding يظل اعتراض أول `http.Server.listen` مسؤولًا عن socket حتى لو الرقم 3000؛ لا يتعارض مع تطبيق interviews. خارج Passenger، إذا كان PORT نص socket، يعترض wrapper استدعاء listen ليستخدم المسار بدل الرقم. لا ينشئ HTTP server إضافيًا. الأخطاء المتزامنة يسجلها wrapper باسم/code فقط؛ أخطاء التشغيل غير المتزامنة يسجلها Next ويخرج. هذه التوافقية مختبرة محليًا، ثم ثبت تشغيل `app.js` نفسه على Stellar بتحميل الموقع وAPI وكتابة جلسة وإشعار حقيقيين. لم يُقَس عدد Passenger processes منفردًا.

[Namecheap Node.js App](https://www.namecheap.com/support/knowledgebase/article.aspx/10047/2182/how-to-work-with-nodejs-app/)، [Passenger reverse port binding](https://www.phusionpassenger.com/docs/advanced_guides/in_depth/node/reverse_port_binding.html).

## 4. Vercel backend

`CONTACT_ALLOWED_ORIGIN=https://muhammadessam.me`، وسر الإشعار مطابق لـStellar في Production. نُشر backend وأصبح READY؛ bot/chat الحاليان باقيان. مُعدّل `api/_helpers.js` في المشروع الآخر يصفي المدن الفارغة وUnknown/XX/T1؛ اختبارات visitor/CV country-only الستة نجحت. هذا المجلد ليس Git؛ التفاصيل والبصمات في تقرير المراجعة. لم يتغير كود الباك إند في المتابعة.

فحص OPTIONS للـcontact أعاد 200 و`Access-Control-Allow-Origin: https://muhammadessam.me`، والكود يرسل POST إلى endpoint المبني أعلاه. زرا CV في Hero وContact يستدعيان `incrementCvDownloadCount`، ثم حدث `cv_download` والتخزين وإشعار `/api/cv-download`. لم تُرسل رسالة contact أو يُضغط CV فعليًا؛ يلزم إذن مستقل لأي اختبار يرسل إشعارًا جديدًا.

## 5. التحقق المنفذ

جلسة متصفح واحدة على `/?utm_source=stellar-smoke&ref=smoke` سجلت خمسة أحداث: page_view وثلاثة section_view وengagement بعد إغلاق التبويب. سُجل desktop/Chrome/macOS وEgypt (Cairo)، ومدة 52877ms وعمق 91%. ظهرت source/company/country/timeline في الإدارة. سجل Telegram واحد وتأكيد المستخدم يثبتان وصول إشعار هذه الجلسة مرة واحدة. نُظفت الجلسة الجديدة وأحداثها وسجل التسليم ومساهمتها في العدادات ذريًا بعد حفظ إثبات خاص؛ بقي الزائر السابق وجلسة أقدم بنفس المصدر.

لا تعاود فتح رابط الاختبار للتحقق من النشر؛ الزيارة تكتب analytics وترسل إشعارًا. افحص headers/robots/sitemap والأصول دون تشغيل tracker، وأي جلسة أو تحميل CV أو إرسال contact يحتاج تفويضًا جديدًا. نتائج فحوص no-store وOrigin والتحويلات والملفات والأدلة محفوظة بالتقرير.

## 6. Firestore يأتي أخيرًا

بعد نجاح التتبع والخادم الجديد وbackend وdashboard، ومن هذا repo مع Firebase CLI وحساب صحيح:

```bash
firebase deploy --only firestore:indexes
# Wait in Firebase console until visitor timeline index is ready
firebase deploy --only firestore:rules
```

راجع project المستهدف من `.firebaserc` قبل أي deploy. القواعد تمنع browser writes إلى analytics؛ إذا نشرتها قبل انتقال المستخدمين إلى server tracking تتوقف النسخة القديمة عن تسجيل الزيارات. Service account يستخدم IAM ويتجاوز client rules؛ تعطّل `/api/track` بعد تشديد القواعد ليس مبررًا لإعادة فتح writes للعامة. انتظر جاهزية indexes وتحقق من admin read قبل قواعد الإنتاج.

## الذاكرة وISR

الفحص الفعلي في File Manager: `.next/cache` و`.next/server` وserver/app وserver/pages وserver/route-cache صلاحياتها 755، وملفات صفحات app المعروضة 644. الحزمة تضمنت cache فارغة؛ images تحت cache وroute-cache تحت server أُنشئا بعد الرفع، وهو دليل عملي على الكتابة وقت التشغيل. `portfolio-app/stderr.log` حجمه صفر وقت الفحص، فلا توجد فيه cache write errors. لم يُنفذ `fs.access` تحت UID العملية، أو إعادة توليد صفحات بعد 86400 ثانية؛ صلاحيات الملفات المعروضة وأثر الكتابة لا يثبتان دورة ISR كاملة.

- `cacheMaxMemorySize` صار 10 MiB بدل default 50 MiB. التخزين على القرص وrevalidate=86400 باقيان؛ الضغط على الذاكرة أقل مقابل disk reads إضافية. تحسين الصور معطّل، ولا توجد Firebase Admin SDK أو cache لوثائق الزوار؛ `/api/track` يحتفظ بـOAuth token واحد وبيانات الطلب/وثائق محدودة العمر، مع 4 محاولات conflict وtimeout للشبكة. حد body في الكود 8192 حرف/declared bytes، لكنه يقرأ text قبل التحقق من الطول الحقيقي؛ اطلب حد request-body مناسبًا في Apache/Passenger لأن limit التطبيق وحده لا يمنع تخصيص ذاكرة لطلب كبير مجهول Content-Length.
- توقّع للتخطيط **بضع مئات MiB لكل process**، وليس 10 MiB فقط؛ هذا تقدير لكل process وليس قياسًا منفردًا على Stellar ولا ضمان. `--max-old-space-size=256` يحد V8 old heap فقط؛ RSS يشمل buffers/native/code وغير ذلك. قِس Resource Usage وprocess RSS قبل وبعد ضغط واقعي، واجمعه مع interviews. تأكد من عدد Passenger processes من الدعم؛ التوسع أو إعادة التشغيل قد يضاعف الذاكرة مؤقتًا. ابنِ محليًا؛ لا تعمل production build تحت LVE.
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

المراجع المحلية التي روجعت: Next `output`, `self-hosting`, `environment-variables`, `cacheMaxMemorySize` في `node_modules/next/dist/docs/`، وstandalone generator و`start-server` و`file-system-cache` من الإصدار المثبّت. التشغيل الفعلي وgeo والمفتاح والتتبع والإشعار متحققون؛ دورة ISR الكاملة واختبار الحمل لم يُنفذا.

## التحقق المحلي المنفذ

نجح lint وtypecheck و15 اختبارًا والبناء بـwebpack مع قراءة المحتوى الفعلي من Firestore. نجحت الحزمة عبر TCP وUnix socket: الصفحة 200، Origin مختلف 403، DNT 204، no-store على tracking وimmutable على static assets. هذه الطلبات لم تكتب بيانات ولم ترسل notifications. التحقق الفعلي على Stellar وقياس LVE موثقان أيضًا في التقرير؛ هذه الاختبارات المحلية وحدها لا تثبتهما.

## Operations

1. قبل تحديث الموقع احتفظ بـZIP السابقة وإعدادات runtime الخاصة خارج Git. ابنِ محليًا بالأوامر أعلاه؛ تغيير NEXT_PUBLIC_CONTACT_ENDPOINT يحتاج build جديدة.
2. أوقف `portfolio-app` فقط، وارفع ZIP إلى application root واستخرج release كاملة فيه دون مزج build IDs. احتفظ بربط node_modules الخاص بـselector إن وُجد، وبصلاحيات directories 755/files 644 وملكية مستخدم التطبيق، ثم Restart. لا Run NPM Install أو build على Stellar.
3. تحقق من HTTPS وأصل static معروف، وراقب `portfolio-app/stderr.log` وcPanel → Resource Usage. Errors العامة تعرض primary domain وقد لا تغطي البورتفوليو. لا تعرض قيم env عند نسخ logs للمراجعة.
4. للرجوع: أوقف التطبيق وحده، استعد ZIP السابقة كاملة وإعداداتها وRestart؛ لا تمسح بيانات Firestore. rollback عبر DNS يحتاج النسخة `deploy/dns-before-stellar.txt` وخطة توافق rules؛ شهادة Origin غير موثوقة للمتصفح عند تعطيل Proxy.
5. snapshot الحساب بعد الزيارة والإدارة: PMEM **164.65M/1G** مقابل **159.75M/1G** سابقًا، NPROC **26/200** مقابل **24/200**، Entry Processes **2/20** في الحالتين، faults **0**. ليس load test ولا قياس RSS خاصًا بالبورتفوليو.

## Automatic deploy

`.github/workflows/nextjs.yml` يعمل على Pull Requests إلى `main` والفحص اليدوي فقط. `.github/workflows/deploy-stellar.yml` يعمل على push إلى `main` أو تشغيل يدوي: يثبت Node 22، يشغل lint/typecheck/tests، يبني standalone بالحزمة نفسها، يحفظ نسخة release السابقة في `/home/konobbue/portfolio-app-previous.tar.gz`، ثم يرفع فوق جذر التطبيق ويعيد تشغيل Passenger ويفحص الصفحة وrobots وhash manifest من build الجديد. لو لم يتوفر `rsync` على Stellar يستخدم SCP للـZIP ثم `unzip`.

الرفع لا يستخدم `--delete`؛ بذلك لا يحذف ملفات cPanel أو الملفات القديمة. يستثني `node_modules` و`.next/cache` و`tmp` و`stderr.log` و`.htaccess` في طريقي الرفع. تحديث الاعتمادات من `package.json` أو `package-lock.json` يوقف النشر عمدًا؛ يجب تحديث بيئة Node في cPanel بصورة منفصلة ثم إزالة هذا القيد بعد التحقق من symlink والهدف قبل السماح بتغيير modules آليًا. هذا يحافظ على symlink الذي قد ينشئه cPanel ولا يخلط اعتماديات التطبيقات الأخرى.

يقارن workflow بصمة `package-lock.json` بآخر بصمة نُشرت في ملف مخفي خارج جذر الموقع؛ يمنع بذلك تجاوز قيد الاعتمادات في دفعة لاحقة. أول deploy يعتمد على ثبات ملفات الاعتمادات منذ النسخة الحالية، ثم يسجل بصمة البداية بعد نجاح smoke test. إذا حدثت تغييرات dependencies يدويًا، حدّث هذه البصمة بعد مراجعة modules العاملة قبل استئناف النشر.

أضف إلى إعدادات المستودع هذه الأسماء فقط؛ لا تضع قيمها في ملفات Git أو logs:

| نوع الإعداد | الاسم |
| --- | --- |
| Secret | `STELLAR_HOST` |
| Secret | `STELLAR_USER` |
| Secret | `STELLAR_PORT` |
| Secret | `STELLAR_SSH_KEY` |
| Secret | `STELLAR_KNOWN_HOSTS` |
| Variable | `STELLAR_APP_DIR` |
| Variable | `NEXT_PUBLIC_CONTACT_ENDPOINT` |

تحقق من SSH host fingerprint عبر دعم Namecheap قبل اعتماد خرج `ssh-keyscan` في `STELLAR_KNOWN_HOSTS`. cPanel يعرض حاليًا صفحة Manage SSH بلا بصمة host؛ فلا تعتمد Trust-on-first-use. المنفذ الافتراضي لحسابات Namecheap shared هو 21098 وفق [دليل SSH الرسمي](https://www.namecheap.com/support/knowledgebase/article.aspx/1016/89/how-to-access-a-hosting-account-via-ssh/). عند تدوير المفتاح، أنشئ زوجًا جديدًا لهذا الغرض، خزّن الخاص محليًا بصلاحية 600، أضف العام وصرّح به في cPanel، اختبر دخوله وdry-run، ثم حدّث `STELLAR_SSH_KEY` و`STELLAR_KNOWN_HOSTS` في GitHub. بعد نجاح deploy بالمفتاح الجديد، ألغِ تفويض القديم في cPanel واحذف ملفه المحلي. لا تستخدم مفاتيح شخصية أو مفاتيح التطبيقات الأخرى.

للرجوع أعد تشغيل آخر workflow ناجح لإصدار سابق من تبويب Actions، أو أعد أرشيف `portfolio-app-previous.tar.gz` إلى application root ثم المس `tmp/restart.txt`. إذا توقف الموقع، افحص آخر run و`stderr.log` من cPanel، أعد تشغيل `portfolio-app` فقط، ثم استعد الأرشيف السابق وأعد التشغيل. لإيقاف النشر السريع، افتح Actions → Deploy to Stellar → قائمة `…` → Disable workflow؛ الفحص على Pull Requests يبقى فعالًا.

**حالة 10 أكتوبر 2026:** فُعّل SSH في Manage Shell، ويعرض cPanel الخادم `162.213.255.30` والمنفذ `21098`. استُورد المفتاح العام فقط باسم `github-actions-portfolio-deploy` وفُوّض؛ بقي المفتاح الخاص محليًا بصلاحية 600. المفتاح يمنح SSH على مستوى حساب `konobbue`، ولم نثبت تقييدًا بـ`from=` أو forced command. مفتاحا `github-actions-jahez-dev` و`github-actions-konoz-production` بقيا كما هما. أُضيفت أسرار `STELLAR_HOST` و`STELLAR_USER` و`STELLAR_PORT`، ومتغيرا `STELLAR_APP_DIR` و`NEXT_PUBLIC_CONTACT_ENDPOINT` إلى إعدادات المستودع. لم يُضف `STELLAR_SSH_KEY` بعد؛ ظل خاصًا محليًا لأن Chrome لم يقبل النقل الآلي من حافظة النظام، ولم تُرسل قيمة المفتاح. لم يُضف `STELLAR_KNOWN_HOSTS` بانتظار بصمة الخادم الرسمية. يعرض مدير الملفات `portfolio-app/node_modules` كمجلد بصلاحية 755، لكن هدفه لم يُفحص بـ`readlink`. workflow يستثني الاسم ويحافظ عليه إن كان symlink. صفحة cPanel لا تعرض بصمة SSH host؛ لا تعتمد مفاتيح `ssh-keyscan` حتى يؤكد دعم Namecheap البصمة المتوقعة.

**المتبقي قبل أول نشر:** أرسل بصمة ED25519 من دعم Namecheap؛ بعدها فقط نطابق خرج `ssh-keyscan` ونختبر SSH ووجود `rsync` وننفّذ dry-run لقائمة الملفات لمراجعتها قبل الدفع. إذا تعذر إدخال المفتاح عبر Chrome، أضف السر من جهازك بعد تسجيل دخول GitHub CLI بالأمر `gh secret set STELLAR_SSH_KEY < ~/.config/portfolio-stellar/github-actions-portfolio-deploy`؛ لا يطبع الأمر المفتاح. قيمة `NEXT_PUBLIC_CONTACT_ENDPOINT` المضبوطة تطابق بناء الإنتاج الحالي: `https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact`. لا تُرسل جلسة `deploy-check` من CI؛ smoke tests الآلية تستخدم GET فقط ولا تنشئ بيانات analytics أو إشعار Telegram. بعد أول deploy، اتبع الاختبار اليدوي المتفق عليه في تقرير المراجعة مرة واحدة.

أسرار الجهاز في `~/.config/portfolio-stellar` (directory 700/files 600)، و`/tmp/stellar-secrets` حُذف. gcloud OAuth الواسع ما زال فعالًا. لإلغائه بعد انتهاء أعمال الإدارة وبموافقة المستخدم: `gcloud auth revoke muhammad159e@gmail.com`. لم يُنفذ الإلغاء. دور حساب الخدمة المتحقق في المشروع هو datastore.user فقط؛ مفتاح Firebase Admin القديم ما زال موجودًا وغير معطل وفق metadata ولم يُدوّر.
