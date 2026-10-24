import { useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Row } from 'reactstrap';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import PortfolioForm from '../../components/portfolios/PortfolioForm';
import withAuth from '../../components/withAuth';
import { createPortfolio } from '../../lib/api';

const INITIAL_VALUES = { title: '', company: '', location: '', position: '', description: '', startDate: new Date(), endDate: null };

function PortfolioNew({ auth }) {
  const router = useRouter();
  const [error, setError] = useState();

  const save = async (values, { setSubmitting }) => {
    try {
      await createPortfolio(values);
      router.push('/portfolios');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <BaseLayout {...auth}>
      <BasePage className="portfolio-create-page" title="Create New Portfolio">
        <Row>
          <Col md="6">
            <PortfolioForm initialValues={INITIAL_VALUES} error={error} onSubmit={save} />
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}

export default withAuth('siteOwner')(PortfolioNew);
