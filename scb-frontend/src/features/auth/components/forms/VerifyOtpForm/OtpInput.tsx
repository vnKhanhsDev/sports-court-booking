// 1. Framework & Libraries
import { useRef, useState, useMemo } from "react";

// 2. Third-party Libraries
import clsx from "clsx";

// 3. Styles
import styles from './OtpInput.module.css';

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
};

export default function OtpInput({
    length = 6,
    value,
    onChange,
    error = ''
}: OtpInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let cleanVal = e.target.value.replace(/\D/g, '');
        
        if (cleanVal.length > length) return;
        onChange(cleanVal);
    };

    const handleClickWrapper = () => inputRef.current?.focus();

    const boxes = useMemo(() => {
        return Array.from({ length }).map((_, index) => value[index] || '');
    }, [length, value]);

    return (
        <div className={styles.wrapper} onClick={handleClickWrapper}>
            <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={length}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={styles.otpInput}
            />

            <div className={styles.boxes}>
                {boxes.map((char, index) => {
                    const isActive = isFocused && index === value.length;
                    const isFilled = char !== '';

                    return (
                        <div
                            key={index}
                            className={clsx(
                                styles.box,
                                isActive && styles.active,
                                error && styles.error
                            )}
                        >
                            {isFilled ? char : (isActive && <span className={styles.caret} />)}
                        </div>
                    );
                })}
            </div>

            <p className={styles.errorMessage}>{error}</p>
        </div>
    );
}