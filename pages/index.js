import { useEffect, useState } from 'react';
import { ReactTyped } from 'react-typed';
import { Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayout';

const ROLES = ['Developer', 'Tech Lover', 'Team Player', '.NET', 'React.js', 'Angular'];

export default function Index({ auth }) {
  const { isAuthenticated, user } = auth;
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setIsFlipping((f) => !f), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BaseLayout className={`cover ${isFlipping ? 'cover-1' : 'cover-0'}`} {...auth} headerType="index" title="Milind Patel – Portfolio">
      <div className="main-section">
        <div className="background-image">
          <img src="/images/background-index.png" alt="" />
        </div>
        <Container>
          <Row>
            <Col md="6">
              <div className="hero-section">
                <div className={`flipper ${isFlipping ? 'isFlipping' : ''}`}>
                  <div className="front">
                    <div className="hero-section-content">
                      <h2>Full Stack Web Developer</h2>
                      <div className="hero-section-content-intro">Have a look at my portfolio and job history.</div>
                    </div>
                    <img alt="Illustration of a developer at a desk" className="image" src="/images/section-1.jpg" />
                    <div className="shadow-custom"><div className="shadow-inner" /></div>
                  </div>
                  <div className="back">
                    <div className="hero-section-content">
                      <h2>Get Your Projects Done</h2>
                      <div className="hero-section-content-intro">Professional, high quality web development.</div>
                    </div>
                    <img alt="Illustration of a developer at a desk" className="image" src="/images/section-2.jpg" />
                    <div className="shadow-custom shadow-custom-2"><div className="shadow-inner" /></div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md="6" className="hero-welcome-wrapper">
              <div className="hero-welcome-text">
                <h1>
                  {isAuthenticated && <b>{user.name} </b>}
                  Welcome to the portfolio website of Milind Patel. Get informed, collaborate and discover projects I have
                  worked on over the years!
                </h1>
              </div>
              <ReactTyped loop typeSpeed={60} backSpeed={60} strings={ROLES} backDelay={1000} showCursor className="self-typed" cursorChar="|" />
              <div className="hero-welcome-bio">
                <h2>Let&apos;s take a look at my work.</h2>
              </div>
            </Col>
          </Row>
        </Container>
        <span className="service-link">
          Vector illustration credit: <a href="https://www.vecteezy.com/">vecteezy.com</a>
        </span>
      </div>
    </BaseLayout>
  );
}
