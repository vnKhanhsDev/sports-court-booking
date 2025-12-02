import styles from './Button.module.css';

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

export default function Button({
    type = 'button',
    label,
    onClick,
    disabled = false,
    className = ''
}: ButtonProps) {
    const disabledClass = disabled ? styles.disabled : '';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${styles.button} ${disabledClass} ${className}`}
        >
            {label}
        </button>
    );
}