import clsx from 'clsx';
import styles from './RadioGroup.module.css';

interface RadioGroupProps {
    label?: string;
    options: { label: string; value: string }[];
    name: string;
    value: string;
    onChange: (value: string) => void;
}

export default function RadioGroup({
    label,
    options,
    name,
    value,
    onChange
}: RadioGroupProps) {
    return (
        <div className="mb-5">
            <div className={styles.radioGroupLabel}>{label}</div>

            <div className="flex justify-between items-center gap-2">
                {options.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <label key={option.value} className={clsx(styles.radioOption, isSelected && styles.selected)}>
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={(e) => onChange(e.target.value)}
                            />
                            <span className={styles.radioOptionLabel}>{option.label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}