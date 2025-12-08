import { useNavigate } from "react-router-dom";
import Input from "@components/form/Input";
import Button from "@components/ui/button/Button";
import AuthFormFooter from "../ui/AuthFormFooter";
import useForm from "@/hooks/useForm";
import { validateContact } from "@/utils/validate";
import { ROUTES } from "@/constants/route";
import { type UserRole } from "@/types/user.types";
import styles from './AuthForm.module.css';
import { useEffect } from "react";
import { useRegisterContext } from "../../context/RegisterContext";

export default function ContactInfoForm({ role }: { role: UserRole }) {
    const { initFlow, isLoading, apiErrors } = useRegisterContext();
    const navigate = useNavigate();

    const form = useForm(
        { contact: "" },
        { contact: validateContact }
    );

    useEffect(() => {
        if (apiErrors && Object.keys(apiErrors).length > 0) {
            form.setApiErrors(apiErrors);
        }
    }, [apiErrors])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        await initFlow(form.data.contact, role);
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

                <Button
                    type="submit"
                    label="tiếp theo"
                    disabled={!form.isValid}
                    className={styles.submitBtn}
                />
            </form>

            <AuthFormFooter
                type="register"
                onGoogleClick={() => {}}
                onFacebookClick={() => {}}
                onNavigateToLogin={() => navigate(ROUTES.AUTH.getLogin(role))}
            />
        </div>
    );
}