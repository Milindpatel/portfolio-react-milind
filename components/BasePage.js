import { Container } from 'reactstrap';

export default function BasePage({ className = '', title, containerClass = '', children }) {
  return (
    <div className={`base-page ${className}`}>
      <Container className={containerClass}>
        {title && (
          <div className="page-header">
            <h1 className="page-header-title">{title}</h1>
          </div>
        )}
        {children}
      </Container>
    </div>
  );
}
