export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ""));
};

export const validateText = (text: string): boolean => {
  return text.trim().length >= 3;
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateUserForm = (data: {
  name: string;
  email: string;
  phone: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateText(data.name)) {
    errors.push({ field: "name", message: "İsim en az 3 karakter olmalıdır" });
  }

  if (!validateEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Geçerli bir email adresi giriniz",
    });
  }

  if (!validatePhone(data.phone)) {
    errors.push({
      field: "phone",
      message: "Geçerli bir telefon numarası giriniz (10 haneli)",
    });
  }

  return errors;
};

export const validateDataForm = (data: {
  title: string;
  body: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateText(data.title)) {
    errors.push({
      field: "title",
      message: "Başlık en az 3 karakter olmalıdır",
    });
  }

  if (!validateText(data.body)) {
    errors.push({
      field: "body",
      message: "Açıklama en az 3 karakter olmalıdır",
    });
  }

  return errors;
};
