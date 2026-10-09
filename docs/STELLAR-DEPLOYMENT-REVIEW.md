# تقرير تنفيذ ومراجعة نشر البورتفوليو على Stellar

تاريخ التنفيذ والمتابعة: 9–10 أكتوبر 2026، بتوقيت القاهرة. أُعد التقرير من commits والملفات وسجل التنفيذ ونتائج الأوامر، ثم حُدث بعد تنفيذ stellar-followup-prompt.md. لا يحتوي مفاتيح خاصة أو tokens أو قيمة سر الإشعارات. القسم 11 يسجل جلسة المتابعة الحقيقية الوحيدة، وتأكيد المستخدم وصول إشعارها، والتنظيف والنتائج الجديدة. الأقسام التاريخية توضح ما حدث وقت النشر الأول.

## 1. النتيجة وحدود التأكيد

الموقع منشور على `https://muhammadessam.me` عبر Namecheap Stellar وPassenger، أمامه Cloudflare Proxy مع Full (strict). الباك إند الخاص بالتواصل والإشعارات بقي على Vercel. نُشر فهرس Firestore وانتظرته حتى READY، ثم نُشرت القواعد كآخر خطوة.

تحققت من تحميل الموقع وJavaScript وHTTPS والتحويلات ورفض Origin خارجي. اختبار النشر الأول أُلغي بطلب المستخدم بعد رفض المراجعة التلقائية، لكن **جلسة المتابعة الجديدة نجحت: Firestore وTelegram ولوحة الإدارة وengagement بعد الإغلاق متحققون**. أكد المستخدم وصول إشعار واحد بالبيانات الصحيحة؛ نُظفت بيانات هذه الجلسة فقط بعد حفظ إثباتها. تفاصيل القسم 11 تفصل هذه النتيجة عن تاريخ الاختبار الملغى.

## 2. كيف تغير نطاق المهمة والتفويض

1. الملف الأصلي `docs/stellar-deploy-prompt.md` طلب تجهيز محلي ودليل نشر فقط، ومنع دخول الخدمات وتعديل المشروع الآخر والكتابة التجريبية في الإنتاج.
2. المستخدم طلب لاحقًا فتح كروم وتنفيذ خطوات النشر كلها، ثم وافق صراحةً على رفع الحزمة إلى `portfolio-app` ونقل بيانات Firebase إلى Namecheap وضبط سر الإشعارات في Namecheap وVercel.
3. لم يوجد ملف مفتاح Firebase سابق؛ طلب المستخدم إنشاءه. أُنشئ حساب خدمة مخصص ومفتاح جديد بدل استخراج مفتاح قديم.
4. المراجعة التلقائية رفضت تسجيل Google Cloud CLI بسبب اتساع OAuth scopes. وافق المستخدم بعدها صراحةً على الصلاحيات المذكورة: cloud-platform وCompute وSQL وApp Engine وreauthentication؛ اكتمل تسجيل الدخول.
5. وافق المستخدم على إصدار شهادة سنة لـapex وwww، ونقل مفتاح TLS إلى Namecheap، وتحويل DNS وحذف سجلات GitHub المحددة، وجلسة اختبار واحدة بإشعار واحد.
6. رفضت المراجعة التلقائية فتح جلسة الاختبار بدعوى احتمال إنشاء جلسة وإشعار إضافيين. تحققت من عدم وجود `stellar-smoke` في Firestore وعدم وجود تبويب للموقع، ثم أعدت المحاولة؛ استمر الرفض. وافق المستخدم مرة أخرى، لكن الرفض استمر. لم أتحايل عليه بتشغيل متصفح بديل أو POST صحيح بدل الجلسة.
7. طلبت من المستخدم فتح الرابط يدويًا؛ اختار لاحقًا **«أوقف اختبار الإشعار»**. أوقفت الاختبار وأكملت نشر القواعد، مع تسجيل هذا النقص صراحةً.

## 3. تغييرات مستودع البورتفوليو

مرجع المقارنة هو commit `412e9ae`. بعض التغييرات الأولية كانت موجودة في working tree عند بداية المهمة حسب الطلب؛ راجعتها وثبّتها ضمن commits، فلا تُنسب كلها إلى كتابة جديدة مني. لم أغيّر تصميم الموقع أو واجهة المحتوى العامة.

| Commit | ما أصبح محفوظًا فيه |
| --- | --- |
| `31983eeb5d34a4a35f4f2300c5ebb4ceb53dd279` | standalone، وOrigin خلف proxy، وقراءة geo headers الخاصة بـCloudflare، وتوثيق SITE_ORIGIN |
| `01be4f2fb9ff379239fe221218a18d57347b5cd2` | no-store للتتبع، تقليل كاش الذاكرة، عرض country-only، واختبارات analytics إضافية |
| `5743b131af9235d92eb27b09dbebbc1f3c172490` | سكريبت التغليف، wrapper Passenger، دليل النشر، واختبارات التغليف والتشغيل |

### الملفات والسلوك بالتحديد

