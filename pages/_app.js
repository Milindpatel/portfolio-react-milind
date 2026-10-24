import App from 'next/app';
import { ToastContainer } from 'react-toastify';
import { clientAuth, isSiteOwner, serverAuth } from '../lib/auth0';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';

export default function MyApp({ Component, pageProps, auth }) {
  return (
    <>
      <ToastContainer />
      <Component {...pageProps} auth={auth} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const user = typeof window === 'undefined' ? await serverAuth(ctx.req) : await clientAuth();
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, auth: { user: user || null, isAuthenticated: !!user, isSiteOwner: isSiteOwner(user) } };
};
