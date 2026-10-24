import Link from 'next/link';
import { useRouter } from 'next/router';
import { Col, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import PortButtonDropdown from '../../components/ButtonDropdown';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import withAuth from '../../components/withAuth';
import { deleteBlog, getUserBlogs, updateBlog } from '../../lib/api';

function UserBlogs({ blogs, auth }) {
  const router = useRouter();
  const refresh = () => router.replace(router.asPath);

  const changeStatus = async (status, id) => {
    try {
      await updateBlog({ status }, id);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteBlog(id);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const options = (blog) => {
    const next = blog.status === 'draft' ? { text: 'Publish Story', value: 'published' } : { text: 'Make a Draft', value: 'draft' };
    return [
      { text: next.text, handlers: { onClick: () => changeStatus(next.value, blog._id) } },
      { text: 'Delete', handlers: { onClick: () => remove(blog._id) } },
    ];
  };

  const renderList = (list) => (
    <ul className="user-blogs-list">
      {list.map((blog) => (
        <li key={blog._id}>
          <Link href={`/blogs/edit/${blog._id}`}>{blog.title}</Link>
          <PortButtonDropdown items={options(blog)} />
        </li>
      ))}
    </ul>
  );

  const published = blogs.filter((b) => b.status === 'published');
  const drafts = blogs.filter((b) => b.status !== 'published');

  return (
    <BaseLayout {...auth} headerType="landing" title="Blogs Dashboard">
      <div className="masthead" style={{ backgroundImage: "url('/images/home-bg.jpg')" }}>
        <div className="overlay" />
        <Container>
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto">
              <div className="site-heading">
                <h1>Blogs Dashboard</h1>
                <span className="subheading">
                  Let&apos;s write a nice blog today{' '}
                  <Link href="/blogs/new" className="btn btn-primary">Create a new Blog</Link>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <BasePage className="blog-user-page">
        <Row>
          <Col md="6" className="mx-auto text-center">
            <h2 className="blog-status-title">Published Blogs</h2>
            {renderList(published)}
          </Col>
          <Col md="6" className="mx-auto text-center">
            <h2 className="blog-status-title">Draft Blogs</h2>
            {renderList(drafts)}
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}

UserBlogs.getInitialProps = async ({ req }) => {
  try {
    return { blogs: await getUserBlogs(req) };
  } catch {
    return { blogs: [] };
  }
};

export default withAuth('siteOwner')(UserBlogs);
