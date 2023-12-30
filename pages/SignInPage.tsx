import React from 'react';
import Enregistrement from '../components/Sign_in';
import Head from "next/head"; // Adjust the path as necessary

const SignInPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Enregistrement />
    </>
  );
}
export default SignInPage;
