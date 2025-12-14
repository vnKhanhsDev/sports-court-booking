// 1. Frameworks & Libraries
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. External Components
import { TextField, PasswordField } from '@components/form';
import Button from '@components/ui/button/Button';

import useForm from '@/hooks/useForm';
import { validateContact } from '@/utils/validate';
import { ROUTES } from '@/constants/route';
import { type UserRole } from '@/types/user.types';

// 3. Internal Components
import type { LoginData } from '../../types/auth.types';
import AuthFormFooter from '../ui/AuthFormFooter';

// 4. Styles
import styles from './AuthForm.module.css';

interface LoginFormProps {
    role: UserRole;
    onSubmit: (data: LoginData) => Promise<void>;
    apiError: any;
    isLoading?: boolean;
}

export default function LoginForm({
    role,
    onSubmit,
    apiError,
    isLoading = false,
}: LoginFormProps) {
    const navigate = useNavigate();

    const form = useForm(
        { contact: "", password: "" },
        { contact: validateContact }
    );

    useEffect(() => {
        if (apiError && Object.keys(apiError).length > 0) {
            form.setApiErrors(apiError);
        }
    }, [apiError])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        await onSubmit({ ...form.data, role });
    };

    return (
        <div className={`${styles.authForm} ${styles.authSideForm}`}>
            <form onSubmit={handleSubmit}>
                <TextField
                    placeholder="Email hoặc số điện thoại"
                    name="contact"
                    value={form.data.contact}
                    onChange={form.handleChange("contact")}
                    error={form.errors.contact}
                />

                <PasswordField
                    type="password"
                    placeholder="Mật khẩu"                
                    name="password"
                    value={form.data.password}
                    onChange={form.handleChange("password")}
                    error={form.errors.password}
                />

                <Button
                    type="submit"
                    label="đăng nhập"
                    disabled={!form.isValid || isLoading}
                    className={styles.submitBtn}
                />
            </form>

            <AuthFormFooter
                type="login"
                onForgotPassword={() => navigate(ROUTES.AUTH.getForgotPassword(role))}
                onGoogleClick={() => console.log('google click')}
                onFacebookClick={() => console.log('facebook click')}
                onNavigateToRegister={() => navigate(ROUTES.AUTH.getRegister(role))}
            />
        </div>
    );
}