import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import { useNotification } from '../context/NotificationContext';
import '../styles/FinancialAdvice.css';

const FinancialAdvicePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [user, setUser] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  
  // Bank form states
  const [bankFormData, setBankFormData] = useState({
    income: '',
    existingLoans: '',
    outstandingBalances: '',
    creditHistoryMonths: '',
    employmentStatus: 'employed',
    yearsAtCurrentJob: '',
  });
  const [bankFormErrors, setBankFormErrors] = useState({});
  const [bankFormLoading, setBankFormLoading] = useState(false);
  const [bankResult, setBankResult] = useState(null);
  const [advice, setAdvice] = useState([
    {
      title: 'Debt Management',
      tips: [
        'Keep your debt-to-income ratio below 43%',
        'Pay bills on time to maintain good credit history',
        'Diversify your debt (mix of credit cards, loans)',
        'Consider debt consolidation if you have multiple debts',
      ],
      icon: '💳',
    },
    {
      title: 'Credit Building',
      tips: [
        'Monitor your credit score monthly',
        'Request credit limit increases periodically',
        'Keep old accounts open to maintain long credit history',
        'Limit credit inquiries to every 6 months',
      ],
      icon: '📈',
    },
    {
      title: 'Spending Habits',
      tips: [
        'Keep credit utilization below 30%',
        'Use autopay for on-time bill payments',
        'Avoid unnecessary credit applications',
        'Track spending regularly',
      ],
      icon: '💰',
    },
    {
      title: 'Income Growth',
      tips: [
        'Increase earning potential through skill development',
        'Consider side income sources',
        'Negotiate salary reviews annually',
        'Build emergency fund of 3-6 months expenses',
      ],
      icon: '📊',
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Calculate personalized credit score based on user profile
  const calculateCreditScore = () => {
    if (!user) return null;

    let score = 600; // Starting score

    // Fetch user profile data and calculate
    fetch('http://localhost:5000/api/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((profileData) => {
        let calculatedScore = 650;

        // Factor 1: Age (younger age = lower score)
        const age = profileData.age || 30;
        if (age < 25) calculatedScore -= 30;
        else if (age >= 25 && age < 35) calculatedScore += 20;
        else if (age >= 35 && age < 50) calculatedScore += 40;
        else calculatedScore += 50;

        // Factor 2: Income (higher income = higher score)
        const income = profileData.income || 50000;
        if (income < 30000) calculatedScore -= 40;
        else if (income >= 30000 && income < 60000) calculatedScore += 10;
        else if (income >= 60000 && income < 100000) calculatedScore += 30;
        else calculatedScore += 50;

        // Factor 3: Debt Ratio (lower debt = higher score)
        const debtRatio = profileData.debtRatio || 0.3;
        if (debtRatio > 0.7) calculatedScore -= 80;
        else if (debtRatio > 0.5) calculatedScore -= 40;
        else if (debtRatio > 0.3) calculatedScore -= 10;
        else calculatedScore += 30;

        // Factor 4: Employment stability
        const employed = profileData.employed !== false;
        if (employed) calculatedScore += 30;

        // Ensure score is within 300-850 range
        calculatedScore = Math.max(300, Math.min(850, calculatedScore));
        setCreditScore(Math.round(calculatedScore));
      })
      .catch(() => {
        // Fallback to estimated score
        setCreditScore(Math.floor(Math.random() * 150) + 650);
      });
  };

  const getScoreRating = (score) => {
    if (!score) return 'Unknown';
    if (score < 650) return 'Poor';
    if (score < 700) return 'Fair';
    if (score < 750) return 'Good';
    return 'Excellent';
  };

  const generatePDFReport = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.text('Financial Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // User Info
      pdf.setFontSize(12);
      pdf.text(`User: ${user?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Email: ${user?.email || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;

      // Credit Score Section
      pdf.setFontSize(14);
      pdf.text('Credit Score Analysis', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.text(`Current Score: ${creditScore || 'Calculating...'} (${getScoreRating(creditScore)})`, 20, yPosition);
      yPosition += 8;
      pdf.text('Score Range: 300-850', 20, yPosition);
      yPosition += 6;
      pdf.text('• 300-649: Poor', 25, yPosition);
      yPosition += 5;
      pdf.text('• 650-699: Fair', 25, yPosition);
      yPosition += 5;
      pdf.text('• 700-749: Good', 25, yPosition);
      yPosition += 5;
      pdf.text('• 750+: Excellent', 25, yPosition);
      yPosition += 15;

      // Recommendations
      pdf.setFontSize(14);
      pdf.text('Financial Recommendations', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(11);
      
      const recommendations = [
        'Pay all bills on time to maintain creditworthiness',
        'Keep debt-to-income ratio below 43%',
        'Maintain credit utilization below 30%',
        'Regularly monitor your credit report',
        'Build an emergency fund of 3-6 months expenses',
        'Diversify your credit mix (cards, loans, etc)',
      ];

      recommendations.forEach((rec) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${rec}`, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Footer
      pdf.setFontSize(10);
      pdf.text('This report is generated automatically and is provided for informational purposes only.', 20, pageHeight - 10);

      // Download the PDF
      pdf.save(`Financial_Report_${user?.name?.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
      
      setModalTitle('Report Generated Successfully');
      setModalContent('Your financial report has been generated and downloaded to your device.\n\nFile name: Financial_Report_' + (user?.name?.replace(/\s+/g, '_') || 'User') + '.pdf\n\nPlease check your downloads folder.');
      setShowModal(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setModalTitle('Error');
      setModalContent('Failed to generate report. Please try again later.');
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleBankFormChange = (e) => {
    const { name, value } = e.target;
    setBankFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (bankFormErrors[name]) {
      setBankFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateBankForm = () => {
    const errors = {};
    if (!bankFormData.income || bankFormData.income <= 0) {
      errors.income = 'Income must be greater than 0';
    }
    if (!bankFormData.existingLoans || bankFormData.existingLoans < 0) {
      errors.existingLoans = 'Existing loans must be a positive number';
    }
    if (!bankFormData.outstandingBalances || bankFormData.outstandingBalances < 0) {
      errors.outstandingBalances = 'Outstanding balances must be a positive number';
    }
    if (!bankFormData.creditHistoryMonths || bankFormData.creditHistoryMonths < 0) {
      errors.creditHistoryMonths = 'Credit history months must be a positive number';
    }
    if (!bankFormData.yearsAtCurrentJob || bankFormData.yearsAtCurrentJob < 0) {
      errors.yearsAtCurrentJob = 'Years at current job must be a positive number';
    }
    return errors;
  };

  const handleBankFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateBankForm();
    
    if (Object.keys(errors).length > 0) {
      setBankFormErrors(errors);
      return;
    }

    setBankFormLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bank/calculate-credit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bankFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate credit score');
      }

      const result = await response.json();
      setBankResult(result);
      addNotification('Credit score calculated successfully!', 'success');
      
      // Show results
      setModalTitle('Credit Score Analysis - Bank Assessment');
      setModalContent(
        `Credit Score: ${result.creditScore} out of 850\n\n` +
        `Risk Category: ${result.riskCategory.toUpperCase()}\n` +
        `Default Probability: ${result.defaultProbability}%\n` +
        `Debt-to-Income Ratio: ${result.debtRatio}\n` +
        `Recommended Credit Limit: $${Math.round(result.recommendedCreditLimit)}\n\n` +
        `Assessment Summary:\n` +
        (result.riskCategory === 'low' 
          ? '✓ Low risk - Eligible for premium credit products\n✓ Favorable interest rates available\n✓ Consider higher credit limits' 
          : result.riskCategory === 'medium' 
          ? '⚠ Medium risk - Standard approval process\n⚠ Competitive interest rates\n⚠ Monitor debt levels' 
          : '✗ High risk - Requires improved financial profile\n✗ Limited credit options currently\n✗ Focus on debt reduction'
        )
      );
      setShowModal(true);
      setShowBankForm(false);
    } catch (error) {
      console.error('Error calculating credit score:', error);
      addNotification(error.message || 'Failed to calculate credit score', 'error');
    } finally {
      setBankFormLoading(false);
    }
  };

  const fetchAndShowGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bank/goals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const goals = await response.json();
      setModalTitle('Your Personalized Financial Goals');
      setModalContent(
        `CREDIT SCORE GOAL:\n` +
        `Current: ${goals.creditScoreGoal.current} | Target: ${goals.creditScoreGoal.target}\n` +
        `Points Needed: ${goals.creditScoreGoal.gap}\n` +
        `Timeline: ${goals.creditScoreGoal.timeline}\n` +
        `Action Items:\n${goals.creditScoreGoal.actionItems.map(a => '  • ' + a).join('\n')}\n\n` +
        `CREDIT LIMIT GOAL:\n` +
        `Current: $${Math.round(goals.creditLimitGoal.current)} | Target: $${Math.round(goals.creditLimitGoal.target)}\n` +
        `Timeline: ${goals.creditLimitGoal.timeline}\n` +
        `Action Items:\n${goals.creditLimitGoal.actionItems.map(a => '  • ' + a).join('\n')}\n\n` +
        `LOAN ELIGIBILITY:\n` +
        `Status: ${goals.loanEligibility.status}\n` +
        `Default Risk: ${goals.loanEligibility.defaultRisk}\n` +
        `Recommendations:\n${goals.loanEligibility.recommendations.map(r => '  • ' + r).join('\n')}`
      );
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching goals:', error);
      addNotification('Failed to fetch goals', 'error');
    }
  };

  const handleAction = (actionType) => {
    switch (actionType) {
      case 'credit-score':
        setShowBankForm(true);
        break;
      case 'download-report':
        generatePDFReport();
        break;
      case 'goals':
        fetchAndShowGoals();
        break;
      default:
        break;
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">Financial Advice & Tips</h1>
          <p className="text-muted">Personalized recommendations to improve your financial health</p>
        </Col>
      </Row>

      <Row>
        {advice.map((category, idx) => (
          <Col md={6} lg={3} key={idx} className="mb-4">
            <Card className="advice-card h-100">
              <Card.Body>
                <h5 className="mb-3">
                  <span className="advice-icon">{category.icon}</span>
                  {category.title}
                </h5>
                <ListGroup variant="flush">
                  {category.tips.map((tip, tipIdx) => (
                    <ListGroup.Item key={tipIdx} className="border-0 px-0">
                      ✓ {tip}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="card-custom">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleAction('credit-score')}
                  >
                    Check Credit Score
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-info"
                    className="w-100"
                    onClick={() => handleAction('download-report')}
                    disabled={loading}
                  >
                    {loading ? '⏳ Generating...' : 'Download Report'}
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-warning"
                    className="w-100"
                    onClick={() => handleAction('goals')}
                  >
                    View Goals
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-line' }}>
          {modalContent}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bank Form Modal */}
      <Modal show={showBankForm} onHide={() => setShowBankForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bank Credit Score Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBankFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Annual Income ($)</Form.Label>
              <Form.Control
                type="number"
                step="1000"
                min="0"
                name="income"
                value={bankFormData.income}
                onChange={handleBankFormChange}
                isInvalid={!!bankFormErrors.income}
                placeholder="e.g., 50000"
              />
              <Form.Control.Feedback type="invalid">
                {bankFormErrors.income}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Existing Loans ($)</Form.Label>
              <Form.Control
                type="number"
                step="1000"
                min="0"
                name="existingLoans"
                value={bankFormData.existingLoans}
                onChange={handleBankFormChange}
                isInvalid={!!bankFormErrors.existingLoans}
                placeholder="e.g., 10000"
              />
              <Form.Control.Feedback type="invalid">
                {bankFormErrors.existingLoans}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Outstanding Balances ($)</Form.Label>
              <Form.Control
                type="number"
                step="1000"
                min="0"
                name="outstandingBalances"
                value={bankFormData.outstandingBalances}
                onChange={handleBankFormChange}
                isInvalid={!!bankFormErrors.outstandingBalances}
                placeholder="e.g., 5000"
              />
              <Form.Control.Feedback type="invalid">
                {bankFormErrors.outstandingBalances}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Credit History (Months)</Form.Label>
              <Form.Control
                type="number"
                step="1"
                min="0"
                name="creditHistoryMonths"
                value={bankFormData.creditHistoryMonths}
                onChange={handleBankFormChange}
                isInvalid={!!bankFormErrors.creditHistoryMonths}
                placeholder="e.g., 24"
              />
              <Form.Control.Feedback type="invalid">
                {bankFormErrors.creditHistoryMonths}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Employment Status</Form.Label>
              <Form.Select
                name="employmentStatus"
                value={bankFormData.employmentStatus}
                onChange={handleBankFormChange}
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Years at Current Job</Form.Label>
              <Form.Control
                type="number"
                step="0.5"
                min="0"
                name="yearsAtCurrentJob"
                value={bankFormData.yearsAtCurrentJob}
                onChange={handleBankFormChange}
                isInvalid={!!bankFormErrors.yearsAtCurrentJob}
                placeholder="e.g., 3"
              />
              <Form.Control.Feedback type="invalid">
                {bankFormErrors.yearsAtCurrentJob}
              </Form.Control.Feedback>
            </Form.Group>

            <Alert variant="info">
              <strong>Note:</strong> This assessment is used to calculate your credit score and recommended credit limit.
              All information is encrypted and secure.
            </Alert>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={bankFormLoading}
              >
                {bankFormLoading ? '⏳ Calculating...' : 'Calculate Credit Score'}
              </Button>
              <Button variant="secondary" onClick={() => setShowBankForm(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinancialAdvicePage;
