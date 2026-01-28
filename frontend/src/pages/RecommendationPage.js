import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/Recommendation.css';

const RecommendationPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    debtRatio: "",
    dependents: "",
    creditScore: "",
    monthlyIncome: "",
    numberOfOpenCreditLinesAndLoans: "",
    numberOfTimes90DaysLate: "",
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      setError('Age must be between 18 and 120');
      return;
    }
    if (!formData.income || formData.income <= 0) {
      setError('Annual income must be greater than 0');
      return;
    }
    if (formData.debtRatio < 0 || formData.debtRatio > 1) {
      setError('Debt ratio must be between 0 and 1');
      return;
    }
    if (formData.creditScore && (formData.creditScore < 300 || formData.creditScore > 850)) {
      setError('Credit score must be between 300 and 850');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendation(data);
      } else {
        setError(data.message || 'Failed to get recommendation');
      }
    } catch (err) {
      setError('An error occurred. Please try again. ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-5 recommendation-page">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Credit Limit Recommendation</h1>
          <p className="text-muted">Enter your financial details to get personalized recommendations</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="card-custom p-4">
            <Card.Title>Your Financial Details</Card.Title>
            <Form onSubmit={handleGetRecommendation}>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="120"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Annual Income (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Debt Ratio (0-1)</Form.Label>
                <Form.Control
                  type="number"
                  name="debtRatio"
                  value={formData.debtRatio}
                  onChange={handleInputChange}
                  min="0"
                  max="1"
                  step="0.01"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of Dependents</Form.Label>
                <Form.Control
                  type="number"
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleInputChange}
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Credit Score</Form.Label>
                <Form.Control
                  type="number"
                  name="creditScore"
                  value={formData.creditScore}
                  onChange={handleInputChange}
                  min="300"
                  max="850"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Monthly Income (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Open Credit Lines & Loans</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfOpenCreditLinesAndLoans"
                  value={formData.numberOfOpenCreditLinesAndLoans}
                  onChange={handleInputChange}
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Times 90+ Days Late (past 2 years)</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfTimes90DaysLate"
                  value={formData.numberOfTimes90DaysLate}
                  onChange={handleInputChange}
                  min="0"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
              </Button>
            </Form>
          </Card>
        </Col>

        {recommendation && (
          <Col lg={6} className="mb-4">
            <Card className="card-custom p-4 recommendation-result">
              <Card.Title className="text-success">Your Results</Card.Title>

              <div className="result-item mb-4">
                <h5>Recommended Credit Limit</h5>
                <div className="result-value text-success">
                  ₹{recommendation.creditLimit?.toLocaleString()}
                </div>
                <small className="text-muted">{recommendation.creditCategory}</small>
              </div>

              <div className="result-item mb-4">
                <h5>Risk Assessment</h5>
                <div className={`risk-badge ${recommendation.riskLevel?.toLowerCase()}`}>
                  {recommendation.riskLevel}
                </div>
                <div className="mt-2">
                  <small>Risk Probability: {(recommendation.riskProbability * 100).toFixed(2)}%</small>
                </div>
              </div>

              <div className="result-item mb-4">
                <h5>Default Probability</h5>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${recommendation.defaultProbability * 100}%` }}
                  >
                    {(recommendation.defaultProbability * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="result-item mb-4">
                <h5>Financial Health Score</h5>
                <div className="health-score">
                  {recommendation.healthScore}/100
                </div>
                <small className="text-muted">{recommendation.healthStatus}</small>
              </div>

              <Card className="bg-light p-3 mt-4">
                <h6>Recommendations</h6>
                <ul className="mb-0">
                  {recommendation.recommendations?.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </Card>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default RecommendationPage;
