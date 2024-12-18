import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '@/components/Loader';
import ErrorAlert from '@/components/ErrorAlert';
import { useRouter } from 'next/router';
import LoginForm from '@/components/login/LoginForm';
import userService from '@/services/UserService';
import Link from 'next/link';
import UserManagementTable from '@/components/login/UserManagement';

const Login = () => {
  const router = useRouter();

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null)

  const checkAuth = async () => {
    try {
      if ((await userService.checkAuth()).status)
        router.push('/');
    } catch (e) {
      console.error('Something went wrong while checking authentication', e)
      throw new Error('Er ging iets mis met authenticatie te controlleren, probeer het later opnieuw')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Inloggen</title>
        <meta name="description" content="Meld je aan op Jeugdwerk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full min-h-screen p-1">
        {apiError && (
          <ErrorAlert
            message={apiError}
            onDismiss={() => setApiError('')}
            className="mb-4"
          />
        )}

        <section className="w-full max-w-xs space-y-8">
          <h1 className="text-3xl font-bold text-center text-primary-one">
            Login
          </h1>
          <LoginForm />
          <p className='text-sm text-center'>Nog geen account? <Link href="/signup" className='underline text-primary hover:text-primary/75'>Registreer hier.</Link></p>
        </section>
        <UserManagementTable />
      </main>
    </>
  );
};

export default Login;