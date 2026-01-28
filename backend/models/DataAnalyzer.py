import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import warnings
warnings.filterwarnings('ignore')

class CreditLimitAnalyzer:
    """
    Complete Data Analysis and ML Model Building for Credit Limit Recommendation System
    """
    
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path)
        self.scaler = StandardScaler()
        self.models = {}
        self.analysis_results = {}
        
    def explore_data(self):
        """
        Perform comprehensive Exploratory Data Analysis (EDA)
        """
        print("="*80)
        print("EXPLORATORY DATA ANALYSIS (EDA)")
        print("="*80)
        
        print("\n1. DATASET OVERVIEW")
        print(f"Dataset Shape: {self.df.shape}")
        print(f"\nFirst 5 rows:")
        print(self.df.head())
        
        print("\n2. DATA TYPES AND INFO")
        print(self.df.info())
        
        print("\n3. STATISTICAL SUMMARY")
        print(self.df.describe())
        
        print("\n4. MISSING VALUES")
        missing = self.df.isnull().sum()
        print(missing[missing > 0] if missing.sum() > 0 else "No missing values found")
        
        print("\n5. UNIQUE VALUES PER COLUMN")
        for col in self.df.columns:
            print(f"{col}: {self.df[col].nunique()} unique values")
        
        print("\n6. COLUMN NAMES AND TYPES")
        for col in self.df.columns:
            print(f"  - {col}: {self.df[col].dtype}")
            
        return self.df
    
    def handle_missing_values(self):
        """
        Handle missing values intelligently
        """
        print("\n" + "="*80)
        print("HANDLING MISSING VALUES")
        print("="*80)
        
        missing_values = self.df.isnull().sum()
        if missing_values.sum() > 0:
            print("\nMissing values found:")
            print(missing_values[missing_values > 0])
            
            # For numeric columns, fill with median
            numeric_cols = self.df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                if self.df[col].isnull().sum() > 0:
                    self.df[col].fillna(self.df[col].median(), inplace=True)
                    print(f"Filled {col} with median value")
            
            # For categorical columns, fill with mode
            categorical_cols = self.df.select_dtypes(include=['object']).columns
            for col in categorical_cols:
                if self.df[col].isnull().sum() > 0:
                    self.df[col].fillna(self.df[col].mode()[0], inplace=True)
                    print(f"Filled {col} with mode value")
        else:
            print("No missing values found in dataset!")
    
    def detect_outliers(self):
        """
        Detect and report outliers using IQR method
        """
        print("\n" + "="*80)
        print("OUTLIER DETECTION (IQR Method)")
        print("="*80)
        
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = self.df[(self.df[col] < lower_bound) | (self.df[col] > upper_bound)]
            if len(outliers) > 0:
                print(f"\n{col}:")
                print(f"  - Outliers detected: {len(outliers)} ({len(outliers)/len(self.df)*100:.2f}%)")
                print(f"  - Range: [{lower_bound:.2f}, {upper_bound:.2f}]")
    
    def analyze_class_imbalance(self):
        """
        Analyze class imbalance if target variable exists
        """
        print("\n" + "="*80)
        print("CLASS IMBALANCE ANALYSIS")
        print("="*80)
        
        # Look for potential target columns
        potential_targets = ['SeriousDlqin2yrs', 'target', 'default', 'label', 'class']
        
        for target in potential_targets:
            if target in self.df.columns:
                print(f"\nTarget Variable: {target}")
                value_counts = self.df[target].value_counts()
                print(value_counts)
                percentages = (value_counts / len(self.df) * 100).round(2)
                print(f"\nPercentages:")
                print(percentages)
                break
        else:
            print("No standard target variable found in dataset")
    
    def feature_importance_analysis(self):
        """
        Calculate feature importance using correlation
        """
        print("\n" + "="*80)
        print("FEATURE IMPORTANCE ANALYSIS")
        print("="*80)
        
        numeric_df = self.df.select_dtypes(include=[np.number])
        
        # Calculate correlation matrix
        correlation_matrix = numeric_df.corr()
        
        print("\nCorrelation Matrix (Top correlations):")
        # Get correlations with potential target
        if 'SeriousDlqin2yrs' in numeric_df.columns:
            target_corr = correlation_matrix['SeriousDlqin2yrs'].sort_values(ascending=False)
            print(target_corr)
        else:
            print("Correlation matrix calculated")
            
        return correlation_matrix
    
    def prepare_data_for_modeling(self):
        """
        Prepare data for machine learning models
        """
        print("\n" + "="*80)
        print("DATA PREPARATION FOR MODELING")
        print("="*80)
        
        # Encode categorical variables if any
        df_encoded = self.df.copy()
        
        categorical_cols = df_encoded.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            df_encoded = pd.get_dummies(df_encoded, columns=categorical_cols, drop_first=True)
            print(f"Encoded {len(categorical_cols)} categorical variables")
        
        print(f"Dataset shape after encoding: {df_encoded.shape}")
        
        return df_encoded
    
    def build_models(self, df_prepared):
        """
        Build multiple ML models
        """
        print("\n" + "="*80)
        print("BUILDING MACHINE LEARNING MODELS")
        print("="*80)
        
        # Identify numeric columns
        numeric_cols = df_prepared.select_dtypes(include=[np.number]).columns.tolist()
        
        # Find potential target variable
        target_col = None
        potential_targets = ['SeriousDlqin2yrs', 'target', 'default', 'label']
        for target in potential_targets:
            if target in numeric_cols:
                target_col = target
                break
        
        if target_col is None:
            print(f"\nWarning: No standard target found. Using last column as target: {numeric_cols[-1]}")
            target_col = numeric_cols[-1]
        
        X = df_prepared.drop(columns=[target_col])
        y = df_prepared[target_col]
        
        # Normalize features
        X_scaled = self.scaler.fit_transform(X)
        X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) < 10 else None
        )
        
        print(f"\nTraining set size: {len(X_train)}")
        print(f"Test set size: {len(X_test)}")
        print(f"Target variable: {target_col}")
        print(f"Number of features: {X.shape[1]}")
        
        # Model 1: Credit Risk Classification (Logistic Regression)
        print("\n" + "-"*40)
        print("MODEL 1: CREDIT RISK CLASSIFIER (Logistic Regression)")
        print("-"*40)
        
        risk_model = LogisticRegression(max_iter=1000, random_state=42)
        risk_model.fit(X_train, y_train)
        y_pred_risk = risk_model.predict(X_test)
        
        risk_metrics = {
            'accuracy': accuracy_score(y_test, y_pred_risk),
            'precision': precision_score(y_test, y_pred_risk, zero_division=0),
            'recall': recall_score(y_test, y_pred_risk, zero_division=0),
            'f1': f1_score(y_test, y_pred_risk, zero_division=0)
        }
        
        print(f"Accuracy: {risk_metrics['accuracy']:.4f}")
        print(f"Precision: {risk_metrics['precision']:.4f}")
        print(f"Recall: {risk_metrics['recall']:.4f}")
        print(f"F1-Score: {risk_metrics['f1']:.4f}")
        
        self.models['risk_classifier'] = {
            'model': risk_model,
            'metrics': risk_metrics,
            'features': X.columns.tolist()
        }
        
        # Model 2: Credit Limit Recommendation (Random Forest)
        print("\n" + "-"*40)
        print("MODEL 2: CREDIT LIMIT RECOMMENDATION (Random Forest)")
        print("-"*40)
        
        # For credit limit, we'll use a regression approach
        credit_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        credit_model.fit(X_train, y_train)
        y_pred_credit = credit_model.predict(X_test)
        
        credit_metrics = {
            'accuracy': accuracy_score(y_test, y_pred_credit),
            'precision': precision_score(y_test, y_pred_credit, zero_division=0),
            'recall': recall_score(y_test, y_pred_credit, zero_division=0),
            'f1': f1_score(y_test, y_pred_credit, zero_division=0)
        }
        
        print(f"Accuracy: {credit_metrics['accuracy']:.4f}")
        print(f"Precision: {credit_metrics['precision']:.4f}")
        print(f"Recall: {credit_metrics['recall']:.4f}")
        print(f"F1-Score: {credit_metrics['f1']:.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': credit_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
        
        self.models['credit_limit'] = {
            'model': credit_model,
            'metrics': credit_metrics,
            'features': X.columns.tolist(),
            'feature_importance': feature_importance
        }
        
        print("\n" + "-"*40)
        print("MODEL 3: DEFAULT PROBABILITY PREDICTOR (Gradient Boosting)")
        print("-"*40)
        
        default_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        default_model.fit(X_train, y_train)
        y_pred_default = default_model.predict(X_test)
        
        # Calculate RMSE for regression
        from sklearn.metrics import mean_squared_error
        rmse = np.sqrt(mean_squared_error(y_test, y_pred_default))
        
        print(f"RMSE: {rmse:.4f}")
        
        self.models['default_probability'] = {
            'model': default_model,
            'metrics': {'rmse': rmse},
            'features': X.columns.tolist()
        }
        
        return X_test, y_test
    
    def generate_report(self):
        """
        Generate comprehensive analysis report
        """
        print("\n" + "="*80)
        print("COMPREHENSIVE ANALYSIS REPORT")
        print("="*80)
        
        print("\n📊 DATASET STATISTICS:")
        print(f"  - Total Records: {len(self.df)}")
        print(f"  - Total Features: {self.df.shape[1]}")
        print(f"  - Numeric Features: {len(self.df.select_dtypes(include=[np.number]).columns)}")
        print(f"  - Categorical Features: {len(self.df.select_dtypes(include=['object']).columns)}")
        
        print("\n🎯 MODEL PERFORMANCE:")
        for model_name, model_info in self.models.items():
            print(f"\n  {model_name.upper()}:")
            for metric, value in model_info['metrics'].items():
                print(f"    - {metric}: {value:.4f}")
        
        print("\n✅ ANALYSIS COMPLETE")

# Main execution
if __name__ == "__main__":
    csv_path = '../dataset/cs-training.csv'
    
    analyzer = CreditLimitAnalyzer(csv_path)
    
    # Run all analyses
    analyzer.explore_data()
    analyzer.handle_missing_values()
    analyzer.detect_outliers()
    analyzer.analyze_class_imbalance()
    analyzer.feature_importance_analysis()
    
    df_prepared = analyzer.prepare_data_for_modeling()
    analyzer.build_models(df_prepared)
    analyzer.generate_report()
