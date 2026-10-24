import { Col, Row } from 'reactstrap';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import { getBlogBySlug } from '../../lib/api';

export default function BlogDetail({ blog, auth }) {
  if (!blog) {
    return (
      <BaseLayout {...auth}>
        <BasePage title="Post not found" />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout {...auth} title={`${blog.title} – Milind Patel`}>
      <BasePage className="blog-detail-page">
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            {/* Stories are sanitized on the server before they are saved. */}
            <div dangerouslySetInnerHTML={{ __html: blog.story }} />
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}

BlogDetail.getInitialProps = async ({ query, res }) => {
  try {
    return { blog: await getBlogBySlug(query.slug) };
  } catch {
    if (res) res.statusCode = 404;
    return { blog: null };
  }
};
