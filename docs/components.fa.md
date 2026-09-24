# معماری کامپوننت‌ها

[معرفی](../README.md) · [معماری](architecture.fa.md)

## پوسته و صفحه‌ها

| جزء                             | مسئولیت                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| App و AppRoutes                 | ترکیب برنامه و مسیریابی                                         |
| TranslationProvider             | مقداردهی، reducer، زبان فعال، ذخیره و هشدار                     |
| RouteLayout                     | دریافت warning، عنوان سند و اتصال به AppShell                   |
| AppShell                        | ناوبری، محتوای اصلی، هشدار و پاورقی                             |
| AppNavigation و usePageScrolled | لینک‌های متناسب با مسیر و وضعیت اسکرول                          |
| ManagementPage                  | ترکیب selector، آمار، فهرست و actionها؛ وضعیت بازبودن دیالوگ‌ها |
| PublicPage                      | ترکیب نمای مطالعه و انتخاب زبان                                 |

## اجزای shared

- Button: گونه‌های primary/secondary و ویژگی‌های استاندارد؛ نوع پیش‌فرض button مانع submit ناخواسته می‌شود.
- PageHeading: عنوان و شناسه، eyebrow و محل actionها.
- TextField: label مرتبط، id یکتا، خطا، aria-invalid و ref سازگار با register در React 19.
- Modal: dialog بومی با showModal، عنوان و توضیح مرتبط، بستن با Escape/پس‌زمینه/دکمه و بازگرداندن فوکوس قبلی هنگام unmount.

TextField درخواست autoFocus را با data-autofocus نیز مشخص می‌کند؛ Modal پس از showModal همان فیلد را فوکوس می‌کند. این ترتیب در mount مجدد effectهای StrictMode نیز رعایت می‌شود.

این اجزا به Context ترجمه یا storage وابسته نیستند.

## اجزای feature

| گروه / جزء       | قرارداد و اتصال                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| keywords         | `KeywordList` و `KeywordRow` برای فهرست مجازی، ویرایش و drag-and-drop؛ فرم و دیالوگ افزودن/ویرایش واژه |
| translations     | `TranslationList` برای تبدیل order به کارت‌ها و `TranslationCard` برای متن جهت‌دار و حالت خالی         |
| languages        | انتخاب زبان فعال، فهرست قابل مرتب‌سازی و فرم/دیالوگ افزودن و حذف زبان                                  |
| management       | `ManagementOverview` برای آمار و `ManagementActions` برای بازکردن دیالوگ‌های صفحه                      |
| dataset-transfer | دیالوگ ورود/خروج، خلاصهٔ فایل، اعتبارسنجی و تأیید جایگزینی کامل dataset                                |
| KeywordFilters   | جست‌وجو و فیلتر وضعیت ترجمه بدون تغییر ترتیب اصلی                                                      |
| ActionIcon       | دکمهٔ آیکنی مشترک feature با نام قابل دسترس و حالت‌های ویرایش/حذف/جابه‌جایی                            |

ردیف و کارت در نسخهٔ فعلی کاملاً presentational نیستند؛ وابستگی آن‌ها به Context برای metadata زبان باید هنگام استفادهٔ مجدد یا آزمون در نظر گرفته شود.

## فرم‌ها

React Hook Form با yupResolver به schemaهای `schemas/` متصل است. نوع مقادیر با InferType استخراج می‌شود. فرم واژه برای هر زبان یک input دارد و شرط حداقل یک ترجمه در سطح object بررسی می‌شود. schema فرم زبان از اعتبارسنجی دامنه و dataset برای تشخیص کد تکراری استفاده می‌کند. persistence در فرم‌ها نیست؛ callback دیالوگ dispatch می‌کند.

## انتقال داده

`DatasetTransferDialog` خروجی نسخهٔ ۲ را از کل dataset می‌سازد و فایل ورودی را پیش از dispatch در مرز سرویس اعتبارسنجی می‌کند. import فقط پس از انتخاب فایل معتبر و تأیید صریح جایگزینی فعال می‌شود و پس از موفقیت دیالوگ بسته می‌شود. اجزای بخش خروجی، ورودی، خلاصه و عنوان در پوشهٔ `dataset-transfer/` جدا شده‌اند تا منطق دیالوگ یکپارچه ولی فایل‌ها کوچک بمانند.

## قواعد توسعه

shared نباید feature یا storage وارد کند. عملیات state در domain بماند، schema پیام فرم و قالب دادهٔ ورودی را کنترل کند و service مرز persistence باشد. استایل اختصاصی هر جزء در فایل .module.scss کنارش وارد می‌شود. اجزای feature بر اساس حوزه در زیرپوشه‌های `keywords`، `languages`، `translations`، `management` و `dataset-transfer` قرار می‌گیرند؛ اجزای واقعاً مشترک feature در ریشه می‌مانند. سطح عمومی importها در `components/index.ts` نگهداری می‌شود. memo و تقسیم Context باید با اندازه‌گیری نیاز واقعی همراه باشد.
