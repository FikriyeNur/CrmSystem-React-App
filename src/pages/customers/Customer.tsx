import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Container, Table, Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  registrationDate: string;
}

interface TokenPayload {
  [key: string]: any; 
}

const Customers: React.FC = () => {
  const location = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    region: '',
    registrationDate: '',
  });

  const [userRole, setUserRole] = useState<string | null>(null);

  const navigate = useNavigate();

  const getRoleFromToken = (token: string): string | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = token ? getRoleFromToken(token) : null;
    setUserRole(role);

    if (token || location.state?.reload) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
  }, [location.state]);
  

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams();

      if (filters.name) query.append('name', filters.name);
      if (filters.email) query.append('email', filters.email);
      if (filters.region) query.append('region', filters.region);
      if (filters.registrationDate) query.append('registrationDate', filters.registrationDate);

      const res = await fetch(`http://localhost:5115/api/customers/filter?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (userRole !== 'Admin') {
      alert('You do not have permission to delete customers.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const res = await fetch(`http://localhost:5115/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Customer could not be deleted.');
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customers</h2>
        {userRole === 'Admin' && (
          <Button variant="success" onClick={() => navigate('/customers/add')}>
            Add Customer
          </Button>
        )}
      </div>

      {/* Filter Form */}
      <Form onSubmit={handleFilter} className="mb-4">
        <Row className="g-2">
          <Col md>
            <Form.Control
              type="text"
              placeholder="First Name - Last Name"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
            />
          </Col>
          <Col md>
            <Form.Control
              type="text"
              placeholder="Email"
              name="email"
              value={filters.email}
              onChange={handleInputChange}
            />
          </Col>
          <Col md>
            <Form.Control
              type="text"
              placeholder="Region"
              name="region"
              value={filters.region}
              onChange={handleInputChange}
            />
          </Col>
          <Col md>
            <Form.Control
              type="date"
              name="registrationDate"
              value={filters.registrationDate}
              onChange={handleInputChange}
            />
          </Col>
          <Col>
            <Button type="submit" variant="primary">Filter</Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.firstName}</td>
                <td>{c.lastName}</td>
                <td>{c.email}</td>
                <td>{c.region}</td>
                <td>{new Date(c.registrationDate).toLocaleDateString()}</td>
                <td>
                  {userRole === 'Admin' ? (
                    <>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => navigate(`/customers/edit/${c.id}`)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <span>No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Customers;
