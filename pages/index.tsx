import type { NextPage, GetServerSideProps } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React, { useState } from 'react';
import Link from 'next/link'



export const getServerSideProps: GetServerSideProps = async (context) => {


  return {
    props: {
        results: [1,2,3],
    },
  };
}

const Home: NextPage = () => {

  const [count, setCount] = useState(0);
  // setCount(count +1 )
  return (
    <nav>
      <Link href="/about">
        <a className="text-red-500">Click here to go to about page</a>
      </Link>
    </nav>
  )
}

export default Home
