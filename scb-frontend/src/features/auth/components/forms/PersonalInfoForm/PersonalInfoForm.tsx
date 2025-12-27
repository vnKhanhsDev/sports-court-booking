import TextField from "@/components/form/TextField/TextField";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import DobPicker from "@components/form/DatePicker/DobPicker";
import Button from "@components/ui/button/Button";

import AuthFlowHeader from "../../layouts/AuthFlowHeader";
import { useRegisterContext } from "../../../context/RegisterContext";

import useForm from "@/hooks/useForm";

export default function PersonalInfoForm() {
    const { registerOtpVerifiedUser, handlePersonalInfo, isLoading } = useRegisterContext();

    const form = useForm(
        {
            fullName: registerOtpVerifiedUser?.fullName || "",
            gender: registerOtpVerifiedUser?.gender.toLowerCase() || "",
            dob: registerOtpVerifiedUser?.dob || ""
        },
        {}
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.validateForm()) return;
        handlePersonalInfo(form.data.fullName, form.data.gender, form.data.dob);
    };

    return (
        <>
            <AuthFlowHeader title="Thông tin cá nhân" onBack={() => {}} />

            <form className="px-15 mt-8" onSubmit={handleSubmit}>
                <TextField
                    placeholder="Họ tên"
                    name="fullName"
                    value={form.data.fullName}
                    onChange={form.handleChange("fullName")}
                    error={form.errors.fullName}
                />

                <RadioGroup
                    label="Giới tính"
                    options={[
                        { label: "Nam", value: "male" },
                        { label: "Nữ", value: "female" },
                        { label: "Khác", value: "other" },
                    ]}
                    name="gender"
                    value={form.data.gender}
                    onChange={form.handleChange("gender")}
                />

                <DobPicker
                    name="dob"
                    value={form.data.dob}
                    onChange={form.handleChange("dob")}
                />

                <Button type="submit" label="tiếp theo" disabled={!form.isValid} />
            </form>

            
        </>
    );
}