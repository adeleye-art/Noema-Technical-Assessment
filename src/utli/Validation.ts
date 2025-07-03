import { OPEC_COUNTRIES } from "./constant";
import { FormData } from "./types/FromTypes";

export type FormError = Partial<Record<keyof FormData, string>>;



export function validateForm(formData: FormData): FormError {
  const errors: FormError = {};

  const {
    name,
    country,
    projectCode,
    description,
    startDate,
    endDate,
    amount,
    currency,
  } = formData;

  // Helper
  const isEmpty = (value: string | undefined) =>
    !value || value.trim() === "";

  // 1. Basic required field checks
  if (isEmpty(name)) errors.name = "Name is required";
  if (isEmpty(country)) errors.country = "Country is required";
  if (isEmpty(description)) errors.description = "Description is required";
  if (isEmpty(startDate)) errors.startDate = "Start Date is required";
  if (isEmpty(endDate)) errors.endDate = "End Date is required";
  if (isEmpty(amount)) errors.amount = "Amount is required";
  if (isEmpty(currency)) errors.currency = "Currency is required";

  // 2. Project code format
  if (!isEmpty(projectCode)) {
    const projectCodeRegex = /^[A-Z]{4}-[1-9]{4}$/;
    if (!projectCodeRegex.test(projectCode)) {
      errors.projectCode =
        "Project code must be in format ABCD-1234 with no zeros";
    }
  } else {
    errors.projectCode = "Project code is required";
  }

  // 3. Currency logic for OPEC countries
  if (!isEmpty(country) && !isEmpty(currency)) {
    const isOpec = OPEC_COUNTRIES.includes(country);
    
    if (isOpec) {
      // Check if currency contains "US Dollar" or "United States Dollar" (case insensitive)
      const isUSD = currency.toLowerCase().includes('us dollar') || 
                    currency.toLowerCase().includes('united states dollar');
      
      if (!isUSD) {
        errors.currency = `Currency must be USD for ${country} (OPEC member)`;
      }
    }
  }

  // 4. Date logic
  const today = new Date();
  const minStart = new Date(today);
  minStart.setDate(today.getDate() + 15);
  minStart.setHours(0, 0, 0, 0);


  const parsedStart = new Date(startDate);
  parsedStart.setHours(0, 0, 0, 0); 
  const parsedEnd = new Date(endDate);

  const validStart = !isNaN(parsedStart.getTime());
  const validEnd = !isNaN(parsedEnd.getTime());

  if (validStart) {
  if (parsedStart < minStart) {
    errors.startDate = "Start date must be at least 15 days from today";
  } else if (validEnd) {
    const minEnd = new Date(parsedStart);
    const maxEnd = new Date(parsedStart);
    minEnd.setFullYear(parsedStart.getFullYear() + 1);
    maxEnd.setFullYear(parsedStart.getFullYear() + 3);

    if (parsedEnd < minEnd || parsedEnd > maxEnd) {
      errors.endDate =
        "End date must be between 1 and 3 years from the start date";
    }
  }
}

  return errors;
}
