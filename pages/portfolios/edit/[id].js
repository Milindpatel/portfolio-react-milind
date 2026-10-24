import { useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Row } from 'reactstrap';
import BaseLayout from '../../../components/layouts/BaseLayout';
import BasePage from '../../../components/BasePage';
import PortfolioForm from '../../../components/portfolios/PortfolioForm';
import withAuth from '../../../components/withAuth';
import { getPortfolioById, updatePortfolio } from '../../../lib/api';

function PortfolioEdit({ portfolio, auth }) {
  const router = useRouter();
  const [error, setError] = useState();

  if (!portfolio) {
    return (
      <BaseLayout {...auth}>
        <BasePage title="Portfolio not found" />
      </BaseLayout>
    );
  }

  const save = async (values, { setSubmitting }) => {
    try {
      await updatePortfolio({ ...values, _id: portfolio._id });
      router.push('/portfolios');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <BaseLayout {...auth}>
      <BasePage className="portfolio-create-page" title="Update Portfolio">
        <Row>
          <Col md="6">
            <PortfolioForm initialValues={{ ...portfolio, endDate: portfolio.endDate || null }} error={error} onSubmit={save} submitLabel="Save" />
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}

PortfolioEdit.getInitialProps = async ({ query }) => {
  try {
    return { portfolio: await getPortfolioById(query.id) };
  } catch {
    return { portfolio: null };
  }
};

export default withAuth('siteOwner')(PortfolioEdit);
