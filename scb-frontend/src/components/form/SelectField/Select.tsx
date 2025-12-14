import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            options,
            value,
            onChange,
            error,
            placeholder,
            label,
            required = false,
            hint,
            disabled = false,
            className,
            id,
            name,
            ...rest
        },
        ref
    ) => {
        const selectId = id || name;

        return (
            <div className={styles.wrapper}>
                {label && (
                    <label htmlFor={selectId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <div className={styles.selectWrapper}>
                    <select
                        ref={ref}
                        id={selectId}
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={clsx(
                            styles.select,
                            error && styles.error,
                            disabled && styles.disabled,
                            className
                        )}
                        {...rest}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.arrow} aria-hidden="true">
                        <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 1L6 6L11 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
                {hint && !error && (
                    <p className={styles.hint}>{hint}</p>
                )}
                {error && (
                    <p className={styles.errorMessage} role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
