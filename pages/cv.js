import { Col, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayout';
import BasePage from '../components/BasePage';
import config from '../lib/config';

export default function Cv({ auth }) {
  return (
    <BaseLayout title="Milind Patel – CV" {...auth}>
      <BasePage title="Preview of my CV" className="cv-page">
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            {config.cvUrl ? (
              <>
                <div className="cv-title">
                  <a download className="btn btn-success" href={config.cvUrl}>Download</a>
                </div>
                <iframe title="CV" style={{ width: '100%', height: '800px' }} src={config.cvUrl} />
              </>
            ) : (
              <p>
                My CV is available on request. In the meantime, have a look at my{' '}
                <a href="/portfolios">work history</a> and <a href="https://github.com/Milindpatel">GitHub</a>.
              </p>
            )}
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}
