import clsx from 'clsx';
import styles from './IconButton.module.css';

interface IconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export default function IconButton({
    children,
    onClick,
    disabled = false,
    className = ''
}: IconButtonProps) {

    return (
        <button className={clsx(styles.iconButton, className)}>
            {children}
        </button>        
    );
}