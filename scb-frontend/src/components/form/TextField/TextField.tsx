import clsx from 'clsx';
import styles from './TextField.module.css';

export interface TextFieldProps {
    type?: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export default function TextField({
    type = 'text',
    placeholder = '',
    name,
    value,
    onChange,
    error = '',
    disabled = false
}: TextFieldProps) {
    return (
        <>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={clsx(
                    styles.textField,
                    error && styles.error
                )}
            />

            <p className={styles.errorMessage}>{error}</p>
        </>
    );
}