# معماری و توسعه

[معرفی](../README.md) · [مدل داده](data-model.fa.md) · [اجزا](components.fa.md)

## ساختار

```text
src/
  app/
    layout/       AppShell، AppNavigation و رفتار اسکرول
    providers/    TranslationProvider و اتصال repository
    routes/       مسیرها، routeConfig، RouteLayout و lazy loading
    styles/       استایل سراسری و پوسته
  features/translations/
    components/
      dataset-transfer/   ورود و خروج JSON
      keywords/           فهرست، ردیف و فرم واژه
      languages/          انتخاب و مدیریت زبان‌ها
      management/         آمار و عملیات صفحهٔ مدیریت
      translations/       فهرست و کارت ترجمه
      *.tsx               کنترل‌های مشترک داخل feature
    domain/       reducerها، factory، seed، validation و migration
    hooks/        دسترسی کنترل‌شده به Context
    pages/        ManagementPage و PublicPage
    schemas/      schemaهای Yup و نوع فرم‌ها
    services/     قرارداد DatasetRepository و localStorage adapter
    store/        قرارداد Context
    types/        Dataset، Keyword، LanguageDefinition و Action
  shared/
    components/   Button، PageHeading، TextField و Modal
    styles/       توکن، reset، mixin و قواعد مشترک
  test/           آزمون‌های دامنه و repository
e2e/              آزمون‌های مرورگر و تولید تصاویر
```

alias برابر `@` به `src` اشاره می‌کند. فایل‌های `index.ts` سطح صادرات هر بخش را جمع می‌کنند. صفحه‌ها با React.lazy بارگذاری می‌شوند؛ کد اختصاصی مدیریت و drag-and-drop لازم نیست همراه صفحهٔ عمومی اجرا شود.

## جریان وضعیت

```text
localStorage → repository.load → TranslationProvider → UI
                                      ↑               ↓
                               datasetReducer ← dispatch
                                      ↓
                             effect: repository.save → localStorage
```

Provider یک بار دادهٔ اولیه را از repository می‌گیرد و useReducer را مقداردهی می‌کند. داده، زبان فعال، dispatch، وضعیت saved و warning از Context عرضه می‌شوند. effect پس از تغییر dataset ذخیره را انجام می‌دهد. تغییر زبان فعال به‌تنهایی dataset را تغییر نمی‌دهد. repository از props قابل تزریق است و view مستقیماً با localStorage کار نمی‌کند.

datasetReducer عملیات واژه و زبان را به reducerهای جدا می‌سپارد. reducerها immutable هستند و عملیات نامعتبر را با بازگرداندن state قبلی رد می‌کنند. Yup تجربهٔ خطای فرم را فراهم می‌کند؛ اعتبارسنجی دامنه نیز در مرز state و ذخیره‌سازی وجود دارد.

## مسیریابی

منبع مسیرها `src/app/routes/paths.ts` است: `/` عمومی و `/manage` مدیریت. routeهای ناشناخته با replace به عمومی هدایت می‌شوند. RouteLayout پوسته، warning و عنوان سند را کنترل می‌کند. صفحهٔ عمومی و مدیریت navigation متناسب با خود دارند. مسیر عمومی حفاظ امنیتی ایجاد نمی‌کند و مدیریت احراز هویت ندارد.

## انتخاب‌های طراحی

دادهٔ واژه‌ها در map به نام `keywords` و ترتیب آن‌ها در `order` نگهداری می‌شود؛ شناسه با جابه‌جایی وابسته به index نمی‌شود. ترجمه‌ها sparse هستند، بنابراین افزودن زبان لازم نیست همهٔ واژه‌ها را بازنویسی کند. کاتالوگ زبان‌ها بخشی از dataset است و افزودن زبان معمولی از UI به تغییر کد یا schema نیاز ندارد.

Context برای این اندازهٔ برنامه ساده و کافی است؛ با تغییر مقدار provider، مصرف‌کنندگان آن دوباره render می‌شوند. map بودن `keywords` به معنی O(1) بودن همهٔ عملیات نیست: کپی object، کنترل یکتایی، اعتبارسنجی و serialization همچنان هزینهٔ وابسته به حجم داده دارند.

## توسعهٔ امکانات

- قابلیت دامنهٔ جدید: Action و reducer مربوطه، validation، آزمون واحد و سپس اتصال UI اضافه شود.
- تغییر شکل ذخیره باید هم‌زمان در type، validator، repository، reducer، import/export و آزمون‌ها اعمال شود.
- backend: adapter مناسب اضافه شود؛ قرارداد فعلی synchronous است و برای API نیاز به بازطراحی وضعیت loading/error و ذخیرهٔ async دارد.
- زبان جدید: از Manage languages استفاده شود؛ برای تغییر زبان‌های پیش‌فرض، seed و پیامدهای دادهٔ کاربران قبلی بررسی شوند.
- کنترل عمومی: به shared برود؛ منطق ترجمه در feature باقی بماند.

## مقیاس بزرگ‌تر

برای هزاران واژه ابتدا زمان render، پاسخ تایپ و هزینهٔ ذخیره اندازه‌گیری شود. نوشتن synchronous کل JSON در هر تغییر و اعتبارسنجی کامل، نقاط قابل توجه‌اند. virtualized list، subscriptionهای انتخابی، ذخیرهٔ incremental و IndexedDB یا API صفحه‌بندی‌شده گزینه‌های توسعه‌اند. Debounce به وضعیت pending و راهکار flush/recovery نیاز دارد. همکاری چندکاربره علاوه بر API، نسخه‌گذاری تعارض و authorization می‌خواهد؛ هیچ‌یک در نسخهٔ فعلی پیاده نشده است.
