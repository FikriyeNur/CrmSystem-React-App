import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Home: React.FC = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Welcome to CrmSystem</h1>
          <p>This is a simple CRM system frontend demo using React and Bootstrap.</p>
          <Button variant="primary" href="/customers">Go to Customers</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
