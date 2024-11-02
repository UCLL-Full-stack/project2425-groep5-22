import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="Spel Aanmaken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen w-full flex justify-center items-center">
        <article className='flex flex-col items-center gap-2'>
          <h1 className='text-2xl font-bold'>Jeugdwerk</h1>
          <p>Voor Testing Purposes is er een vaste gebruiker ingesteld, deze gebruiker is:</p>
          <ul>
            <li><span className='font-bold'>Naam:</span> John Doe</li>
            <li><span className='font-bold'>E-mail:</span> john@jeugdwerk.org</li>
            <li><span className='font-bold'>Password:</span> password123</li>
          </ul>
          <Link href="/spel/aanmaken">
            <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center gap-2'>
              Spel Aanmaken
            </button>
          </Link>
        </article>
      </main>
    </>
  );
};

export default Home;