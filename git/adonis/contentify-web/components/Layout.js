import Nav from './Nav'
import Footer from './Footer'
import Styles from '../styles/Layout.module.css'

const Layout = ({children}) => {
  return (
    <div>
    <Nav />  
      <main className={Styles.container}>{children}</main>
    <Footer />
    </div>
  )
}

export default Layout

