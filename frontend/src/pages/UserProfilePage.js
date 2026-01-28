import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import '../styles/UserProfile.css';

const UserProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUser(formData);
        localStorage.setItem('user', JSON.stringify(formData));
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        addNotification('Profile updated successfully!', 'success');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('Error updating profile', 'error');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one special character (@$!%*?&)';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswordForm();
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/bank/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      addNotification('Password changed successfully!', 'success');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Error changing password:', error);
      addNotification(error.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDownloadUserData = async () => {
    setDownloadLoading(true);
    try {
      // Fetch user data
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/bank/download-data', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Create a ZIP file with multiple PDFs
      const zip = new JSZip();

      // 1. User Profile PDF
      const profilePdf = new jsPDF();
      profilePdf.setFontSize(16);
      profilePdf.text('User Profile Report', 10, 15);
      profilePdf.setFontSize(11);
      profilePdf.text(`Name: ${userData.profile.name}`, 10, 30);
      profilePdf.text(`Email: ${userData.profile.email}`, 10, 40);
      profilePdf.text(`Role: ${userData.profile.role}`, 10, 50);
      profilePdf.text(`Account Created: ${new Date(userData.profile.createdAt).toLocaleDateString()}`, 10, 60);
      profilePdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 75);
      zip.file('01_user_profile.pdf', profilePdf.output('arraybuffer'));

      // 2. Credit Profile PDF
      const creditPdf = new jsPDF();
      creditPdf.setFontSize(16);
      creditPdf.text('Credit Profile Report', 10, 15);
      creditPdf.setFontSize(11);
      let yPos = 30;
      creditPdf.text(`Credit Score: ${userData.creditProfile.creditScore}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Credit Limit: $${userData.creditProfile.creditLimit}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Annual Income: $${userData.creditProfile.income}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Debt Ratio: ${userData.creditProfile.debtRatio}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Risk Category: ${userData.creditProfile.riskCategory}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Employment: ${userData.creditProfile.employmentStatus}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Credit History: ${userData.creditProfile.creditHistoryMonths} months`, 10, yPos);
      yPos += 15;
      creditPdf.setFontSize(12);
      creditPdf.text('Recommendations:', 10, yPos);
      yPos += 10;
      creditPdf.setFontSize(11);
      creditPdf.text(`Recommended Limit: $${userData.recommendations.recommendedCreditLimit}`, 10, yPos);
      yPos += 10;
      creditPdf.text(`Default Risk: ${userData.recommendations.defaultProbability}%`, 10, yPos);
      zip.file('02_credit_profile.pdf', creditPdf.output('arraybuffer'));

      // 3. Goals PDF
      const goalsPdf = new jsPDF();
      goalsPdf.setFontSize(16);
      goalsPdf.text('Financial Goals Report', 10, 15);
      goalsPdf.setFontSize(11);
      yPos = 30;
      goalsPdf.text(`Target Credit Score: ${userData.goals.targetScore}`, 10, yPos);
      yPos += 10;
      goalsPdf.text(`Target Credit Limit: $${userData.goals.targetLimit}`, 10, yPos);
      yPos += 15;
      goalsPdf.setFontSize(12);
      goalsPdf.text('Loan Eligibility Milestones:', 10, yPos);
      yPos += 10;
      goalsPdf.setFontSize(11);
      if (userData.goals.milestones && Object.keys(userData.goals.milestones).length > 0) {
        Object.entries(userData.goals.milestones).forEach(([key, value]) => {
          goalsPdf.text(`• ${key}: ${value}`, 15, yPos);
          yPos += 8;
        });
      } else {
        goalsPdf.text('• No milestones set yet', 15, yPos);
      }
      zip.file('03_goals.pdf', goalsPdf.output('arraybuffer'));

      // 4. JSON data file
      zip.file('user_data.json', JSON.stringify(userData, null, 2));

      // Generate and download ZIP
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = url;
      link.download = `UserData_${user.name?.replace(/\s+/g, '_')}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addNotification('User data downloaded successfully!', 'success');
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Error downloading user data:', error);
      addNotification(error.message || 'Failed to download user data', 'error');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDeleteChange = (e) => {
    setDeletePassword(e.target.value);
    if (deleteError) {
      setDeleteError('');
    }
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    
    if (!deletePassword) {
      setDeleteError('Password is required to delete account');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch('${process.env.REACT_BACKEND_URL}/api/bank/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      addNotification('Account deleted successfully', 'success');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error.message || 'Failed to delete account');
      addNotification(error.message || 'Failed to delete account', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="mt-3">User Profile</h1>
          <p className="text-muted">Manage your account information</p>
        </Col>
      </Row>

      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="card-custom">
            <Card.Header className="bg-light">
              <Row>
                <Col>
                  <Card.Title className="mb-0">Profile Information</Card.Title>
                </Col>
                <Col className="text-end">
                  {!editMode ? (
                    <Button size="sm" variant="primary" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="success" onClick={handleSaveProfile} className="me-2">
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {editMode ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      disabled
                    />
                    <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.role || 'user'}
                      disabled
                    />
                    <Form.Text className="text-muted">Contact admin to change role</Form.Text>
                  </Form.Group>
                </Form>
              ) : (
                <div>
                  <div className="profile-item mb-3">
                    <label className="label-light">Full Name</label>
                    <h6>{user.name}</h6>
                  </div>
                  <div className="profile-item mb-3">
                    <label className="label-light">Email Address</label>
                    <h6>{user.email}</h6>
                  </div>
                  <div className="profile-item mb-3">
                    <label className="label-light">Account Type</label>
                    <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'info'}`}>
                      {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </span>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="card-custom mb-3">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Account Status</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="status-item mb-3">
                <span className="status-label">Status</span>
                <span className="badge bg-success">Active</span>
              </div>
              <div className="status-item mb-3">
                <span className="status-label">Verification</span>
                <span className="badge bg-success">Verified</span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Login</span>
                <span className="text-muted">Today</span>
              </div>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="outline-primary" 
                className="w-100 mb-2"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
              <Button 
                variant="outline-warning" 
                className="w-100 mb-2"
                onClick={() => setShowDownloadModal(true)}
              >
                Download Data
              </Button>
              <Button 
                variant="outline-danger" 
                className="w-100"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.currentPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Must contain uppercase, number, and special character (@$!%*?&)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={passwordLoading}
              >
                {passwordLoading ? '⏳ Changing...' : 'Change Password'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Download Data Modal */}
      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Download Your Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>What's included:</strong>
            <ul className="mb-0">
              <li>User Profile PDF</li>
              <li>Credit Profile Report PDF</li>
              <li>Financial Goals Report PDF</li>
              <li>Complete Data JSON file</li>
            </ul>
          </Alert>
          <p>Your data will be downloaded as a ZIP file containing all your information in PDF and JSON formats.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={handleDownloadUserData}
            disabled={downloadLoading}
          >
            {downloadLoading ? '⏳ Preparing...' : 'Download ZIP'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowDownloadModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning!</strong> This action is permanent and cannot be undone. Your account and all associated data will be deleted.
          </Alert>
          <Form onSubmit={handleDeleteAccountSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter your password to confirm account deletion</Form.Label>
              <Form.Control
                type="password"
                value={deletePassword}
                onChange={handleDeleteChange}
                placeholder="Enter your password"
                isInvalid={!!deleteError}
              />
              <Form.Control.Feedback type="invalid">
                {deleteError}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="danger" 
                type="submit" 
                disabled={deleteLoading}
              >
                {deleteLoading ? '⏳ Deleting...' : 'Delete My Account'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserProfilePage;
