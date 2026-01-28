import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Tab, Tabs, Alert } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import '../styles/AdminPanel.css';

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalPredictions: 0,
    systemAccuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      setError('Access Denied: Only admins can access this panel');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch users
      const usersResponse = await fetch('${process.env.REACT_BACKEND_URL}/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch analytics
      const analyticsResponse = await fetch('${process.env.REACT_BACKEND_URL}/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (usersResponse.ok && analyticsResponse.ok) {
        const usersData = await usersResponse.json();
        const analyticsData = await analyticsResponse.json();

        setUsers(usersData.users || []);
        setAnalytics(analyticsData);
      } else {
        setError('Failed to load admin data');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Error loading admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_BACKEND_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const message = newRole === 'admin' ? 'User promoted to admin' : 'User role changed to regular user';
        addNotification(message, 'success');
        setSuccessMessage('User role updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      addNotification('Failed to update user role', 'error');
      setError('Failed to update user role');
    }
  };

  const handleDisableUser = async (userId) => {
    if (window.confirm('Are you sure you want to disable this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_BACKEND_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          addNotification('User account disabled successfully', 'info');
          setSuccessMessage('User disabled successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
          fetchAdminData();
        }
      } catch (err) {
        console.error('Error disabling user:', err);
        addNotification('Failed to disable user', 'error');
        setError('Failed to disable user');
      }
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Admin Panel</h1>
          <p className="text-muted">System management and analytics dashboard</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <p>Loading admin data...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card">
                <Card.Body>
                  <h6>Total Users</h6>
                  <h3>{analytics.totalUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card">
                <Card.Body>
                  <h6>Regular Users</h6>
                  <h3>{analytics.activeUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card">
                <Card.Body>
                  <h6>Admin Users</h6>
                  <h3>{analytics.adminUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card">
                <Card.Body>
                  <h6>System Accuracy</h6>
                  <h3>{analytics.systemAccuracy}%</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="card-custom">
                <Card.Body>
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                    <Tab eventKey="users" title="User Management">
                      {users.length > 0 ? (
                        <Table hover className="mt-3">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Joined</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                  <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'info'}`}>
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                  </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    size="sm"
                                    variant={user.role === 'admin' ? 'outline-info' : 'outline-danger'}
                                    className="me-2"
                                    onClick={() =>
                                      handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')
                                    }
                                  >
                                    {user.role === 'admin' ? 'Demote' : 'Promote'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDisableUser(user.id)}
                                  >
                                    Disable
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted">No users found</p>
                        </div>
                      )}
                    </Tab>

                    <Tab eventKey="system" title="System Settings">
                      <div className="mt-3">
                        <h5 className="mb-4">System Configuration</h5>
                        <Row>
                          <Col md={6}>
                            <Card className="bg-light">
                              <Card.Body>
                                <h6>ML Model Settings</h6>
                                <ul className="list-unstyled">
                                  <li className="mb-2">
                                    <strong>Risk Model:</strong> Logistic Regression
                                  </li>
                                  <li className="mb-2">
                                    <strong>Credit Model:</strong> Random Forest
                                  </li>
                                  <li className="mb-2">
                                    <strong>Default Model:</strong> Gradient Boosting
                                  </li>
                                  <li className="mb-2">
                                    <strong>Training Interval:</strong> Monthly
                                  </li>
                                </ul>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6}>
                            <Card className="bg-light">
                              <Card.Body>
                                <h6>Database Settings</h6>
                                <ul className="list-unstyled">
                                  <li className="mb-2">
                                    <strong>Database:</strong> MySQL
                                  </li>
                                  <li className="mb-2">
                                    <strong>Backup:</strong> Daily
                                  </li>
                                  <li className="mb-2">
                                    <strong>Last Backup:</strong> Today 02:30 AM
                                  </li>
                                  <li className="mb-2">
                                    <strong>Storage:</strong> 85% Used
                                  </li>
                                </ul>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </Tab>

                    <Tab eventKey="reports" title="Reports & Analytics">
                      <div className="mt-3">
                        <h5 className="mb-4">Generate Reports</h5>
                        <Row>
                          <Col md={3} className="mb-3">
                            <Button variant="outline-primary" className="w-100">
                              User Activity Report
                            </Button>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Button variant="outline-info" className="w-100">
                              Model Performance
                            </Button>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Button variant="outline-success" className="w-100">
                              Prediction Analytics
                            </Button>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Button variant="outline-warning" className="w-100">
                              System Logs
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdminPanelPage;
