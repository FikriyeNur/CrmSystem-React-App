import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Table } from 'react-bootstrap';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Kullanıcı girişi yapılmamış.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5115/api/users/userprofile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Profil bilgileri alınamadı.');
        }

        const data: UserProfile = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container className="mt-4">
      <h2>User Profile</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {profile && (
        <Table bordered hover striped className="mt-3 w-50">
          <tbody>
            <tr>
              <th>User Name</th>
              <td>{profile.username}</td>
            </tr>
            <tr>
              <th>Email Address</th>
              <td>{profile.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{profile.role}</td>
            </tr>
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Profile;
