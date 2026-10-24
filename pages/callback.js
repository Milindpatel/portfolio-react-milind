import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import BaseLayout from '../components/layouts/BaseLayout';
import BasePage from '../components/BasePage';
import { handleAuthentication } from '../lib/auth0';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    handleAuthentication()
      .catch(() => toast.error('Login failed, please try again.'))
      .finally(() => router.replace('/'));
  }, [router]);

  return (
    <BaseLayout>
      <BasePage>
        <h1>Verifying login data...</h1>
      </BasePage>
    </BaseLayout>
  );
}
