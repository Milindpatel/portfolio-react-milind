import Link from 'next/link';
import { Col, Container, Row } from 'reactstrap';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import { getBlogs } from '../../lib/api';
import { formatLongDate, shortenText } from '../../lib/utils';

export default function Blogs({ blogs, auth }) {
  return (
    <BaseLayout {...auth} headerType="landing" className="blog-listing-page" title="Milind Patel – Blog">
      <div className="masthead" style={{ backgroundImage: "url('/images/home-bg.jpg')" }}>
        <div className="overlay" />
        <Container>
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto">
              <div className="site-heading">
                <h1>Fresh Blogs</h1>
                <span className="subheading">Programming, travelling...</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <BasePage className="blog-body">
        <Row>
          <Col md="10" lg="8" className="mx-auto">
            {blogs.length === 0 && <p>No posts yet. Check back soon!</p>}
            {blogs.map((blog) => (
              <div key={blog._id} className="post-preview">
                <Link href={`/blogs/${blog.slug}`}>
                  <h2 className="post-title">{blog.title}</h2>
                  <h3 className="post-subtitle">{shortenText(blog.subTitle)}</h3>
                </Link>
                <p className="post-meta">
                  Posted by {blog.author} on {formatLongDate(blog.createdAt)}
                </p>
              </div>
            ))}
          </Col>
        </Row>
        <footer>
          <Container>
            <Row>
              <div className="col-lg-8 col-md-10 mx-auto text-center">
                <a target="_blank" rel="noreferrer" href="https://github.com/Milindpatel">GitHub</a>
                <p className="copyright text-muted">Copyright &copy; Milind Patel {new Date().getFullYear()}</p>
              </div>
            </Row>
          </Container>
        </footer>
      </BasePage>
    </BaseLayout>
  );
}

Blogs.getInitialProps = async () => {
  try {
    return { blogs: await getBlogs() };
  } catch (err) {
    console.error(err.message);
    return { blogs: [] };
  }
};
