import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '@/components/Loader';
import ErrorAlert from '@/components/ErrorAlert';
import { useRouter } from 'next/router';
import LoginForm from '@/components/login/LoginForm';
import userService from '@/services/UserService';
import Link from 'next/link';
import UserManagementTable from '@/components/login/UserManagement';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import LanguageSwitcher from '@/components/language/LanguageSwitcher';

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null)

  const checkAuth = async () => {
    try {
      if ((await userService.checkAuth()).status)
        router.push('/');
    } catch (e) {
      console.error('Something went wrong while checking authentication', e)
      throw new Error(t('errorMessages.authenticationError'))
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
        <title>{t('login.metadata.pageTitle')}</title>
        <meta name="description" content={t('login.metadata.pageDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LanguageSwitcher />

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
            {t('login.title')}
          </h1>
          <LoginForm />
          <p className='text-sm text-center'>
            {t('login.noAccount')} <Link href="/signup" className='underline text-primary hover:text-primary/75'>{t('login.registerHere')}</Link>
          </p>
        </section>
        <UserManagementTable />
      </main>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "nl", ["common"]))
    }
  }
}

export default Login;