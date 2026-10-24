import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { formatMonthYear } from '../../lib/utils';

function PortfolioDetail({ portfolio, isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{portfolio.title}</ModalHeader>
      <ModalBody>
        <p><b>Description: </b>{portfolio.description}</p>
        <p><b>Company: </b>{portfolio.company}</p>
        <p><b>Position: </b>{portfolio.position}</p>
        <p><b>Location: </b>{portfolio.location}</p>
        <p><b>Start date: </b>{formatMonthYear(portfolio.startDate)}</p>
        <p><b>End date: </b>{portfolio.endDate ? formatMonthYear(portfolio.endDate) : 'Still working here'}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

export default function PortfolioCard({ portfolio, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <PortfolioDetail portfolio={portfolio} isOpen={isOpen} toggle={toggle} />
      <Card className="portfolio-card" role="button" tabIndex={0} onClick={toggle}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}>
        <CardHeader className="portfolio-card-header">{portfolio.position}</CardHeader>
        <CardBody>
          <p className="portfolio-card-city">{portfolio.location}</p>
          <CardTitle tag="h5" className="portfolio-card-title">{portfolio.title}</CardTitle>
          <CardText className="portfolio-card-text">{portfolio.description}</CardText>
          <div className="readMore">{children}</div>
        </CardBody>
      </Card>
    </>
  );
}
