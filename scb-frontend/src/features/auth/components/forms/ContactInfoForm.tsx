import Input from "@components/form/Input";
import Button from "@components/ui/button/Button";
import useForm from "@/hooks/useForm";
import { validateContact } from "@/utils/validate";
import styles from './AuthForm.module.css';

export default function ContactInfoForm() {
    const form = useForm(
        { contact: "" },
        { contact: validateContact }
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        console.log(form.data);
    };

    return (
        <div style={{
            width: '400px',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '4px',
        }}>
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
        </div>
    );
}