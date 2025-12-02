import { useCallback, useMemo, useState } from "react";

interface ValidationResult {
    valid: boolean;
    error: string;
}

type Validators<T> = Partial<Record<keyof T, (value: T[keyof T]) => ValidationResult>>;
type FormErrors<T> = Partial<Record<keyof T, string | undefined>>;

export default function useForm<T extends Record<string, any>>(
    initialData: T, validators: Validators<T>
) {
    const [data, setData] = useState<T>(initialData);
    const [clientErrors, setClientErrors] = useState<FormErrors<T>>({});
    const [apiErrors, setApiErrors] = useState<FormErrors<T>>({});

    const errors = useMemo(() => (
        { ...apiErrors, ...clientErrors }
    ), [apiErrors, clientErrors]);

    const validateField = useCallback(
        (name: keyof T, value: T[keyof T]): ValidationResult => {
            const validator = validators[name];
            return !validator ? { valid: true, error: '' } : validator(value);
        },
        [validators]
    );

    const handleChange = useCallback((name: keyof T) => (value: T[keyof T]) => {
        setData(prev => ({ ...prev, [name]: value }));

        setApiErrors(prev => ({ ...prev, [name]: undefined }));

        const validateResult = validateField(name, value);
        setClientErrors(prev => ({ ...prev, [name]: validateResult.error }));
    }, [validateField]);

    const validateForm = useCallback(() => {
        const newClientErrors: FormErrors<T> = {};

        (Object.keys(data) as Array<keyof T>).forEach(name => {
            const validateResult = validateField(name, data[name]);
            if (!validateResult.valid) newClientErrors[name] = validateResult.error;
        });

        setClientErrors(newClientErrors);
        return Object.keys(newClientErrors).length === 0;
    }, [data, validateField]);

    const resetForm = useCallback(() => {
        setData(initialData);
        setClientErrors({});
        setApiErrors({});
    }, [initialData]);

    const setFormData = useCallback((newData: T) => {
        setData(newData);
        setClientErrors({});
        setApiErrors({});
    }, []);

    const isValid = useMemo(() => {
        const hasClientErrors = Object.values(clientErrors).some(error => Boolean(error));
        const hasApiErrors = Object.values(apiErrors).some(error => Boolean(error));

        const allFieldsFilled = Object.values(data).every(value => Boolean(value));

        return allFieldsFilled && !hasClientErrors && !hasApiErrors;
    }, [clientErrors, apiErrors, data]);

    return {
        data,
        clientErrors,
        apiErrors,
        errors,
        setApiErrors,
        handleChange,
        validateForm,
        resetForm,
        setFormData,
        isValid
    }
}