import BaseLayout from './layouts/BaseLayout';
import BasePage from './BasePage';
import config from '../lib/config';

/**
 * Wraps a page so it only renders for logged-in users (and, if `role` is
 * given, only for users with that role). The API enforces the same rules.
 */
export default function withAuth(role) {
  return function wrap(Page) {
    function Protected(props) {
      const { isAuthenticated, user } = props.auth || {};
      const userRole = user && user[`${config.namespace}/role`];

      let message;
      if (!isAuthenticated) message = 'You are not logged in. Please log in to access this page.';
      else if (role && userRole !== role) message = "You don't have permission to view this page.";

      if (message) {
        return (
          <BaseLayout {...props.auth}>
            <BasePage>
              <h1>{message}</h1>
            </BasePage>
          </BaseLayout>
        );
      }
      return <Page {...props} />;
    }

    Protected.getInitialProps = Page.getInitialProps;
    return Protected;
  };
}
