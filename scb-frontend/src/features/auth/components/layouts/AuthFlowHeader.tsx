import { Back } from '@/components/ui/icons';
import styles from './AuthFlowHeader.module.css';

interface AuthFlowHeaderProps {
    title: string;
    onBack: () => void;
}

export default function AuthFlowHeader({ title, onBack }: AuthFlowHeaderProps) {
    return (
        <div className={styles.flowForm__header}>
            <button onClick={onBack} className={styles.backBtn}>
                <Back />
            </button>
            <h2 className={styles.title}>{title}</h2>
        </div>
    );
}