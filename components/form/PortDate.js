import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, FormGroup, Label } from 'reactstrap';

/** Month/year picker for Formik. With `canBeDisabled`, the date can be cleared ("still working here"). */
export default function PortDate({ canBeDisabled, label, field, form }) {
  const { setFieldValue, setFieldTouched, touched, errors } = form;
  const [lastDate, setLastDate] = useState(field.value ? new Date(field.value) : new Date());
  const isHidden = canBeDisabled && !field.value;

  const setDate = (date) => {
    setFieldValue(field.name, date, true);
    setFieldTouched(field.name, true, false);
    if (date) setLastDate(date);
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      {!isHidden && (
        <div className="input-group">
          <DatePicker
            selected={field.value ? new Date(field.value) : null}
            onChange={setDate}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            maxDate={new Date()}
            className="form-control"
            ariaLabelledBy={label}
          />
        </div>
      )}
      {canBeDisabled && !isHidden && (
        <Button className="mt-2" size="sm" onClick={() => setDate(null)}>
          Still working here
        </Button>
      )}
      {canBeDisabled && isHidden && (
        <div>
          <span className="me-2">Still working here</span>
          <Button size="sm" onClick={() => setDate(lastDate)}>
            Set end date
          </Button>
        </div>
      )}
      {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </FormGroup>
  );
}
