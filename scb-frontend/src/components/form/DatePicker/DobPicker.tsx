import { useState, useEffect } from 'react';
import styles from './DobPicker.module.css';

interface DobPickerProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
}

const MAX_AGE = 70;

function getDaysInMonth(month: number, year: number) {
    if ([4, 6, 9, 11].includes(month)) return 30;
    if (month === 2) return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    return 31;
}

export default function DobPicker({
    name,
    value,
    onChange
}: DobPickerProps) {
    const today = new Date();

    const years = Array.from({ length: MAX_AGE }, (_, index) => today.getFullYear() - index);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);

    const [date, setDate] = useState({ day: "", month: "", year: "" });

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            setDate({ day: d.toString(), month: m.toString(), year: y.toString() });
        }
    }, [value]);

    const days = Array.from({ length: getDaysInMonth(Number(date.month), Number(date.year)) }, (_, index) => index + 1);

    const handleChange = (key: "day" | "month" | "year", val: string) => {
        const newDate = { ...date, [key]: val };
        setDate(newDate);

        const { day, month, year } = newDate;
        if (day && month && year) {
            onChange?.(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
        } else {
            onChange?.("");
        }
    };

    const renderSelect = (
        name: string,
        options: Array<any>,
        value: string,
        onChange: (value: string) => void,
        placeholder?: string
    ) => (
        <select id={name} value={value} onChange={(e) => onChange(e.target.value)} className={styles.dobPickerSelect}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
                <option key={option} value={option}>
                    {placeholder ? option : option.toString()}
                </option>
            ))}
        </select>
    );

    return (
        <div className="mb-5">
            <div className={styles.dobPickerLabel}>Ngày sinh</div>
            <div className="flex justify-between items-center gap-2">
                {renderSelect("day", days, date.day, (d) => handleChange("day", d), "Ngày")}
                {renderSelect("month", months, date.month, (m) => handleChange("month", m), "Tháng")}
                {renderSelect("year", years, date.year, (y) => handleChange("year", y), "Năm")}
            </div>
        </div>
    );
}