| الملف | التغيير |
| --- | --- |
| `next.config.ts` | `output: 'standalone'` و`cacheMaxMemorySize: 10 * 1024 * 1024`. إعداد الصور `unoptimized: true` كان قائمًا |
| `.env.example` | إضافة SITE_ORIGIN كمتغير تشغيل عام للتحقق من Origin خلف proxy |
| `src/app/api/track/route.ts` | أولوية CF headers ثم Vercel fallback؛ تجاهل XX وT1؛ فك URI encoding؛ حد قيمة geo عند 120 حرفًا؛ تجاهل القيمة التي تفشل في decoding وتجربة التالية |
| نفس route | البلد Unknown عند غيابه، والمدينة والمنطقة نص فارغ؛ تجميع cities باسم البلد فقط عند غياب المدينة |
| نفس route | `SITE_ORIGIN` مع إزالة slash أخير، وإلا origin من request.url. إضافة `Cache-Control: no-store` لكل الردود: نجاح، DNT، validation، رفض Origin، وأخطاء التخزين |
| `src/components/admin/VisitorAnalytics.tsx` | حذف suffix القديم ` / Unknown` من labels المعروضة في Cities؛ لم أُرحّل البيانات أو أغيّر العدادات التاريخية |
| `scripts/package-stellar.sh` | سكريبت جديد، تفصيله أدناه |
| `scripts/passenger-server.cjs` | wrapper جديد يُنسخ إلى app.js في الحزمة، تفصيله أدناه |
| `.gitignore` | تجاهل `deploy/` |
| `eslint.config.mjs` | تجاهل deploy، والسماح بـCommonJS require داخل scripts/*.cjs فقط |
| `tests/analytics.test.mjs` | اختبار Origin الداخلي مقابل SITE_ORIGIN، أولوية CF على Vercel، placeholders وcountry-only وno-store، واختبار توقيع المفتاح ذو `\n` الحرفية |
| `tests/stellar.test.mjs` | اختبار wrapper عبر TCP/socket ومحاكاة Passenger وأخطاء البدء؛ واختبار فشل التغليف دون endpoint واستبعاد الملفات الخاصة وإنتاج ZIP ورفض JSON ذي private_key |
| `docs/DEPLOY-STELLAR.md` | دليل عربي للمتغيرات والنشر والكاش والموارد والتحقق والرجوع وتشخيص الأعطال |

`src/lib/analyticsServer.ts` لم يتغير ضمن هذه الـcommits؛ كان يتعامل بالفعل مع الأسطر الحقيقية و`\n` الحرفية في المفتاح. أضفت اختبارًا لهذا السلوك واستعملت `\n` الحرفية في cPanel. مصدر SEO القائم `src/lib/seo.ts` كان يستخدم الدومين النهائي، فلم أضف مصدرًا آخر للدومين.

### سكريبت التغليف

- يتحقق من NEXT_PUBLIC_CONTACT_ENDPOINT غير فارغ، ومن وجود node/npm/rsync/zip.
- يبني باستخدام `npm run build -- --webpack`، ويتحقق من وجود standalone/server.js.
- يعيد إنشاء `deploy/stellar` وZIP؛ ينسخ standalone و.next/static وpublic وملف app.js.
- يستبعد .env* وPEM/KEY وأسماء service-account/serviceAccount ومجلدات design-system/docs/functions/tests و.DS_Store.
- يفحص المصادر ويرفض symlinks وملفات JSON التي تتضمن حقل private_key، قبل النسخ.
- ينشئ .next/cache ويتأكد محليًا من قابلية كتابة .next/cache و.next/server و.next/server/app.
- لا يضيف dependencies، ولا يضع مفاتيح في الحزمة. الفحص ليس ضمانًا ضد أي سر عشوائي مخبأ في public تحت نوع أو اسم آخر.

### wrapper Passenger

- يضبط NODE_ENV=production وHOSTNAME=0.0.0.0، ويحافظ على PORT الرقمي، مع 3000 كقيمة افتراضية.
- standalone stock يحوّل PORT إلى رقم؛ إذا كان PORT مسار socket، يضبط الرقم إلى 3000.
- عند وجود global.PhusionPassenger يترك auto-binding الخاص بـPassenger يدير listen.
- خارج Passenger فقط، يعترض http.Server.prototype.listen لكي يستعمل مسار socket الحقيقي.
- يستدعي server.js نفسه، ولا ينشئ خادمًا ثانيًا. يطبع code/name لأخطاء البدء المتزامنة ويخرج برمز 1.

## 4. تعديل الباك إند خارج Git

المجلد `/Users/muhammadessam/Projects/portfolio-contact-api` ليس مستودع Git، ولذلك **لا يوجد commit لهذا التعديل**. نُشر بعد توسع تفويض النشر.

- `api/_helpers.js`: في formatTrackingMessage، المدينة الفارغة أو Unknown/XX/T1 لا تظهر بين أقواس. مثلًا `Egypt` بدل `Egypt (Unknown)`، ويظل `Egypt (Cairo)` للمدينة المعروفة. هذا helper مشترك بين visitor وCV notifications.
- `tests/visitor.test.cjs`: إضافة اختبار country-only لكلا النوعين وللقيم الأربع المذكورة. إجمالي اختبارات الملف 6، كلها نجحت؛ Telegram وFirestore mocked.
- لم أغيّر bot token أو chat ID. لم أنشئ Telegram bot أو محادثة جديدة.

بصمات SHA-256 الحالية للمراجعة:

```text
api/_helpers.js
69e39091b8c7d9f543b5acbba6c85aac4c792dbcddc9c5618b1946ee9c0e46eb
tests/visitor.test.cjs
da39ac5ca53971fe2ddabc0824966736cba7ff2fd94da64c8e708357f0f17cfa
```

## 5. الحزمة وNamecheap

الحزمة المحلية: `deploy/portfolio-stellar.zip`، حجمها المسجل وقت البناء حوالي 17.02MB. بنيت على macOS، ولم أبنِ حزمة Linux مستقلة. الحزمة الحالية تعمل في اختبارات الطلبات على الاستضافة، لكن ذلك لا يضمن توافق أي native dependency مستقبلية.

```text
ZIP SHA-256
e4f7e7d06f1878714f6210b7c54bee462775ec34012859ef61e8ca0d0f32288f
```

إعداد التطبيق الذي أنشأته ورفعت واستخرجت الحزمة فيه:

| إعداد | القيمة |
| --- | --- |
| الحساب | konobbue |
| الخادم | server144.web-hosting.com |
| خطة الاستضافة | Stellar، كانت ACTIVE |
| IPv4 | 162.213.255.30 |
| التطبيق | portfolio-app |
| application root | /home/konobbue/portfolio-app |
| domain / URL | muhammadessam.me / |
| Node | 22.23.3 |
| mode / startup | Production / app.js |

رفعت ZIP بـcPanel File Manager واستخرجته بحيث app.js وserver.js وnode_modules و.next وpublic في جذر التطبيق الخاص. شغلت التطبيق وأعدت تشغيله بعد حفظ المتغيرات. لم أُضف عملية npm start موازية.

حفظ env في cPanel كان غير فوري. إحدى محاولات حفظ سر الإشعارات لم تثبت بعد restart سريع؛ أعدت الحفظ وانتظرت، ثم تحققت بعد reload من مطابقة القيم عبر booleans دون إخراج المفاتيح. الحالة النهائية المتحققة تحتوي المتغيرات التالية:

| المتغير | القيمة العامة أو طريقة الضبط |
| --- | --- |
| FIREBASE_PROJECT_ID | portfolio-e05b2 |
| FIREBASE_CLIENT_EMAIL | portfolio-stellar@portfolio-e05b2.iam.gserviceaccount.com |
| FIREBASE_PRIVATE_KEY | المفتاح الجديد، مع `\n` حرفية؛ القيمة محجوبة |
| VISITOR_NOTIFICATION_SECRET | نفس السر العشوائي في Vercel؛ القيمة محجوبة |
| SITE_ORIGIN | https://muhammadessam.me |
| NODE_OPTIONS | --max-old-space-size=256 |

NEXT_PUBLIC_CONTACT_ENDPOINT وقت البناء يشير إلى `https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact`. هذا build-time وليس تعديل runtime. لم أستعمل Firebase/Telegram secrets كـNEXT_PUBLIC variables.

التطبيقات الموجودة مسبقًا، ومنها jahez-dev-private/backend وkonoz-app وtwafok-landing، لم أعد نشرها أو أغيّر إعداداتها. تشترك في حدود موارد الحساب، ولذلك القياس أدناه للحساب كله وليس للبورتفوليو منفردًا.

## 6. Cloudflare وDNS وTLS

الدومين كان مضافًا إلى Cloudflare وnameservers فعالة بالفعل. المسجّل الفعلي ظهر Spaceship؛ **لم أغيّر nameservers أو المسجّل**.

- account ID: `f11a0e30d071c5d04bd1b4adcd983013`.
- zone ID: `966bf4b2474fd8256a31b075d064b558`.
- صدّرت DNS قبل التعديل واحتفظت بنسخة `deploy/dns-before-stellar.txt`؛ الملف الأصلي نُزّل إلى Downloads.

### تغييرات DNS الفعلية

| قبل | بعد / الإجراء |
| --- | --- |
| apex A=185.199.111.153 DNS-only | عُدّل إلى 162.213.255.30 Proxied |
| apex A=185.199.110.153 / 109.153 / 108.153 | حُذفت السجلات الثلاثة |
| apex AAAA=2606:50c0:8003::153 / 8002::153 / 8001::153 / 8000::153 | حُذفت السجلات الأربعة |
| www CNAME=muhamaadessam.github.io DNS-only | عُدّل إلى muhammadessam.me Proxied |

عدد السجلات انخفض من 18 إلى 11. أبقيت jahez-dev A وmail A، و3 MX الخاصة بـjellyfish، وTXT الخاصة بـSPF/DKIM/DMARC/google verification. حُذفت السجلات القديمة أولًا ثم عُدّل A المتبقي وwww.

### الشهادة

- ولّدت RSA 2048 private key وCSR محليًا، SAN=apex وwww.
- اخترت في Cloudflare Use my private key and CSR، وأصدرت Origin certificate لمدة سنة.
- الصلاحية المسجلة من 9 أكتوبر 2026 إلى 9 أكتوبر 2027، 20:21 UTC، أي 23:21 بتوقيت القاهرة.
- نقلت cert وprivate key إلى نموذج SSL في cPanel وثبّت الشهادة. أظهرت cPanel SSL Host Successfully Installed.
- نزّلت RSA Origin CA root من Cloudflare الرسمي لاختبار الثقة. نجح openssl verify، ثم curl إلى IP الأصل مع --resolve و--cacert أعاد 200 لكل من apex وwww. لم أستخدم -k أو أتجاوز تحذير المتصفح.
- Full (strict) كان فعالًا وبقي كذلك. لم أخفّضه إلى Flexible/Full.
- شهادة Origin ليست شهادة عميل عامة؛ تعطيل Proxy قد ينتج تحذير ثقة. المرجع: https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/ . يجب تجديد الشهادة قبل انتهاء الصلاحية؛ لم أُنشئ تذكيرًا أو automation.

### القواعد

1. فعّلت Managed Transform: Add visitor location headers.
2. أنشأت cache bypass باسم Portfolio API and admin bypass، ID=`c5644d760a8b497284b670cd8ac5286d`، ترتيب 3، لـapex/www عندما يبدأ path بـ/api/ أو /admin. أبقيت قاعدتي jahez-dev الموجودتين.
3. أنشأت ثم عدّلت قاعدة تحويل واحدة، اسمها النهائي Portfolio HTTPS and canonical host، ID=`10d436235ab54696b782ab09b53d4cc0`:

```text
match:
(http.host in {"muhammadessam.me" "www.muhammadessam.me"}
 and (not ssl or http.host eq "www.muhammadessam.me"))

target:
concat("https://muhammadessam.me", http.request.uri.path)

status: 308
preserve query string: true
```

تحويل www مطلوب لأن SITE_ORIGIN وCONTACT_ALLOWED_ORIGIN مضبوطتان على apex. بدأت بقالب www، ثم وسّعته إلى HTTP أيضًا. محاولة شرط `http.request.scheme` رفضتها Cloudflare كـunknown identifier ولم تُحفظ؛ صححتها إلى `not ssl` ونُشرت القاعدة النهائية. لم أفعّل تحويل HTTP عامًا على بقية subdomains.

## 7. Google Cloud وFirebase وVercel

### حساب الخدمة

- project: portfolio-e05b2.
- أنشأت portfolio-stellar@portfolio-e05b2.iam.gserviceaccount.com ومنحته roles/datastore.user على مستوى المشروع.
- هذه الصلاحية تسمح بقراءة/كتابة بيانات Firestore على نطاق المشروع، وليست محصورة في analytics collections. لم أمنحه Firebase Auth admin أو Owner.
- أنشأت مفتاحًا لحساب الخدمة المخصص. لم أُلغِ أو أُدوّر مفاتيح الحساب القديم/firebase-adminsdk-fbsvc؛ لا تُعرض key IDs في هذا التقرير.
- تسجيل gcloud OAuth الواسع بقي مسجلًا على جهاز المستخدم. اتساع صلاحيات CLI منفصل عن دور حساب الخدمة المحدود المذكور.
- اختبرت توقيع JWT وقراءة stats/visitors عبر مكتبة analyticsServer الفعلية، ثم أعدت القراءة بعد نشر القواعد؛ نجحت القراءتان دون تعديل البيانات.

### حفظ الأسرار

ولّدت سر إشعارات عشوائيًا بطول 64 حرفًا من حروف URL-safe. حُفظ في Namecheap وVercel Production، وحُفظ مفتاح Firebase في Namecheap. أبقيت Firebase وTelegram credentials الموجودة سابقًا في Vercel.

النسخ الدائمة المحلية تحت `/Users/muhammadessam/.config/portfolio-stellar`، directory permissions=700 وfile permissions=600:

```text
portfolio-stellar.json
visitor-notification-secret
origin.key
origin.crt
origin.csr
cloudflare-origin-ca.pem
```

أُنشئت نسخ أولية في /tmp/stellar-secrets؛ حُذفت في المتابعة بعد مطابقة الملفات الستة مع النسخ الدائمة وفحص صلاحياتها. الأسرار لم تُنسخ إلى Git أو ZIP أو هذا التقرير. أثناء قراءة حالة تثبيت SSL ظهرت قطعتان من base64 للمفتاح في إخراج أداة سابق بسبب فلترة نصية غير دقيقة؛ لم يظهر المفتاح كاملًا، وأوقفت إخراج حقول الأسرار بعد ذلك. لم أدّعِ أن سجل الأدوات خالٍ تمامًا من أي جزء حساس، ولم أدوّر المفتاح بسبب هذا الحدث.

### Vercel

- project ID: prj_ttipqImURS4m9BrDwrMDTwAEMJTt، project name: portfolio-contact-api.
- حدّثت CONTACT_ALLOWED_ORIGIN إلى https://muhammadessam.me.
- أضفت VISITOR_NOTIFICATION_SECRET إلى Production كـSensitive، ثم نشرت نسخة الباك إند المعدلة.
- deployment ID: dpl_6ewmJsX4BDAp9Ei3tqEYvpy2HZ38، الحالة READY Production.
- URL: https://portfolio-contact-rd3pczoqv-muhammad-essam.vercel.app .
- تحققت أن alias المبني في الحزمة وportfolio-contact-api-three.vercel.app يشيران إلى هذا النشر.
- POST visitor بدون السر أعاد 401؛ بالسر الصحيح وbody غير صالح أعاد 400. لا يُعد ذلك اختبار تسليم Telegram.

### Firestore

- لم أعدّل firestore.indexes.json أو firestore.rules ضمن commits الثلاثة؛ نشرت الملفات الموجودة في المستودع.
- `firebase deploy --only firestore:indexes --project portfolio-e05b2 --non-interactive` نجح.
- الفهرس composite ID=CICAgOjXh4EK، collectionGroup=visitor_events، queryScope=COLLECTION، visitorId ASC + timestamp DESC. انتظرت CREATING حتى READY.
- بعدها `firebase deploy --only firestore:rules --project portfolio-e05b2 --non-interactive` نجح، والقواعد compiled/released.
- قواعد analytics تمنع browser writes إلى stats/visitors/visitor_sessions/visitor_events وتسمح بقراءة المالك UID=`x4BowypLZRSJ3ptp8CbFuafSFjj1`. حساب الخدمة يمر عبر IAM.
- **ليست كل browser writes ممنوعة:** القواعد الموجودة تسمح بكتابة المحتوى للمالك، وبإنشاء messages مجهولة عند استيفاء validation، وبقراءة المحتوى العام. راجع الملف كاملًا عند تقييم الأمان.

## 8. الاختبارات والأدلة

### محليًا قبل الرفع

| التحقق | النتيجة المسجلة |
| --- | --- |
| npm run lint | نجح |
| npx tsc --noEmit | نجح |
| node --test tests/*.test.mjs | 15 اختبارًا نجحت |
| production build باستخدام webpack | نجح مع المحتوى الفعلي من Firestore |
| standalone عبر TCP وUnix socket | نجح تحميل الصفحة؛ Origin خارجي 403، DNT 204، no-store وstatic immutable |
| backend visitor.test.cjs | 6 اختبارات نجحت، mocks فقط |

اختبار التغليف يستخدم build fixture في أحد unit tests؛ إضافة إلى ذلك نُفذ build حقيقي وإنتاج ZIP فعلي. CI بقي verification فقط، ولم أعدّل workflow أو أضف deployment تلقائيًا أو secrets إليه. لم أسجل تشغيل GitHub Actions عن بعد لهذا النشر أو إنشاء PR.

### في الإنتاج

| الطلب / الدليل | النتيجة وما يثبتها |
| --- | --- |
| origin HTTP | 200، صفحة البورتفوليو الفعلية |
| origin HTTPS apex وwww مع CA رسمي | 200، hostname/trust verification ناجح |
| public HTTPS apex وwww قبل قاعدة التحويل | 200، server=cloudflare وCF-Ray، صفحة Next الفعلية |
| HTTP apex وHTTP/HTTPS www بعد القاعدة | 308 إلى HTTPS apex؛ query string محفوظ؛ لا loop في الطلبات المتحققة |
| /_next/static JavaScript باستخدام curl | 200؛ public,max-age=31536000,immutable؛ CF cache MISS وقت الطلب |
| robots.txt / sitemap.xml / admin | 200؛ /admin رجع DYNAMIC من CF. في النشر الأول لم تُراجع اللوحة المسجلة الدخول؛ روجعت في المتابعة |
| canonical من HTML | الدومين النهائي apex؛ لا تعديل جديد لمصدر SEO |
| POST /api/track مع DNT:1 | 204 وno-store، بدون تخزين؛ DNT يُفحص قبل Origin |
| POST /api/track من origin خارجي | 403 وno-store/DYNAMIC |
| same-origin POST بـ{} بعد القواعد | 400؛ يثبت الوصول إلى validation، لا يثبت تخزين جلسة صحيحة |
| GET private stats بدون مصادقة | 403 بعد نشر القواعد |
| runtime service-account GET existing stats | نجح بعد القواعد |

طلب JavaScript باستخدام urllib الافتراضي أعاد 403؛ أعاد curl للملف نفسه 200 مع محتوى JS الصحيح. لم أثبت سبب هذا الاختلاف، ولم أغيّر WAF أو أتجاوز الحماية بسببه. يحتاج المراجع مراعاة اختلاف clients عند التحقق.

في مرحلة النشر الأولى لم أرسل test Telegram message أو POST tracking صالحًا، ولم أنشئ test document أو أمسح analytics؛ جلسة المتابعة والتنظيف اللاحقان موضحان في القسم 11. الكتابات الإدارية إلى IAM/env/DNS/certificate/index/rules حدثت كما هو موضح؛ نفي الكتابة هنا يخص بيانات اختبار analytics فقط. لا أستطيع نفي زيارات مستخدمين طبيعيين أو نشاط خارجي أثناء النشر.

### الموارد

القراءة النهائية من cPanel للحساب المشترك: Physical Memory=159.75M / 1G، NPROC=24 / 200، Entry Processes=2 / 20، faults=0. قبل إضافة التطبيق كانت قراءة الذاكرة حوالي 94MB. هذه snapshots وليست قياس فرق استهلاك دقيق أو load test. `--max-old-space-size=256` يحد V8 old-space، ولا يحد RSS الكلي لكل الحساب.

### ملفات الإثبات

- `deploy/dns-before-stellar.txt`: backup DNS للرجوع.
- `deploy/deployment-status.md`: checkpoint التنفيذ.
- `deploy/stellar-dns-live.png`: سجلات DNS النهائية.
- `deploy/stellar-canonical-rule.png`: قاعدة تحويل HTTP/www النهائية.
- `deploy/stellar-origin-certificate-issued.png`: شهادة Cloudflare وتاريخ انتهائها.
- أدلة إضافية بقيت في /tmp، منها READY الخاص بـVercel ورفع/extract الحزمة وتفعيل geo/cache؛ ليست كل screenshots ضمن Git.

## 9. نقاط تحتاج انتباه المراجع

1. فجوة التتبع والإشعار والإدارة أُغلقت في المتابعة؛ لم تتغير حقيقة أن نشر القواعد الأول سبق اختبار الكتابة الكامل، بعد إلغاء المستخدم له وقتها.
2. حساب الخدمة datastore.user على المشروع كله، لا analytics فقط. gcloud OAuth الواسع ما زال فعالًا؛ أمر إلغائه في القسم 11 ولم يُنفذ. النسخة المؤقتة من الأسرار حُذفت، والنسخ الدائمة ما زالت خاصة ومحفوظة.
3. الأصل ما زال قابلًا للوصول مباشرة؛ لم يُطبّق allowlist لأن أمان العزل واستخدام IP اتصال Cloudflare يحتاجان تأكيد دعم الاستضافة وموافقة المستخدم.
4. أُكدت modes وأثر إنشاء كاش على Stellar وسجل stderr خالٍ؛ دورة ISR لمدة 86400 ثانية وقياس UID العملية باختبار fs.access لم يُنفذا.
5. لم يُنفذ load/concurrency test أو اختبار متصفحات/أجهزة متعددة، أو contact submission أو CV notification حقيقي. OPTIONS والكود متحققان فقط للتواصل/CV.
6. دليل النشر ومثال CONTACT_ALLOWED_ORIGIN أُصلحا؛ Dashboard ما زال يخفي suffix Unknown التاريخي فقط ولا يرحّل العدادات القديمة.
7. الحزمة مبنية على macOS؛ الطلبات الحالية ناجحة، ولا يضمن ذلك native modules مستقبلية.
8. الشهادة تنتهي 9 أكتوبر 2027؛ أضف تذكيرًا في 25 سبتمبر 2027. لا توجد أداة تقويم متصلة متاحة، ولم تُنشأ automation بديلة.
9. جزآ المفتاح اللذان ظهرا سابقًا في سجل الأدوات لا يمكن سحبهما من المحادثة بأدوات هذه المهمة. فحص السجلات المحلية المحددة لا يبرر ادعاء خلو جميع سجلات الجهاز/الخدمات من أسرار.

## 10. حالة Git وتسليم المراجعة

وقت إعداد التقرير HEAD=`5743b131af9235d92eb27b09dbebbc1f3c172490`. لم أنشئ PR ولم أسجل push ضمن التنفيذ. ملفات deploy مستثناة من Git. ملفا prompt الموجودان سابقًا بقيا untracked ولم أعدلهما. كان هذا التقرير ملفًا جديدًا غير committed عند طلب إعداده؛ حُدث وحُفظ في commit منفصل بعنوان `docs: record Stellar follow-up verification and cleanup`. لا يُغيّر ذلك commits النشر الثلاثة التاريخية.

أوامر مراجعة الفروق، دون تشغيل نشر جديد:

```bash
git diff 412e9ae..5743b13 --stat
git diff 412e9ae..5743b13
git show 31983ee
git show 01be4f2
git show 5743b13
shasum -a 256 deploy/portfolio-stellar.zip
```

للرجوع توجد نسخة DNS؛ يمكن إعادة سجلات GitHub وإيقاف portfolio-app فقط. لم أختبر rollback فعليًا، ولم أسجل backup مستقلًا للقواعد السابقة أو نسخة backend deployment السابقة، فلا يُفترض توفر rollback كامل جاهز لكل خدمة. الرجوع من شهادة Origin يتطلب مراعاة الثقة عند تعطيل Proxy. يجب عدم تضمين مجلد الأسرار في ملفات تُرسل للمراجع.

## 11. متابعة التحقق والتنظيف

### الجلسة الوحيدة الجديدة

فُتح الرابط `https://muhammadessam.me/?utm_source=stellar-smoke&ref=smoke` مرة واحدة في Chrome؛ لم تُرسل طلبات tracking مصطنعة. لم تمنع المراجعة التلقائية هذه الزيارة في المتابعة. التبويب أُغلق بعد التمرير، والإدارة فُتحت منفصلة؛ tracker يتجاهل مسارات admin.

- sessionId: `f31146cd-e8d0-4f1d-bd4e-332020812dbe`، visitorId: `1791191049913`، زائر موجود سابقًا.
- بدأت `2026-10-09T20:46:56.867Z` وانتهى آخر engagement عند `20:47:50.636Z`، أي 23:46–23:47 بتوقيت القاهرة.
- المصدر الحالي `utmSource=stellar-smoke` و`ref=smoke`؛ firstTouch ظل مصدر الزائر السابق ولم يُستبدل.
- الموقع `country=EG, city=Cairo, region=C`، والجهاز desktop / Chrome / macOS. هذا يثبت وصول بيانات البلد والمدينة والمنطقة إلى مسار التخزين خلف Cloudflare؛ لم تُحقن headers يدويًا.
- خمسة أحداث: page_view(homepage)، section_view(experience/projects/contact)، engagement عند الإغلاق. مدة الظهور **52877ms** وعمق التمرير **91%** محفوظان في الجلسة والحدث.
- سجل telegram_logs واحد لهذه sessionId، بنوع visitor وisNewVisitor=false. أكد المستخدم: **«وصل إشعار واحد بهذه البيانات»** لـSource stellar-smoke، Company link smoke، Location Egypt (Cairo). لا يلزم تخمين التسليم من HTTP وحده.
- الإدارة كانت authenticated مسبقًا؛ أظهرت source breakdown وcompany smoke وEG/Cairo وChrome/macOS، واختيار الزائر عرض الأحداث الخمسة في timeline مع 53s/91%.

وُجدت أيضًا جلسة أقدم تحمل المصدر نفسه، `87c2420c-23ec-466a-896f-1cf742246603`، بدأت 20:36:19.944Z، بوسيط deployment وref فارغ. ليست جلسة المتابعة؛ لم تُنسب إليّ ولم تُحذف. نتيجة عدم وجود smoke وقت فحص النشر القديم كانت snapshot في وقتها وليست نفيًا لنشاط المستخدم اللاحق.

### تنظيف الإنتاج بدقة

حُفظ إثبات الجلسة في `deploy/followup-smoke-proof.json`، ونسخة المستندات قبل التنظيف في `deploy/followup-cleanup-private-backup.json` بصلاحية 600. الملفات داخل deploy مستثناة من Git ولا تتضمن مفاتيح؛ backup يحتوي بيانات زائر وعدادات، فلا يُنشر للعامة.

معاملة Firestore واحدة من **11 كتابة** استخدمت updateTime precondition لكل مستند: حذف الجلسة الجديدة وخمسة أحداث وسجل تسليمها فقط (7 مستندات)، وتحديث أربعة مستندات لإزالة مساهمتها دون تغيير البيانات الأخرى. تحقق السكريبت من source/ref/sessionId وعدد/أنواع الأحداث وأن الزائر موجود سابقًا، ومن عدم نزول أي عداد تحت الصفر. النسخة محفوظة قبل التنفيذ، والـpreconditions تمنع الكتابة فوق تعديل متزامن.

| العداد | قبل التنظيف | بعد التنظيف |
| --- | --- | --- |
| analytics sessions / homepageSessions / pageViews | 3 لكل منها | 2 لكل منها |
| sources stellar-smoke | 2 | 1؛ الجلسة الأقدم محفوظة |
| companies smoke | 1 | 0 |
| countries EG / cities EG / Cairo | 2 لكل منهما | 1 لكل منهما |
| كل section experience/projects/contact | 1 | 0 |
| durationMs | 94161 | 41284 |
| scrollDepth | 91 | 0 |
| stats/events page_view / page_view_homepage | 194 / 149 | 193 / 148 |
| stats/visitors total_visites | 588 | 587 |
| visitor visits | 13 | 12 |

نُقصت أيضًا referrers Direct وdevices desktop وbrowsers Chrome وoperatingSystems macOS بمقدار واحد لكل منها. بقي total_visitors=203، واستُعيد lastSeen للزائر إلى آخر page_view غير تابع للجلسة المحذوفة، `20:36:19.944Z`. لم تُمس counters مشاريع أو CV أو contact. تحقق لاحقًا GET للجلسة=404 وqueries أحداثها/سجلها فارغة، والزائر ما زال موجودًا. لوحة الإدارة بعد reload أكدت visits=587 وtracked sessions=2. **الرسالة التي وصلت Telegram بقيت في المحادثة؛ حُذف سجلها التجريبي في Firestore فقط.**

إثبات التنظيف: `deploy/followup-cleanup-result.json`، ولقطة `/tmp/stellar-followup-cleanup-dashboard.png`. حذف سجل الاختبار يقلل displayed logs ولا يدّعي محو إشعار Telegram أو سجلات أدوات التنفيذ.

### الأمان والحسابات

- `/tmp/stellar-secrets` حُذف، بعد التحقق من وجود النسخ الستة الدائمة ومطابقتها؛ ملف openssl.log المؤقت حُذف معه. permanent directory=700 وكل الملفات=600.
- فُحصت 32 ملفًا: shell history، وسجلات gcloud المحلية المتاحة، وسكريبتات stellar المؤقتة. لا تطابق لسر الإشعارات أو قطع 32 حرفًا من المفاتيح المُولدة في هذا النطاق. لم تُطبع القيم أو الأجزاء؛ لا يغطي الفحص سجل المحادثة القديم أو كل logs الخارجية.
- project IAM يعرض **roles/datastore.user فقط** للـportfolio-stellar service account، ولا توجد organization/folder ancestors للمشروع أو bindings في SA resource policy. لم يُجرَ جرد كل المشاريع الأخرى في Google Cloud، فلا يُدّعى تحقق عالمي لكل مشروع.
- OAuth حساب `muhammad159e@gmail.com` ما زال active وتعمل به أوامر IAM/Firestore؛ الصلاحيات الواسعة التي وافق عليها المستخدم وقت تسجيل CLI بقيت. لم أُلغه. الأمر المحدد: `gcloud auth revoke muhammad159e@gmail.com`؛ يُنفذ فقط بعد موافقة المستخدم.
- حساب firebase-adminsdk-fbsvc القديم يعرض USER_MANAGED key غير معطل، validAfterTime=`2026-07-30T18:16:24Z` وvalidBeforeTime=`9999-12-31T23:59:59Z`، إلى جانب مفتاحين SYSTEM_MANAGED. هذا تحقق metadata، وليس توقيعًا بالمفتاح القديم؛ لم أستخرجه أو أدوّره أو أحذفه.
- origin lockdown لم يُطبق: [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9536/29/how-to-block-ips-from-accessing-your-website/) تتيح `.htaccess`، وتحذر أن IP Blocker يؤثر في كل مواقع/خدمات الحساب. [Cloudflare](https://developers.cloudflare.com/fundamentals/concepts/cloudflare-ip-addresses/) توثق عناوينها، و[استعادة visitor IP](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/) توضح احتمال استبدال REMOTE_ADDR. لذا يلزم دعم الاستضافة لتأكيد فلترة peer IP الحقيقي داخل vhost هذا الدومين فقط، ثم خطة/موافقة قبل التطبيق. لم يُرسل طلب دعم نيابةً عن المستخدم.

### الفحوص المتبقية والموارد

Contact: الكود يرسل POST إلى `https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact`، وOPTIONS الإنتاج أعاد 200 مع Allow-Origin=`https://muhammadessam.me` وPOST,OPTIONS وContent-Type. هذا يثبت allowlist الفعلي بالتوافق مع الكود؛ لا تمثل القراءة استخراجًا لقيم secrets من Vercel. لم تُرسل رسالة حقيقية.

CV: Hero وContact يربطان الزر بـincrementCvDownloadCount، ثم sendTracking(cv_download, cv) ثم stats/cv_downloads وnotify(cv-download) في الخادم، مع سر الإشعار. الرابط إلى Google Drive موجود في constants. لم يُضغط الزر أو يختبر تسليم CV notification فعليًا.

ISR: File Manager عرض `.next/cache` و`.next/server` وserver/app وserver/pages وserver/route-cache بـ755، وملفات app المعروضة بـ644. الحزمة أضافت cache فارغة؛ images تحت cache وroute-cache تحت server لهما timestamps بعد الرفع، وهو دليل أثر كتابة في runtime. `portfolio-app/stderr.log` صفر بايت، فلا cache write errors في هذا الملف وقت الفحص. شاشة Errors العامة تخص konoz-eg.com فلا تصلح وحدها دليلاً للبورتفوليو. لم يُنفذ fs.access تحت UID العملية أو اختبار regeneration لمدة 86400 ثانية؛ الملكية الفعلية لكل ملف متداخل لم تُقَس بالـstat، والصلاحيات/أثر الكتابة تحقق عملي محدود لا إثبات دورة ISR.

| Resource Usage للحساب المشترك | snapshot النشر السابقة | snapshot المتابعة بعد الصفحة والإدارة |
| --- | --- | --- |
| Physical Memory | 159.75M / 1G | 164.65M / 1G |
| NPROC | 24 / 200 | 26 / 200 |
| Entry Processes | 2 / 20 | 2 / 20 |
| Faults | 0 | 0 |

لا load test ولا attribution للبورتفوليو وحده؛ لم تُنشأ زيارات اختبار إضافية بغرض قياس الموارد، التزامًا بجلسة واحدة. الشهادة تنتهي 9 أكتوبر 2027؛ التذكير اليدوي المطلوب 25 سبتمبر 2027. لا توجد أداة تقويم متصلة متاحة، ولم يُنشأ reminder أو automation.

### تحديثات الملفات والتحقق

Commit الدليل وenv example: `0664309` (`docs: reconcile live Stellar deployment and operations`). التقرير محفوظ في commit منفصل بالعنوان المذكور أعلاه؛ لا يُدرج hash ذاتي داخل محتواه.

- docs/DEPLOY-STELLAR.md: الحالة الفعلية وruntime env وقواعد Cloudflare والتجديد وorigin lockdown ونتائج التحقق وOperations للرفع/الرجوع/logs/resources/DNS backup.
- .env.example: CONTACT_ALLOWED_ORIGIN صار apex.
- هذا التقرير: الحفاظ على الوقائع التاريخية، مع نتائج المتابعة وتنظيف محدد وحدود واضحة. لم تتغير ملفات التطبيق أو الباك إند أثناء المتابعة؛ بصمات ملفي backend المذكورين سابقًا لم تتغير.
- جرى فحص diff whitespace وتسرب الأسرار إلى الملفات المعدلة. لا build أو tests جديدة لأن تغييرات المتابعة توثيق وenv example فقط؛ نتائج الاختبارات السابقة منفصلة في القسم 8.
- ملفات prompts الثلاثة بقيت untracked دون تعديل. لا push أو PR أو تعديل CI في المتابعة.

### الحالة النهائية للمراجعة

| البند | الحالة | الدليل / القيد |
| --- | --- | --- |
| جلسة التتبع وgeo والأحداث والعدادات | verified | sessionId أعلاه؛ 5 أحداث ومصدر/ref صحيحان |
| Telegram | verified | سجل واحد للجلسة وتأكيد المستخدم Egypt (Cairo)/stellar-smoke/smoke |
| الإدارة وtimeline وengagement عند الإغلاق | verified | لوحة authenticated، 53s و91% |
| تنظيف الجلسة الجديدة | fixed | 11 كتابة ذرية وpreconditions؛ 404/queries فارغة؛ الزائر والجلسة الأقدم محفوظان |
| ملفات الأسرار المؤقتة والصلاحيات المحلية | fixed | tmp حذف؛ permanent 700/600؛ scan محدد 32 ملفًا بلا تطابق |
| IAM حساب الخدمة | verified | datastore.user فقط في المشروع؛ لا ادعاء بجرد بقية المشاريع |
| gcloud OAuth | needs my action | ما زال active؛ أمر revoke محدد ولم يُنفذ |
| المفتاح القديم | verified | موجود وغير معطل وفق metadata فقط؛ لم يُستخدم أو يُدوّر |
| Origin lockdown | needs my action | تأكيد host لفلترة peer IP داخل vhost ثم موافقة قبل التطبيق |
| Contact وCV wiring | verified | code وOPTIONS؛ لا إرسال/تحميل فعلي |
| Contact/CV تسليم حقيقي | not verified | لا تفويض لإرسال رسائل اختبار إضافية |
| ISR filesystem والسجل | verified | modes وأثر إنشاء cache وstderr صفر؛ لم يُفحص UID كل ملف |
| دورة ISR بعد 86400 ثانية | not verified | لم ينتظر الاختبار دورة كاملة |
| موارد الحساب | verified | 164.65M،26 NPROC،2 EP،faults0؛ ليس اختبار ضغط |
| دليل النشر وenv example والتقرير | fixed | commits المتابعة المحلية؛ prompt files untouched |
| تذكير التجديد | needs my action | أضف 25 سبتمبر 2027؛ لا calendar connector متاح |
