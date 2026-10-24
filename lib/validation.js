/** Client-side checks for the portfolio form. The API validates again with Mongoose. */
const REQUIRED = ['title', 'company', 'location', 'position', 'description', 'startDate'];

export function validatePortfolio(values) {
  const errors = {};
  for (const key of REQUIRED) {
    if (!values[key] || (typeof values[key] === 'string' && !values[key].trim())) {
      errors[key] = `${key[0].toUpperCase()}${key.slice(1)} is required`;
    }
  }
  if (values.startDate && values.endDate && new Date(values.endDate) < new Date(values.startDate)) {
    errors.endDate = 'End date cannot be before start date';
  }
  return errors;
}
