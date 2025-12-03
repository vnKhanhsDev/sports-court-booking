import Input from '@components/form/Input';
import Button from '@components/ui/button/Button';
import AuthFormFooter from '../ui/AuthFormFooter';
import useForm from '@/hooks/useForm';
import { validateContact } from '@/utils/validate';
import { ROUTES } from '@/constants/route';
import styles from './AuthForm.module.css';
import { type UserRole } from '@/types/user.types';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ role }: { role: UserRole }) {
    const navigate = useNavigate();

    const form = useForm(
        { contact: "", password: "" },
        { contact: validateContact }
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        console.log(form.data);
    };

    return (
        <div className={`${styles.authForm} ${styles.authSideForm}`}>
            <form onSubmit={handleSubmit}>
                <Input
                    placeholder="Email hoặc số điện thoại"
                    name="contact"
                    value={form.data.contact}
                    onChange={form.handleChange("contact")}
                    error={form.errors.contact}
                />

                <Input
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
                    disabled={!form.isValid}
                    className={styles.submitBtn}
                />
            </form>

            <AuthFormFooter
                type="login"
                onForgotPassword={() => navigate(ROUTES.AUTH.getForgotPassword(role))}
                onGoogleClick={() => {}}
                onFacebookClick={() => {}}
                onNavigateToRegister={() => navigate(ROUTES.AUTH.getRegister(role))}
            />
        </div>
    );
}