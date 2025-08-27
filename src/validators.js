import commonValidator from "./commonValidator";

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email không được bỏ trống';
    }
    if (email.length > 254) {
        return 'Email không được vượt quá 254 ký tự';
    }
    if (!emailRegex.test(email)) {
        return 'Vui lòng nhập địa chỉ email hợp lệ';
    }
    return '';
};


export const validatePassword = (password) => {
    if (!password) {
        return 'Mật khẩu là bắt buộc';
    }
    if (password.length < 8) {
        return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
};

export const validateFullName = (fullName) => {
    // if (![...fullName].every((char) => /^[\p{L}\s]+$/u.test(char))) {
    //     return 'Full name must contain only letters';
    // }
    fullName = fullName.trim().replace(/\s+/g, ' ');
    if (!fullName) {
        return 'Full name is required';
    }
    if (!/^[\p{L}\s]+$/u.test(fullName)) {
        return 'Full name must contain only letters and spaces';
    }
    const validatedLength = commonValidator.validateStringLengthRange(fullName, 2, 50);
    if (!validatedLength) {
        return 'Full name must be at least 2 characters long and not exceed 50 characters';
    }
    return '';
};

export const validatePhone = (phone) => {
    const phoneRegex = /^(0)\d{9}$/;
    if (!phone) {
        return 'Số điện thoại là bắt buộc';
    }
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        return 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)';
    }
    return '';
};


export const validateDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) {
        return '';
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 13) {
        return 'You must be at least 13 years old';
    }
    if (age > 120) {
        return 'Please enter a valid date of birth';
    }

    return '';
};


export const validateRegisterForm = (formData) => {
    const errors = {};

    errors.fullName = validateFullName(formData.full_name);
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    errors.phone = validatePhone(formData.phone);
    errors.dateOfBirth = validateDateOfBirth(formData.date_of_birth);


    Object.keys(errors).forEach(key => {
        if (!errors[key]) {
            delete errors[key];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


export const validateLoginForm = (formData) => {
    const errors = {};

    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);


    Object.keys(errors).forEach(key => {
        if (!errors[key]) {
            delete errors[key];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};