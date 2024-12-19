// pages/signup.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '@/components/Loader';
import Alert from '@/components/Alert';
import { useRouter } from 'next/router';
import SignupForm from '@/components/signup/SignupForm';
import userService from '@/services/UserService';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import useSWR from 'swr';

const Signup = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const checkAuth = async () => {
    const { status, user } = await userService.checkAuth();
    if (status && user) {
      router.push('/');
    }
    return user;
  };

  const {
    data,
    error: authError,
    isLoading
  } = useSWR('auth', checkAuth)

  if (isLoading) return <Loader />

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content={t('signup.metadata.pageDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LanguageSwitcher />

      <main className="flex flex-col items-center justify-center w-full min-h-screen p-1">
        {authError && (
          <Alert
            message={authError}
            className="mb-4"
          />
        )}
        <section className="w-full max-w-xs space-y-8">
          <h1 className="text-3xl font-bold text-center text-primary-one">
            {t('signup.title')}
          </h1>
          <SignupForm />
          <p className='text-sm text-center'>
            {t('signup.haveAccount')} <Link href="/login?status=notLoggedIn" className='underline text-primary hover:text-primary/75'>{t('signup.loginHere')}</Link>
          </p>
        </section>
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

export default Signup;