import * as yup from 'yup';

import type { Dataset } from '../types';
import { normalizeLanguageCode } from '../domain';

export const createLanguageFormSchema = (data: Dataset) => {
  return yup
    .object({
      code: yup
        .string()
        .trim()
        .required('Enter a language code.')
        .max(35, 'Use 35 characters or fewer.')
        .test(
          'valid-code',
          'Enter a valid language code, such as de or pt-BR.',
          (value) => !!value && !!normalizeLanguageCode(value),
        )
        .test(
          'unique-code',
          'This language already exists.',
          (value) =>
            !!value &&
            !data.languages.some(
              ({ code }) => code === normalizeLanguageCode(value),
            ),
        ),
      label: yup
        .string()
        .trim()
        .required('Enter a language name.')
        .max(80, 'Use 80 characters or fewer.'),
      direction: yup
        .mixed<'ltr' | 'rtl'>()
        .oneOf(['ltr', 'rtl'])
        .required('Choose a text direction.'),
    })
    .required();
};

export type LanguageFormValues = yup.InferType<
  ReturnType<typeof createLanguageFormSchema>
>;
