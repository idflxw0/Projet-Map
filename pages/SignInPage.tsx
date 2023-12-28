import React from 'react';
import Enregistrement from '../components/Sign_in';
import Head from "next/head"; // Adjust the path as necessary

const SignInPage = () => {
  return (
    <>
      <Head>
        <title>Commute?</title>
      </Head>
      <Enregistrement />
    </>
  );
}
export default SignInPage;
