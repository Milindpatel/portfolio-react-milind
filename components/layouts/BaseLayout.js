import Head from 'next/head';
import Header from '../shared/Header';

const DESCRIPTION =
  'Milind Patel – full-stack web developer. Portfolio of work experience and a blog about programming.';

export default function BaseLayout({ className = '', children, isAuthenticated, user, isSiteOwner, canonical, headerType = 'default', title = 'Milind Patel – Portfolio' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="Milind Patel – developer and blogger" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={DESCRIPTION} />
        {canonical && <link rel="canonical" href={canonical} />}
      </Head>
      <div className="layout-container">
        <Header className={`port-nav-${headerType}`} isAuthenticated={isAuthenticated} user={user} isSiteOwner={isSiteOwner} />
        <main className={`cover ${className}`}>
          <div className="wrapper">{children}</div>
        </main>
      </div>
    </>
  );
}
