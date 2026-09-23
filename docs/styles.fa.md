# معماری استایل‌ها

[معرفی](../README.md) · [کامپوننت‌ها](components.fa.md)

## لایه‌ها

- `app/styles/index.scss`: ورودی reset، توکن‌ها، قواعد مشترک و پوسته.
- `shared/styles/base`: CSS custom properties معنایی و reset. فونت‌های Inter و Vazirmatn از بسته‌های محلی وارد می‌شوند.
- `shared/styles/abstracts`: mixinها و breakpointها با Sass @use و @forward؛ بدون استایل اجرایی مستقل.
- `shared/styles/components`: قواعد مشترک دکمه، heading و feedback.
- `app/styles/_shell.scss`: ناوبری، ظرف اصلی و پاورقی با کلاس‌های سراسری.
- فایل‌های `.module.scss` کنار صفحه‌ها و اجزا: CSS Modules با import به شکل styles و کلاس‌های scoped؛ استایل routeها همراه chunk آن‌ها بارگذاری می‌شود.

این پروژه اکنون CSS Modules دارد؛ selectorهای قدیمی نظیر `.keyword-name` و `.word-card` قرارداد معتبر آزمون نیستند. برای E2E از role، label و ساختار قابل دسترس استفاده شود.

## توکن‌ها و اندازه‌ها

توکن‌ها شامل رنگ زمینه/سطح/متن، حالت ناقص، خطا، فوکوس، سایه، فاصله و شعاع‌اند. عرض پایهٔ ظرف `--container-width: 1280px` است. `--font-ui` و `--font-translation` انتخاب فونت را یکپارچه می‌کنند. داشتن custom properties به معنی وجود UI انتخاب تم نیست.

| breakpoint   | مقدار  |
| ------------ | ------ |
| compact      | 370px  |
| mobile       | 600px  |
| cards        | 700px  |
| below-tablet | 767px  |
| tablet       | 768px  |
| desktop      | 1100px |

up از min-width و down از max-width استفاده می‌کند؛ نام ناشناخته خطای Sass می‌دهد. اندازه‌های تصاویر آزمون 320، 390، 768، 1024، 1440 و 1920 هستند و الزاماً همان breakpointها نیستند.

## قواعد تغییر

استایل اختصاصی را کنار صاحب آن نگه دارید؛ کلاس سراسری جدید تنها برای قرارداد مشترک تعریف شود. از توکن معنایی و mixin موجود استفاده کنید؛ nesting کوتاه و override قابل پیش‌بینی باشد. از @import قدیمی استفاده نکنید. حالت focus-visible، dir متن، خطا و reduced motion را حفظ کنید. پس از تغییر layout، build و تصاویر موبایل/دسکتاپ را بررسی کنید؛ گزارش نداشتن overflow جای بررسی چشمی را نمی‌گیرد.
