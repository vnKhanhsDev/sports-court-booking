import { useState } from "react";
import TextField from "./TextField";
import type{ TextFieldProps } from "./TextField";
import { Hide, Show } from "@components/ui/icons";
import styles from './PasswordField.module.css';

export default function PasswordField(props: TextFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.passwordField}>
            <TextField
                { ...props }
                type={showPassword ? 'text' : 'password'}
            />

            <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
            >
                {!showPassword ? <Hide /> : <Show />}
            </button>
        </div>
    );
}