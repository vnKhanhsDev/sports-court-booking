import clsx from 'clsx';
import styles from './IconButton.module.css';

interface IconButtonProps {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default function IconButton({
    children,
    onClick,
    disabled = false,
    className = "",
    type = "button",
}: IconButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(styles.iconButton, className)}
        >
            {children}
        </button>
    );
}