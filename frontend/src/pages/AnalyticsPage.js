import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../styles/Analytics.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Dataset Analytics</h1>
          <p className="text-muted">Comprehensive data exploration and analysis</p>
        </Col>
      </Row>

      {analyticsData ? (
        <>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Total Records</h6>
                  <h3 className="stat-value text-primary">{analyticsData.totalRecords}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Features</h6>
                  <h3 className="stat-value text-info">{analyticsData.totalFeatures}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Missing Values</h6>
                  <h3 className="stat-value text-warning">0</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Outliers Detected</h6>
                  <h3 className="stat-value text-danger">{analyticsData.outliersCount || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Feature Distribution</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <p className="text-muted">Total Features: {analyticsData.totalFeatures}</p>
                      <p className="text-muted">Numeric Features: {analyticsData.numericFeatures}</p>
                      <p className="text-muted">Categorical Features: {analyticsData.categoricalFeatures}</p>
                      <div style={{ marginTop: '20px' }}>
                        <h6>Feature Quality Metrics</h6>
                        <div style={{ marginTop: '15px', textAlign: 'left' }}>
                          <div style={{ marginBottom: '10px' }}>
                            <label>Data Completeness</label>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: '100%' }}
                              >
                                100%
                              </div>
                            </div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <label>Outliers</label>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: '12%' }}
                              >
                                {((analyticsData.outliersCount / analyticsData.totalRecords) * 100).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Data Quality Summary</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                          {analyticsData.missingValues}
                        </span>
                        <p className="text-muted">Missing Values</p>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                          {analyticsData.outliersCount}
                        </span>
                        <p className="text-muted">Outliers Detected</p>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
                          {analyticsData.totalRecords.toLocaleString()}
                        </span>
                        <p className="text-muted">Total Records</p>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Age Distribution</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <Bar
                      data={{
                        labels: analyticsData.ageDistribution.labels,
                        datasets: [
                          {
                            label: 'Number of Users',
                            data: analyticsData.ageDistribution.data,
                            backgroundColor: 'rgba(153, 102, 255, 0.8)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
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
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Income Distribution</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <Bar
                      data={{
                        labels: analyticsData.incomeDistribution.labels,
                        datasets: [
                          {
                            label: 'Number of Users',
                            data: analyticsData.incomeDistribution.data,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
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
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Class Distribution (Default Status)</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <Pie
                      data={{
                        labels: analyticsData.classDistribution.labels,
                        datasets: [
                          {
                            data: analyticsData.classDistribution.data,
                            backgroundColor: [
                              'rgba(75, 192, 75, 0.8)',
                              'rgba(244, 67, 54, 0.8)',
                            ],
                            borderColor: [
                              'rgba(75, 192, 75, 1)',
                              'rgba(244, 67, 54, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Debt Ratio Distribution</Card.Title>
                </Card.Header>
                <Card.Body>
                  {analyticsData && (
                    <Bar
                      data={{
                        labels: analyticsData.debtRatioDistribution.labels,
                        datasets: [
                          {
                            label: 'Number of Users',
                            data: analyticsData.debtRatioDistribution.data,
                            backgroundColor: 'rgba(255, 159, 64, 0.8)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
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
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center py-5">
          <p>Loading analytics data...</p>
        </div>
      )}
    </Container>
  );
};

export default AnalyticsPage;
