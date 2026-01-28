import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, Title, PointElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import '../styles/RiskAnalysis.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, Title, PointElement);

const RiskAnalysisPage = () => {
  const [riskData, setRiskData] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchRiskAnalysis();
  }, []);

  const fetchRiskAnalysis = async () => {
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/risk-analysis', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
      }
    } catch (error) {
      console.error('Error fetching risk analysis:', error);
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Risk Analysis</h1>
          <p className="text-muted">Detailed credit risk assessment and analysis</p>
        </Col>
      </Row>

      {riskData ? (
        <>
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="risk-card risk-low">
                <Card.Body>
                  <h6>Low Risk Users</h6>
                  <h3>45%</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="risk-card risk-medium">
                <Card.Body>
                  <h6>Medium Risk Users</h6>
                  <h3>35%</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="risk-card risk-high">
                <Card.Body>
                  <h6>High Risk Users</h6>
                  <h3>20%</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Alert variant="info">
            <strong>Risk Assessment:</strong> Analysis shows a healthy distribution with majority of users having low to medium risk profile.
          </Alert>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Risk Distribution</Card.Title>
                </Card.Header>
                <Card.Body>
                  {riskData && (
                    <Pie
                      data={{
                        labels: riskData.riskDistribution.labels,
                        datasets: [
                          {
                            data: riskData.riskDistribution.data,
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
                  <Card.Title className="mb-0">Default Probability Trend</Card.Title>
                </Card.Header>
                <Card.Body>
                  {riskData && (
                    <Line
                      data={{
                        labels: riskData.defaultProbabilityTrend.labels,
                        datasets: [
                          {
                            label: 'Default Probability (%)',
                            data: riskData.defaultProbabilityTrend.data,
                            borderColor: 'rgba(244, 67, 54, 1)',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: 'rgba(244, 67, 54, 1)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 10,
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
            <Col className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Risk Factors Impact</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ul>
                    <li><strong>Debt Ratio:</strong> 40% - Strong influence on risk assessment</li>
                    <li><strong>Payment History:</strong> 25% - Critical factor for credit decisions</li>
                    <li><strong>Income Level:</strong> 20% - Important for credit limit determination</li>
                    <li><strong>Credit Score:</strong> 15% - Validation of overall creditworthiness</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center py-5">
          <p>Loading risk analysis...</p>
        </div>
      )}
    </Container>
  );
};

export default RiskAnalysisPage;
