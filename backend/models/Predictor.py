import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
import json

class CreditLimitPredictor:
    """
    Make predictions for credit limit recommendations
    """
    
    def __init__(self, scaler=None, models=None):
        self.scaler = scaler or StandardScaler()
        self.models = models or {}
    
    def predict_credit_risk(self, features):
        """
        Predict credit risk level
        Returns: risk_level (0: Low, 1: High), probability
        """
        if 'risk_classifier' not in self.models:
            raise ValueError("Risk classifier model not found")
        
        model = self.models['risk_classifier']['model']
        features_array = np.array(features).reshape(1, -1)
        features_scaled = self.scaler.transform(features_array)
        
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].max()
        
        return {
            'risk_level': 'High Risk' if prediction == 1 else 'Low Risk',
            'probability': float(probability),
            'prediction': int(prediction)
        }
    
    def predict_credit_limit(self, features):
        """
        Predict recommended credit limit
        Returns: recommended_limit
        """
        if 'credit_limit' not in self.models:
            raise ValueError("Credit limit model not found")
        
        model = self.models['credit_limit']['model']
        features_array = np.array(features).reshape(1, -1)
        features_scaled = self.scaler.transform(features_array)
        
        prediction = model.predict(features_scaled)[0]
        
        return {
            'recommended_credit_limit': float(prediction) * 1000,  # Scale appropriately
            'category': 'Premium' if prediction > 0.7 else 'Standard' if prediction > 0.4 else 'Basic'
        }
    
    def predict_default_probability(self, features):
        """
        Predict probability of default
        Returns: default_probability (0-1)
        """
        if 'default_probability' not in self.models:
            raise ValueError("Default probability model not found")
        
        model = self.models['default_probability']['model']
        features_array = np.array(features).reshape(1, -1)
        features_scaled = self.scaler.transform(features_array)
        
        prediction = model.predict(features_scaled)[0]
        probability = max(0, min(1, prediction))  # Ensure between 0 and 1
        
        return {
            'default_probability': float(probability),
            'risk_status': 'High' if probability > 0.5 else 'Medium' if probability > 0.3 else 'Low'
        }
    
    def calculate_financial_health_score(self, user_data):
        """
        Calculate comprehensive financial health score (0-100)
        """
        score = 50  # Base score
        
        # Income factor
        if user_data.get('income', 0) > 50000:
            score += 15
        elif user_data.get('income', 0) > 30000:
            score += 10
        else:
            score -= 5
        
        # Debt ratio factor
        debt_ratio = user_data.get('debt_ratio', 1)
        if debt_ratio < 0.3:
            score += 15
        elif debt_ratio < 0.5:
            score += 5
        else:
            score -= 10
        
        # Age factor
        age = user_data.get('age', 40)
        if 25 <= age <= 65:
            score += 10
        
        # Clamp between 0 and 100
        score = max(0, min(100, score))
        
        return {
            'financial_health_score': score,
            'health_status': 'Excellent' if score >= 80 else 'Good' if score >= 60 else 'Fair' if score >= 40 else 'Poor'
        }
    
    def get_personalized_recommendations(self, user_data, predictions):
        """
        Generate personalized financial recommendations
        """
        recommendations = []
        
        # Based on risk
        if predictions.get('risk_level') == 'High Risk':
            recommendations.append("⚠️ Focus on reducing debt and improving payment history")
            recommendations.append("📊 Monitor your credit score regularly")
        else:
            recommendations.append("✅ Maintain your good credit standing")
        
        # Based on debt ratio
        debt_ratio = user_data.get('debt_ratio', 0)
        if debt_ratio > 0.5:
            recommendations.append("💰 Consider paying down existing debt")
        
        # Based on income
        income = user_data.get('income', 0)
        if income < 30000:
            recommendations.append("📈 Work on increasing your income")
        
        # Based on default probability
        default_prob = predictions.get('default_probability', 0)
        if default_prob > 0.5:
            recommendations.append("🚨 Consider seeking financial counseling")
        
        return {
            'recommendations': recommendations[:5]  # Top 5 recommendations
        }
    
    def generate_spending_alerts(self, user_data):
        """
        Generate spending risk alerts
        """
        alerts = []
        
        if user_data.get('credit_utilization', 0) > 0.8:
            alerts.append({
                'type': 'HIGH_UTILIZATION',
                'message': 'High credit utilization detected. Consider paying down balances.',
                'severity': 'HIGH'
            })
        
        if user_data.get('recent_inquiries', 0) > 2:
            alerts.append({
                'type': 'MULTIPLE_INQUIRIES',
                'message': 'Multiple credit inquiries detected. Be cautious with new credit applications.',
                'severity': 'MEDIUM'
            })
        
        return {
            'alerts': alerts
        }

