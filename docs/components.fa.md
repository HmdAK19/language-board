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

| جزء                   | قرارداد و اتصال                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| KeywordList           | دریافت داده و dispatch از Context، اتصال DragDropContext و ردیف‌ها                               |
| KeywordRow            | props شامل item/index/language/onEdit؛ برای جهت زبان Context نیز می‌خواند و Draggable را می‌سازد |
| TranslationList       | تبدیل order به کارت‌ها و نمایش حالت خالی                                                         |
| TranslationCard       | props شامل keyword/value/language؛ برای جهت متن Context می‌خواند                                 |
| LanguageSelect        | خواندن کاتالوگ و زبان فعال و تغییر آن در Context                                                 |
| ManagementOverview    | دریافت dataset و محاسبهٔ آمار بر مبنای زبان اول                                                  |
| ManagementActions     | callback بازکردن دو دیالوگ                                                                       |
| AddKeywordDialog      | اتصال فرم به state و action افزودن واژه                                                          |
| KeywordForm           | دریافت languages/data/validateKeyword/onSubmit/onCancel؛ مدیریت فرم مستقل از repository          |
| ManageLanguagesDialog | افزودن، حذف با confirm، مرتب‌سازی و اصلاح انتخاب فعال                                            |
| LanguageCatalog       | نمایش فهرست و callbackهای onMove/onRemove                                                        |
| AddLanguageForm       | دریافت data/onAdd/onCancel و اعتبارسنجی زبان                                                     |

ردیف و کارت در نسخهٔ فعلی کاملاً presentational نیستند؛ وابستگی آن‌ها به Context برای metadata زبان باید هنگام استفادهٔ مجدد یا آزمون در نظر گرفته شود.

## فرم‌ها

React Hook Form با yupResolver به schemaهای `schemas/` متصل است. نوع مقادیر با InferType استخراج می‌شود. فرم واژه برای هر زبان یک input دارد و شرط حداقل یک ترجمه در سطح object بررسی می‌شود. schema فرم زبان از اعتبارسنجی دامنه و dataset برای تشخیص کد تکراری استفاده می‌کند. persistence در فرم‌ها نیست؛ callback دیالوگ dispatch می‌کند.

## قواعد توسعه

shared نباید feature یا storage وارد کند. عملیات state در domain بماند، schema پیام فرم و قالب دادهٔ ورودی را کنترل کند و service مرز persistence باشد. استایل اختصاصی هر جزء در فایل .module.scss کنارش وارد می‌شود. memo و تقسیم Context باید با اندازه‌گیری نیاز واقعی همراه باشد.
