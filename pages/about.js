import { Col, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayout';
import BasePage from '../components/BasePage';

export default function About({ auth }) {
  return (
    <BaseLayout title="Milind Patel – About Me" {...auth}>
      <BasePage className="about-page">
        <Row className="mt-5">
          <Col md="6">
            <div className="left-side">
              <h1 className="title fadein">Hello, welcome</h1>
              <h4 className="subtitle fadein">To the about page</h4>
              <p className="subsubTitle fadein">Here is a short description about me.</p>
            </div>
          </Col>
          <Col md="6">
            <div className="fadein">
              <p>My name is Milind Patel and I am a full-stack web developer.</p>
              <p>
                I build web applications end to end: APIs and databases with .NET and Node.js, and front ends with
                Angular and React.
              </p>
              <p>
                Browse my <a href="/portfolios">work history</a>, read the <a href="/blogs">blog</a>, or see more of
                my projects on <a href="https://github.com/Milindpatel">GitHub</a>.
              </p>
            </div>
          </Col>
        </Row>
      </BasePage>
    </BaseLayout>
  );
}
