import { FormGroup, Input, Label } from 'reactstrap';

/** Formik field rendered as a Bootstrap input with its validation message. */
export default function PortInput({ label, type, field, form: { touched, errors }, ...props }) {
  const id = `field-${field.name}`;
  return (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <Input id={id} type={type} {...field} {...props} invalid={!!(touched[field.name] && errors[field.name])} />
      {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </FormGroup>
  );
}
