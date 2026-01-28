import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Navbar bg="dark" expand="lg" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand href="#home" className="brand-title">
            💳 Credit Limit System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/analytics')}>Analytics</Nav.Link>
              <Nav.Link onClick={() => navigate('/recommendation')}>Recommendations</Nav.Link>
              <Nav.Link href="#profile" onClick={() => navigate('/profile')}>Profile</Nav.Link>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-header">Welcome, {user?.name}!</h1>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="stat-label">Total Users</h6>
                <h3 className="stat-value text-primary">1,234</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="stat-label">Avg Credit Limit</h6>
                <h3 className="stat-value text-success">$15,450</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="stat-label">Default Rate</h6>
                <h3 className="stat-value text-warning">5.2%</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="stat-label">Model Accuracy</h6>
                <h3 className="stat-value text-info">92.5%</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Buttons */}
        <Row className="mb-4">
          <Col>
            <h5 className="mb-3">Quick Navigation</h5>
          </Col>
        </Row>
        <Row>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="primary" onClick={() => navigate('/analytics')}>
              📊 Data Analytics
            </Button>
          </Col>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="info" onClick={() => navigate('/recommendation')}>
              💡 Get Recommendation
            </Button>
          </Col>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="success" onClick={() => navigate('/risk-analysis')}>
              📈 Risk Analysis
            </Button>
          </Col>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="warning" onClick={() => navigate('/financial-advice')}>
              💰 Financial Advice
            </Button>
          </Col>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="secondary" onClick={() => navigate('/model-insights')}>
              🤖 Model Insights
            </Button>
          </Col>
          <Col md={2} className="mb-3">
            <Button className="w-100 nav-btn" variant="danger" onClick={() => navigate('/admin-panel')}>
              👤 Admin Panel
            </Button>
          </Col>
        </Row>

        {/* Placeholder for Charts */}
        <Row className="mt-5">
          <Col md={6} className="mb-4">
            <Card className="card-custom">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0">Credit Risk Distribution</Card.Title>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {dashboardData && (
                  <div style={{ width: '100%', height: '350px' }}>
                    <Pie
                      data={{
                        labels: dashboardData.creditRiskDistribution.labels,
                        datasets: [
                          {
                            data: dashboardData.creditRiskDistribution.data,
                            backgroundColor: [
                              'rgba(75, 192, 75, 0.8)',
                              'rgba(255, 193, 7, 0.8)',
                              'rgba(244, 67, 54, 0.8)',
                            ],
                            borderColor: [
                              'rgba(75, 192, 75, 1)',
                              'rgba(255, 193, 7, 1)',
                              'rgba(244, 67, 54, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="card-custom">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0">Income vs Debt Analysis</Card.Title>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {dashboardData && (
                  <div style={{ width: '100%', height: '350px' }}>
                    <Bar
                      data={{
                        labels: dashboardData.incomeVsDebt.labels,
                        datasets: [
                          {
                            label: 'Number of Users',
                            data: dashboardData.incomeVsDebt.data,
                            backgroundColor: [
                              'rgba(54, 162, 235, 0.8)',
                              'rgba(75, 192, 192, 0.8)',
                              'rgba(153, 102, 255, 0.8)',
                              'rgba(255, 159, 64, 0.8)',
                            ],
                            borderColor: [
                              'rgba(54, 162, 235, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'x',
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
