import styles from './DatasetTransferDialog.module.scss';

interface DatasetTransferSectionHeaderProps {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const DatasetTransferSectionHeader = ({
  id,
  icon,
  title,
  description,
}: DatasetTransferSectionHeaderProps) => (
  <div className={styles.heading}>
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
    <div>
      <h3 id={id}>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);
