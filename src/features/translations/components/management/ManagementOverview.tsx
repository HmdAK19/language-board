import type { Dataset } from '../../types';
import styles from './ManagementOverview.module.scss';

interface ManagementOverviewProps {
  data: Dataset;
}

export const ManagementOverview = ({ data }: ManagementOverviewProps) => {
  const primaryLanguage = data.languages[0]?.code;
  const missingTranslations = primaryLanguage
    ? data.order.filter(
        (id) => !data.keywords[id].translations[primaryLanguage]?.trim(),
      ).length
    : 0;

  const metrics = [
    { label: 'Keywords', value: data.order.length },
    { label: 'Languages', value: data.languages.length },
    {
      label: 'Needs translation',
      value: missingTranslations,
      needsAttention: missingTranslations > 0,
    },
  ];

  return (
    <dl className={styles.overview} aria-label="Workspace overview">
      {metrics.map(({ label, value, needsAttention }) => (
        <div
          key={label}
          className={needsAttention ? styles.needsAttention : undefined}
        >
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
};
