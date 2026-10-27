import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import Works from './components/Works.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip" href="#about">
        跳到正文
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
