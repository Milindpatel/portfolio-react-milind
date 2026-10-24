import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import PortfolioCard from '../../components/portfolios/PortfolioCard';
import { deletePortfolio, getPortfolios } from '../../lib/api';

export default function Portfolios({ portfolios, auth }) {
  const router = useRouter();
  const canEdit = auth.isAuthenticated && auth.isSiteOwner;

  const onDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    try {
      await deletePortfolio(id);
      router.replace(router.asPath);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <BaseLayout title="Milind Patel – Work Experience" {...auth}>
      <BasePage className="portfolio-page" title="Portfolios">
        {canEdit && (
          <Link href="/portfolios/new" className="btn btn-success create-port-btn">Create Portfolio</Link>
        )}
        {portfolios.length === 0 && <p>No portfolio entries yet.</p>}
        <Row>
          {portfolios.map((portfolio) => (
            <Col key={portfolio._id} md="4">
              <PortfolioCard portfolio={portfolio}>
                {canEdit && (
                  <>
                    <Button color="warning" onClick={(e) => { e.stopPropagation(); router.push(`/portfolios/edit/${portfolio._id}`); }}>
                      Edit
                    </Button>{' '}
                    <Button color="danger" onClick={(e) => onDelete(portfolio._id, e)}>Delete</Button>
                  </>
                )}
              </PortfolioCard>
            </Col>
          ))}
        </Row>
      </BasePage>
    </BaseLayout>
  );
}

Portfolios.getInitialProps = async () => {
  try {
    return { portfolios: await getPortfolios() };
  } catch (err) {
    console.error(err.message);
    return { portfolios: [] };
  }
};
