import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface CustomerFormProps {
  mode: 'add' | 'edit';
  customerId?: number;
}

const API_URL = 'http://localhost:5115/api/customers';

const CustomerForm: React.FC<CustomerFormProps> = ({ mode, customerId }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    region: '',
    registrationDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  // Edit modda müşteri verisini çek
  useEffect(() => {
    if (mode === 'edit' && customerId) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/${customerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch customer data');
          const data = await res.json();
          setFormData({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            region: data.region,
            registrationDate: data.registrationDate.slice(0, 10), // yyyy-MM-dd formatı
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [mode, customerId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const url = mode === 'add' ? API_URL : `${API_URL}/${customerId}`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`${mode === 'add' ? 'Add' : 'Update'} operation failed`);
      navigate('/customers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <h3>{mode === 'add' ? 'Add New Customer' : 'Edit Customer'}</h3>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="region">
            <Form.Label>Region</Form.Label>
            <Form.Control
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registrationDate">
            <Form.Label>Registration Date</Form.Label>
            <Form.Control
              type="date"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default CustomerForm;
