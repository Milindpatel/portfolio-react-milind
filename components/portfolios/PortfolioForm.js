import { Field, Form, Formik } from 'formik';
import { Alert, Button } from 'reactstrap';
import PortDate from '../form/PortDate';
import PortInput from '../form/PortInput';
import { validatePortfolio } from '../../lib/validation';


export default function PortfolioForm({ initialValues, onSubmit, error, submitLabel = 'Create' }) {
  return (
    <Formik initialValues={initialValues} validate={validatePortfolio} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="title" label="Title" component={PortInput} />
          <Field type="text" name="company" label="Company" component={PortInput} />
          <Field type="text" name="location" label="Location" component={PortInput} />
          <Field type="text" name="position" label="Position" component={PortInput} />
          <Field type="textarea" name="description" label="Description" component={PortInput} />
          <Field name="startDate" label="Start date" component={PortDate} />
          <Field name="endDate" label="End date" canBeDisabled component={PortDate} />
          {error && <Alert color="danger">{error}</Alert>}
          <Button color="success" size="lg" type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
