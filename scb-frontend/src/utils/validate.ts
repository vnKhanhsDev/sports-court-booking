const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+84|0)\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export type ValidateResult = {
    valid: boolean;
    error: string;
};

const valid = (): ValidateResult => ({ valid: true, error: '' });
const invalid = (error: string): ValidateResult => ({ valid: false, error });

export function validateContact(contact: string): ValidateResult {
    if (!contact)
        return invalid('Vui lòng nhập email hoặc số điện thoại');
    if (!EMAIL_REGEX.test(contact) && !PHONE_REGEX.test(contact))
        return invalid('Email/Số điện thoại không hợp lệ');
    return valid();
};

export function validateCreationPassword(password: string): ValidateResult {
    if (!password)
        return invalid("Vui lòng nhập mật khẩu");
    if (!PASSWORD_REGEX.test(password))
        return invalid("Mật khẩu không đạt yêu cầu bảo mật");
    return valid();
};