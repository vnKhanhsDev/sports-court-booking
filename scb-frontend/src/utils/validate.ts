const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+84|0)\d{9}$/;

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