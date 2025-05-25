import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerForm from '../../components/CustomerForm';

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Invalid customer ID</p>;

  return <CustomerForm mode="edit" customerId={parseInt(id)} />;
};

export default CustomerEdit;
