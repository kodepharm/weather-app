import Link from 'next/link'
import Styles from '../styles/Layout.module.css'

const Nav = () => {
  return (
    <div className={Styles.nav}>
           <Link href='/'>Home</Link> 
           <Link href='/home/about_page'><a>About</a></Link> 
           <Link href='/account/registerComponent'><a>Register</a></Link> 
           <Link href='/account/login'><a>Login</a></Link> 
    </div>
  )
}

export default Nav