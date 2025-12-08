import PasswordField from "@/components/form/TextField/PasswordField";
import Button from "@/components/ui/button/Button";

import useForm from "@/hooks/useForm";
import { validateCreationPassword } from "@/utils/validate";

import { useRegisterContext } from "../../../context/RegisterContext";

import AuthFlowHeader from "../../layouts/AuthFlowHeader";

export default function CreatePasswordForm() {
    const { handleCreatePassword, isLoading } = useRegisterContext();

    const form = useForm(
        { password: "", confirmPassword: "" },
        {
            password: validateCreationPassword,
            confirmPassword: (value) => {
                if (!value) return { valid: false, error: "Vui lòng nhập xác nhận mật khẩu" };
                if (value !== form.data.password) return { valid: false, error: "Mật khẩu không trùng khớp" };
                return { valid: true, error: "" };
            }
        }
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        handleCreatePassword(form.data.password);
    };

    return (
        <>
            <AuthFlowHeader title="Tạo mật khẩu" onBack={() => {}} />
            
            <form className="px-15 mt-8" onSubmit={handleSubmit}>
                <PasswordField
                    placeholder="Mật khẩu"
                    name="password"
                    value={form.data.password}
                    onChange={form.handleChange("password")}
                    error={form.errors.password}
                />
                <PasswordField
                    placeholder="Xác nhận mật khẩu"
                    name="confirmPassword"
                    value={form.data.confirmPassword}
                    onChange={form.handleChange("confirmPassword")}
                    error={form.errors.confirmPassword}
                />

                <Button
                    type="submit"
                    label="tiếp theo"
                    disabled={!form.isValid || isLoading}
                />
            </form>
        </>
    );
}