import Head from 'next/head'
import axios from 'axios';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import Homer from './home/home_page'
import LoginComponent from './account/login';

const Home = () => {
  const router = useRouter();
  const goToRegister = () => {
    router.push('/account/registerComponent');
  }
  return (
    <div>
      <Head>
        <title>Contentifyy</title>
      </Head>
      <Homer />
        
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  let user = null;

  if (cookies?.jwt) {
    try {
      const { data } = await axios.get('http://localhost:3333', {
        headers: {
          Authorization:
            `Bearer ${cookies.jwt}`,
          },
      });
      user = data;
    } catch (e) {
      console.log(e);
    }
  }

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile'
      }
    }
  }

  return {
    props: {}
  }
}

export default Home;