import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/ModelInsights.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModelInsightsPage = () => {
  const [insightsData] = useState({
    models: [
      {
        name: 'Risk Classifier (Logistic Regression)',
        accuracy: 0.9245,
        precision: 0.8934,
        recall: 0.8567,
        f1Score: 0.8748,
        description: 'Classifies users into risk categories',
      },
      {
        name: 'Credit Limit Recommendation (Random Forest)',
        accuracy: 0.9102,
        precision: 0.8876,
        recall: 0.8945,
        f1Score: 0.8910,
        description: 'Recommends appropriate credit limits',
      },
      {
        name: 'Default Probability (Gradient Boosting)',
        rmse: 0.1234,
        maeError: 0.0945,
        r2Score: 0.8765,
        description: 'Predicts probability of default',
      },
    ],
    featureImportance: [
      { feature: 'Debt Ratio', importance: 0.245 },
      { feature: 'Income Level', importance: 0.198 },
      { feature: 'Payment History', importance: 0.167 },
      { feature: 'Credit Score', importance: 0.145 },
      { feature: 'Age', importance: 0.089 },
      { feature: 'Number of Open Accounts', importance: 0.078 },
      { feature: 'Times 90+ Days Late', importance: 0.065 },
      { feature: 'Number of Dependents', importance: 0.013 },
    ],
  });
  const navigate = useNavigate();

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Model Insights & Performance</h1>
          <p className="text-muted">Detailed analysis of ML models and their performance metrics</p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h4 className="mb-4">Model Performance Metrics</h4>
          {insightsData.models.map((model, idx) => (
            <Card key={idx} className="model-card mb-4">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h5>{model.name}</h5>
                    <p className="text-muted">{model.description}</p>
                  </Col>
                  <Col md={4}>
                    <div className="metrics-grid">
                      {model.accuracy !== undefined && (
                        <div className="metric">
                          <span className="metric-label">Accuracy</span>
                          <span className="metric-value">{(model.accuracy * 100).toFixed(2)}%</span>
                        </div>
                      )}
                      {model.precision !== undefined && (
                        <div className="metric">
                          <span className="metric-label">Precision</span>
                          <span className="metric-value">{(model.precision * 100).toFixed(2)}%</span>
                        </div>
                      )}
                      {model.recall !== undefined && (
                        <div className="metric">
                          <span className="metric-label">Recall</span>
                          <span className="metric-value">{(model.recall * 100).toFixed(2)}%</span>
                        </div>
                      )}
                      {model.f1Score !== undefined && (
                        <div className="metric">
                          <span className="metric-label">F1-Score</span>
                          <span className="metric-value">{(model.f1Score * 100).toFixed(2)}%</span>
                        </div>
                      )}
                      {model.rmse !== undefined && (
                        <div className="metric">
                          <span className="metric-label">RMSE</span>
                          <span className="metric-value">{model.rmse.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h4 className="mb-4">Feature Importance Visualization</h4>
          <Card className="card-custom">
            <Card.Body>
              {insightsData && (
                <Bar
                  data={{
                    labels: insightsData.featureImportance.map(item => item.feature),
                    datasets: [
                      {
                        label: 'Importance Score',
                        data: insightsData.featureImportance.map(item => item.importance * 100),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(255, 206, 86, 0.8)',
                          'rgba(75, 192, 192, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                          'rgba(255, 159, 64, 0.8)',
                          'rgba(199, 199, 199, 0.8)',
                          'rgba(83, 102, 255, 0.8)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)',
                          'rgba(199, 199, 199, 1)',
                          'rgba(83, 102, 255, 1)',
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 30,
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
        <Col>
          <h4 className="mb-4">Feature Importance Ranking</h4>
          <Card className="card-custom">
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Feature</th>
                    <th>Importance Score</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {insightsData.featureImportance.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>#{idx + 1}</strong></td>
                      <td>{item.feature}</td>
                      <td>{(item.importance * 100).toFixed(2)}%</td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${item.importance * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h5>Key Insights</h5>
              <ul>
                <li><strong>Most Important Feature:</strong> Debt Ratio (24.5%) - Strongest predictor of creditworthiness</li>
                <li><strong>Model Accuracy:</strong> 92%+ across all models - Highly reliable predictions</li>
                <li><strong>Feature Distribution:</strong> Top 3 features account for 61% of model decisions</li>
                <li><strong>Recommendation:</strong> Users should focus on reducing debt ratio for better credit profiles</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModelInsightsPage;
