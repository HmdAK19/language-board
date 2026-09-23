import * as yup from 'yup';
import type { Dataset } from '../types';

export const createKeywordFormSchema = (
  validateKeyword: (keyword: string) => string | null,
  data?: Dataset,
) => {
  const shape = Object.fromEntries(
    (data?.languages ?? []).map(({ code }) => [
      code,
      yup.string().max(500, 'Use 500 characters or fewer.').default(''),
    ]),
  );

  return yup
    .object({
      keyword: yup
        .string()
        .trim()
        .required('Enter a keyword.')
        .max(80, 'Use 80 characters or fewer.')
        .test('available-keyword', function (value) {
          const error = value ? validateKeyword(value) : null;
          return error
            ? this.createError({
                message: error,
              })
            : true;
        }),
      translations: yup
        .object(shape)
        .test(
          'at-least-one',
          'Enter at least one translation.',
          (values) =>
            !!values &&
            Object.values(values).some(
              (value) => typeof value === 'string' && value.trim(),
            ),
        ),
    })
    .required();
};

export type KeywordFormValues = yup.InferType<
  ReturnType<typeof createKeywordFormSchema>
>;
