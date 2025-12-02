import styles from './Input.module.css';

interface InputProps {
    type?: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
}

export default function Input({
    type = 'text',
    placeholder = '',
    name,
    value,
    onChange,
    error = ''
}: InputProps) {
    const inputError = error ? styles.input__error : '';

    return (
        <div>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${styles.input} ${inputError}`}
            />

            <p className={styles.error}>{error}</p>
        </div>
    );
};