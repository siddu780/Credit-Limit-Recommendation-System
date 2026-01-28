import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your Credit Limit Assistant. I can help you with:\n\n💳 Credit & Financial Questions\n🗺️ App Navigation\n💡 Financial Tips\n❓ FAQs\n\nHow can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const { addNotification } = useNotification();

  // Comprehensive Knowledge Base
  const knowledgeBase = {
    // CREDIT SCORE QUESTIONS
    creditScore: {
      keywords: ['credit score', 'score', 'rating', 'credit rating'],
      response: `📊 CREDIT SCORE EXPLAINED:\n\nYour credit score is a 3-digit number (300-850) that shows how creditworthy you are.\n\n✅ SCORE RANGES:\n• 300-649: Poor Credit\n• 650-699: Fair Credit  \n• 700-749: Good Credit\n• 750+: Excellent Credit\n\n📈 WHAT AFFECTS YOUR SCORE:\n1. Payment History (35%) - Pay on time\n2. Credit Utilization (30%) - Keep below 30%\n3. Credit History Length (15%) - Keep old accounts\n4. Credit Mix (10%) - Different types of credit\n5. Hard Inquiries (10%) - Limit applications\n\n💡 TIP: Check your score in Financial Advice page!\n\nWant tips on improving your score?`,
    },

    // HOW TO IMPROVE CREDIT
    improveCredit: {
      keywords: ['improve', 'better score', 'increase', 'boost', 'raise', 'enhance credit'],
      response: `🚀 HOW TO IMPROVE YOUR CREDIT SCORE:\n\n1️⃣ PAY BILLS ON TIME (Most Important!)\n   • Set up automatic payments\n   • Never miss a payment date\n   • Impact: 35% of your score\n\n2️⃣ LOWER CREDIT UTILIZATION\n   • Use less than 30% of your limit\n   • If limit is $10,000, use max $3,000\n   • Impact: 30% of your score\n\n3️⃣ KEEP OLD ACCOUNTS OPEN\n   • Don't close old credit cards\n   • Longer history = higher score\n   • Impact: 15% of your score\n\n4️⃣ MIX YOUR CREDIT TYPES\n   • Have credit cards + loans\n   • Shows you can handle different credit\n   • Impact: 10% of your score\n\n5️⃣ LIMIT CREDIT APPLICATIONS\n   • Only apply when necessary\n   • Multiple applications hurt your score\n   • Impact: 10% of your score\n\n⏱️ Timeline: Score improvements take 3-6 months\n\nReady for personalized recommendations? Visit "Get Recommendation" page!`,
    },

    // DEBT MANAGEMENT
    debtManagement: {
      keywords: ['debt', 'owe', 'owing', 'loans', 'pay off', 'reduce debt'],
      response: `💳 DEBT MANAGEMENT GUIDE:\n\n❌ BAD DEBT HABITS:\n• Missing payment deadlines\n• High credit card balances\n• Multiple high-interest loans\n• Maxing out credit cards\n\n✅ GOOD DEBT MANAGEMENT:\n\n1️⃣ KNOW YOUR DEBT-TO-INCOME RATIO\n   • Divide total debts by monthly income\n   • Keep it below 43%\n   • Example: $5,000 debt ÷ $15,000 income = 33% ✓\n\n2️⃣ PRIORITIZE HIGH-INTEREST DEBT\n   • Pay credit cards first\n   • Then personal loans\n   • Then mortgages\n\n3️⃣ DEBT CONSOLIDATION\n   • Combine multiple debts into one\n   • Lower interest rate\n   • Single monthly payment\n\n4️⃣ PAYMENT STRATEGIES\n   • Debt Snowball: Pay smallest debts first\n   • Debt Avalanche: Pay highest interest first\n\n5️⃣ NEGOTIATE WITH CREDITORS\n   • Ask for lower interest rates\n   • Many will work with you\n\n💡 Use the Risk Analysis page to see your debt distribution!`,
    },

    // CREDIT LIMIT RECOMMENDATION
    creditLimit: {
      keywords: ['credit limit', 'how much', 'recommendation', 'get limit', 'limit increase'],
      response: `💰 CREDIT LIMIT RECOMMENDATIONS:\n\nWe calculate your recommended credit limit based on:\n\n📊 FACTORS WE ANALYZE:\n• Your Age\n• Your Annual Income\n• Your Current Debt\n• Your Debt-to-Income Ratio\n• Your Credit Score\n• Your Employment Status\n\n📈 HOW IT WORKS:\n1. Click "Get Recommendation" on Dashboard\n2. Enter your financial information\n3. System analyzes your profile\n4. You get a personalized credit limit\n5. Also see: Risk Level & Default Probability\n\n💡 HIGHER CREDIT LIMITS FOR:\n✓ Stable income\n✓ Low debt ratio\n✓ Good payment history\n✓ Older age (25-65)\n✓ Good credit score\n\n📉 LOWER CREDIT LIMITS FOR:\n✗ Unstable income\n✗ High debt ratio\n✗ Recent late payments\n✗ Very young or very old\n✗ Poor credit score\n\n⚡ READY TO GET YOUR RECOMMENDATION?\nVisit Dashboard → "Get Recommendation" button\n\nHave questions about your specific recommendation?`,
    },

    // FINANCIAL ADVICE & TIPS
    financialAdvice: {
      keywords: ['financial advice', 'tips', 'guidance', 'financial help', 'money management'],
      response: `💡 FINANCIAL ADVICE & MONEY MANAGEMENT:\n\n🎯 4 KEY AREAS WE FOCUS ON:\n\n1️⃣ DEBT MANAGEMENT\n   • Keep debt-to-income ratio low\n   • Pay down high-interest debt\n   • Consider consolidation\n   • Never miss payments\n\n2️⃣ CREDIT BUILDING\n   • Monitor credit score monthly\n   • Request credit increases\n   • Keep old accounts active\n   • Limit credit applications\n\n3️⃣ SPENDING HABITS\n   • Use 30% rule (30% utilization)\n   • Set budget for discretionary spending\n   • Avoid unnecessary credit applications\n   • Track spending monthly\n\n4️⃣ INCOME GROWTH\n   • Develop new skills\n   • Explore side income\n   • Negotiate salary increases\n   • Build 3-6 month emergency fund\n\n📄 PERSONALIZED ADVICE:\nVisit Financial Advice page for tailored recommendations based on YOUR profile!\n\n📊 DOWNLOAD YOUR REPORT:\nClick "Download Report" to get a personalized PDF with tips just for you!\n\nWhat specific financial topic interests you?`,
    },

    // FAQ - Getting Started
    gettingStarted: {
      keywords: ['getting started', 'how do i', 'start', 'begin', 'first time', 'new user'],
      response: `🚀 GETTING STARTED GUIDE:\n\n1️⃣ CREATE YOUR ACCOUNT\n   • Click "Register" on login page\n   • Enter name, email, password\n   • Confirm registration\n\n2️⃣ LOGIN\n   • Use your email and password\n   • You're now on Dashboard!\n\n3️⃣ EXPLORE MAIN PAGES\n   📊 Dashboard: Overview & stats\n   📈 Analytics: See data patterns\n   💡 Recommendation: Get credit limit\n   📉 Risk Analysis: Understand your risk\n   💰 Financial Advice: Get personalized tips\n   🤖 Model Insights: How system works\n   👤 Profile: Manage your info\n   (If Admin) 👨‍💼 Admin Panel: Manage users\n\n4️⃣ GET YOUR FIRST RECOMMENDATION\n   • Go to Dashboard\n   • Click "Get Recommendation"\n   • Enter your income, age, debt\n   • See your personalized credit limit!\n\n5️⃣ CHECK FINANCIAL ADVICE\n   • Go to Financial Advice page\n   • View tips for your situation\n   • Download your personalized PDF report\n\n💡 TIP: Start with Dashboard to understand what we offer!\n\nNeed help with a specific page?`,
    },

    // NAVIGATION HELP
    navigation: {
      keywords: ['navigate', 'navigation', 'how to find', 'where is', 'which page', 'go to'],
      response: `🗺️ NAVIGATION GUIDE:\n\n📊 DASHBOARD (Main Page)\n   What: Overview of your credit profile\n   How: Click "💳 Credit Limit System" logo\n   Shows: Stats, quick buttons, charts\n\n📈 DATA ANALYTICS\n   What: Patterns in dataset & statistics\n   How: Click "Analytics" in navbar\n   Shows: Feature distributions, data quality\n\n💡 GET RECOMMENDATION\n   What: Your personalized credit limit\n   How: Click "Get Recommendation" button\n   Shows: Recommended limit, risk level, score\n\n📉 RISK ANALYSIS\n   What: Your credit risk assessment\n   How: Click "Risk Analysis" button\n   Shows: Risk distribution, default probability\n\n💰 FINANCIAL ADVICE\n   What: Personalized financial tips\n   How: Click "Financial Advice" button\n   Shows: Tips, download report, take action\n\n🤖 MODEL INSIGHTS\n   What: How our system makes decisions\n   How: Click "Model Insights" button\n   Shows: Feature importance, accuracy\n\n👤 PROFILE\n   What: Your personal information\n   How: Click "Profile" in navbar\n   Shows: Your details, credit profile\n\n👨‍💼 ADMIN PANEL (Admin only)\n   What: Manage users & system\n   How: Click "Admin Panel" button\n   Shows: User list, analytics\n\nNeed specific help on any page?`,
    },

    // RECOMMENDATION PAGE
    recommendationPage: {
      keywords: ['recommendation', 'get recommendation', 'credit limit calculator'],
      response: `💡 HOW THE RECOMMENDATION PAGE WORKS:\n\n1️⃣ WHAT IS IT?\n   A calculator that shows your personalized credit limit\n\n2️⃣ WHAT YOU NEED TO ENTER:\n   • Age: Your current age\n   • Annual Income: Your yearly earnings\n   • Debt Ratio: Your current debt level\n   • Credit Score: Your FICO score (300-850)\n\n3️⃣ WHAT YOU GET BACK:\n   ✅ Recommended Credit Limit (e.g., $5,000)\n   ✅ Risk Level (Low/Medium/High)\n   ✅ Default Probability (% chance you won't pay)\n   ✅ Health Score (0-100, higher is better)\n   ✅ Detailed Explanation\n\n4️⃣ HOW IT CALCULATES:\n   • Analyzes your income vs debt\n   • Checks your credit history\n   • Considers your age and stability\n   • Compares to thousands of users\n   • Recommends safe limit for you\n\n5️⃣ WHAT IT MEANS:\n   Higher Limit = Bank thinks you're trustworthy\n   Lower Limit = Work on improving credit first\n\n💡 TIPS:\n   • Higher income = higher limit\n   • Lower debt = higher limit\n   • Better credit score = higher limit\n   • More stable = higher limit\n\n🔄 CHECK OFTEN:\n   As your situation improves, limits increase!\n\nReady to check your recommendation?`,
    },

    // ANALYTICS PAGE
    analyticsPage: {
      keywords: ['analytics', 'data analytics', 'statistics', 'patterns', 'trends'],
      response: `📊 ANALYTICS PAGE EXPLAINED:\n\n1️⃣ WHAT IS ANALYTICS?\n   Shows patterns in our database of credit users\n\n2️⃣ WHAT YOU'LL SEE:\n   \n   📈 AGE DISTRIBUTION\n   Shows how many users in each age group\n   Helps you see where you fit\n   \n   💰 INCOME DISTRIBUTION\n   Shows income ranges of all users\n   Compare your income to others\n   \n   🏷️ CLASS DISTRIBUTION\n   Credit classes: Poor/Fair/Good/Excellent\n   See what % are in each class\n   \n   📉 DEBT RATIO DISTRIBUTION\n   Shows debt levels across users\n   See healthy vs unhealthy ranges\n\n3️⃣ WHY IT MATTERS:\n   • Understand where you stand\n   • See healthy benchmarks\n   • Identify improvement areas\n   • Learn from other users\n\n4️⃣ DATA QUALITY INFO:\n   • Total users in database\n   • Missing data (if any)\n   • Outliers detected\n   • Data completeness %\n\n💡 USE IT TO:\n   ✓ Benchmark your situation\n   ✓ Find realistic goals\n   ✓ Understand your risk level\n\nConfused about a statistic?`,
    },

    // RISK ANALYSIS PAGE
    riskAnalysisPage: {
      keywords: ['risk analysis', 'risk', 'default', 'probability', 'danger'],
      response: `📉 RISK ANALYSIS PAGE EXPLAINED:\n\n1️⃣ WHAT IS RISK ANALYSIS?\n   Predicts how likely you are to default (not pay back credit)\n\n2️⃣ RISK CATEGORIES:\n   \n   🟢 LOW RISK (45% of users)\n   • Stable payments\n   • Good credit score\n   • Low debt ratio\n   • Higher credit limits\n   \n   🟡 MEDIUM RISK (35% of users)\n   • Some missed payments\n   • Fair credit score\n   • Moderate debt\n   • Standard limits\n   \n   🔴 HIGH RISK (20% of users)\n   • Recent missed payments\n   • Poor credit score\n   • High debt ratio\n   • Lower limits\n\n3️⃣ DEFAULT PROBABILITY:\n   Shows % chance you won't pay back\n   Example: 5% default probability = 95% will pay\n   \n   Healthy Levels:\n   • 0-5%: Excellent (green)\n   • 5-10%: Good (yellow)\n   • 10%+: Risky (red)\n\n4️⃣ 6-MONTH TREND:\n   Shows if your risk is improving/worsening\n   Going down? Good, you're improving!\n   Going up? Take action to improve credit\n\n5️⃣ RISK FACTORS:\n   • Payment history\n   • Income stability\n   • Debt level\n   • Age and employment\n\n💡 HOW TO LOWER YOUR RISK:\n   ✓ Pay bills on time\n   ✓ Reduce debt\n   ✓ Increase income\n   ✓ Build credit history\n\nWant tips to reduce your risk?`,
    },

    // FINANCIAL ADVICE PAGE
    financialAdvicePage: {
      keywords: ['financial advice page', 'advice page', 'tips page'],
      response: `💰 FINANCIAL ADVICE PAGE FEATURES:\n\n1️⃣ FOUR TIP CATEGORIES:\n   \n   💳 DEBT MANAGEMENT\n   • Keep ratio below 43%\n   • Pay bills on time\n   • Diversify debt types\n   • Consider consolidation\n   \n   📈 CREDIT BUILDING\n   • Monitor monthly\n   • Request increases\n   • Keep old accounts\n   • Limit applications\n   \n   💸 SPENDING HABITS\n   • Use 30% rule\n   • Autopay bills\n   • Avoid unnecessary apps\n   • Track spending\n   \n   📊 INCOME GROWTH\n   • Build new skills\n   • Side income\n   • Negotiate salary\n   • Save emergency fund\n\n2️⃣ QUICK ACTIONS:\n   \n   ✅ CHECK CREDIT SCORE\n   • See YOUR personalized score\n   • Get explanation\n   • See improvement tips\n   \n   📥 DOWNLOAD REPORT\n   • Personalized PDF report\n   • Downloads instantly to device\n   • Includes your score + tips\n   \n   📞 SCHEDULE CONSULTATION\n   • Book meeting with advisor\n   • Free for registered users\n   • Get personalized guidance\n   \n   🎯 VIEW GOALS\n   • Short-term (3 months)\n   • Medium-term (6 months)\n   • Long-term (1 year)\n\n3️⃣ YOUR PERSONALIZED REPORT:\n   • Your credit score\n   • Detailed recommendations\n   • Action steps\n   • Timeline for improvement\n   • Financial guidelines\n\n💡 BEST FEATURE:\n   Download Report = Your personalized action plan!\n\nWant to download your report now?`,
    },

    // ADMIN PANEL
    adminPanel: {
      keywords: ['admin', 'admin panel', 'manage users', 'administration'],
      response: `👨‍💼 ADMIN PANEL EXPLAINED:\n\n⚠️ ADMIN ONLY ACCESS\nOnly users with "Admin" role can access this page.\n\n1️⃣ WHAT CAN ADMINS DO?\n   \n   👥 MANAGE USERS\n   • See all registered users\n   • View user details\n   • Promote users to admin\n   • Demote admins to regular users\n   • Disable user accounts\n   \n   📊 VIEW SYSTEM ANALYTICS\n   • Total users count\n   • Number of admins\n   • Active users\n   • System accuracy %\n\n2️⃣ USER MANAGEMENT:\n   \n   PROMOTE TO ADMIN\n   • Click "Make Admin" button\n   • User gets admin access\n   • Can access Admin Panel\n   • Can manage other users\n   \n   DEMOTE FROM ADMIN\n   • Click "Demote" button\n   • User becomes regular user\n   • Loses admin access\n   • Back to regular features\n   \n   DISABLE USER\n   • Click "Disable" button\n   • User account locked\n   • Cannot login\n   • Can be re-enabled\n\n3️⃣ NOTIFICATIONS:\n   When you make changes:\n   • Green notification = Success\n   • Red notification = Error\n   • Auto-disappears after 5 seconds\n\n4️⃣ SYSTEM ANALYTICS TAB:\n   • Total users in system\n   • Admin count\n   • Active users\n   • Model accuracy (92.5%)\n\n💡 ADMIN RESPONSIBILITIES:\n   ✓ Fair user management\n   ✓ Monitor system health\n   ✓ Assist with issues\n   ✓ Maintain database\n\n📌 NOTE: You're an admin if you have admin role!\n\nNeed help managing users?`,
    },

    // PDF REPORT & DOWNLOAD
    pdfReport: {
      keywords: ['report', 'download', 'pdf', 'download report', 'pdf report'],
      response: `📄 PDF REPORT DOWNLOAD:\n\n1️⃣ WHAT IS THE PDF REPORT?\n   A personalized document with:\n   • Your credit score\n   • Financial analysis\n   • Personalized recommendations\n   • Action steps\n   • Timeline for improvement\n\n2️⃣ HOW TO DOWNLOAD:\n   Step 1: Go to "Financial Advice" page\n   Step 2: Click "Download Report" button\n   Step 3: Wait for \"⏳ Generating...\" message\n   Step 4: PDF automatically downloads\n   Step 5: Check Downloads folder\n\n3️⃣ FILE DETAILS:\n   Name: Financial_Report_YourName_[date].pdf\n   Size: ~100-200 KB\n   Format: Standard PDF (opens in any reader)\n   Compatible: All devices\n\n4️⃣ WHAT'S IN THE REPORT?\n   \n   📊 YOUR INFORMATION\n   • Name\n   • Email\n   • Generation date\n   \n   💳 CREDIT SCORE ANALYSIS\n   • Your current score\n   • Score range explanation\n   • Factors affecting your score\n   \n   💡 FINANCIAL RECOMMENDATIONS\n   • 6 actionable tips\n   • Personalized to your situation\n   • Priority order\n   • Timeline: 3-6 months\n\n5️⃣ HOW TO USE THE REPORT:\n   ✓ Share with financial advisor\n   ✓ Print for reference\n   ✓ Track improvements\n   ✓ Follow action plan\n   ✓ Monitor progress\n\n6️⃣ INSTANT DOWNLOAD:\n   ✅ No email needed\n   ✅ No delays\n   ✅ Instant to your device\n   ✅ Private & secure\n\n🔒 YOUR DATA:\n   • Only you can download\n   • Secure transmission\n   • Stored safely\n\n💡 TIP: Download monthly to track improvement!\n\nReady to get your report?`,
    },

    // GENERAL FAQ
    faq: {
      keywords: ['faq', 'frequently asked', 'question', 'help', '?'],
      response: `❓ FREQUENTLY ASKED QUESTIONS:\n\n1️⃣ IS MY DATA SAFE?\n   ✅ YES - Encrypted & secure\n   ✅ We don't sell your data\n   ✅ Only you can see your info\n\n2️⃣ HOW OFTEN UPDATES RECOMMENDATIONS?\n   → Whenever you update your profile\n   → Daily system recalculation\n   → Check back weekly\n\n3️⃣ CAN I CHANGE MY PASSWORD?\n   → Yes, in Profile page\n   → Settings → Change Password\n\n4️⃣ WHAT IF I FORGOT PASSWORD?\n   → Contact support\n   → Email: support@creditlimit.com\n   → We'll reset for you\n\n5️⃣ HOW ACCURATE IS THE SYSTEM?\n   → 92.5% accuracy on predictions\n   → Based on 10,000+ users\n   → Continuously improving\n\n6️⃣ CAN I DELETE MY ACCOUNT?\n   → Contact admin\n   → Email: support@creditlimit.com\n   → Request account deletion\n\n7️⃣ HOW LONG TO SEE IMPROVEMENTS?\n   → 3-6 months typically\n   → Depends on your actions\n   → Monthly tracking recommended\n\n8️⃣ WHY IS MY LIMIT LOW?\n   → Low income\n   → High debt ratio\n   → Poor credit score\n   → Unstable employment\n   → Check Recommendation page for details\n\n9️⃣ HOW DO I IMPROVE FAST?\n   1. Pay bills on time\n   2. Lower credit utilization\n   3. Pay down debt\n   4. Build income\n   5. Check results monthly\n\n🔟 STILL HAVE QUESTIONS?\n   Email: support@creditlimit.com\n   Phone: +1 (800) 123-4567\n   Hours: Mon-Fri, 9 AM - 5 PM\n\nWhat else can I help with?`,
    },

    // PROFILE PAGE
    profilePage: {
      keywords: ['profile', 'my profile', 'account', 'personal information', 'profile page'],
      response: `👤 PROFILE PAGE GUIDE:\n\n1️⃣ WHAT'S ON PROFILE PAGE?\n   \n   📝 PERSONAL INFORMATION\n   • Your name\n   • Your email\n   • Account creation date\n   \n   💼 EMPLOYMENT INFO\n   • Employment status\n   • Job title\n   • Company\n   \n   💰 FINANCIAL INFORMATION\n   • Annual income\n   • Current debt\n   • Debt-to-income ratio\n   \n   📊 CREDIT INFORMATION\n   • Credit score\n   • Account status\n   • Last update\n\n2️⃣ EDIT YOUR INFORMATION:\n   Step 1: Click edit button\n   Step 2: Update your info\n   Step 3: Click save\n   Step 4: Notification appears\n   Step 5: Changes saved\n\n3️⃣ WHAT YOU CAN CHANGE:\n   ✓ Name\n   ✓ Phone number\n   ✓ Income\n   ✓ Debt amount\n   ✓ Employment status\n   ✗ Email (contact support)\n   ✗ Credit score (automatic)\n\n4️⃣ WHY UPDATE PROFILE?\n   • Keep info current\n   • Get accurate recommendations\n   • Improve credit calculations\n   • Track your progress\n\n5️⃣ SECURITY OPTIONS:\n   • Change password\n   • View login history\n   • Manage sessions\n\n💡 TIP: Update after major life changes!\n   • New job (income change)\n   • Pay off debt\n   • Loan approval\n   • Promotion/raise\n\n🔒 PRIVACY:\n   • Your data is private\n   • Only admins can see profile\n   • Encrypted transmission\n\nWant to update your profile?`,
    },

    // DEFAULT RESPONSE
    default: {
      keywords: [],
      response: `👋 I didn't quite understand that. I can help you with:\n\n💳 CREDIT TOPICS\n• Credit scores & ratings\n• How to improve credit\n• Credit limits\n• Debt management\n\n🗺️ NAVIGATION\n• Finding pages\n• Using features\n• Dashboard guide\n• Report downloads\n\n💡 FINANCIAL GUIDANCE\n• Money management tips\n• Debt strategies\n• Budgeting advice\n• Financial goals\n\n❓ FREQUENTLY ASKED QUESTIONS\n• Safety & privacy\n• Account management\n• Technical issues\n• How features work\n\n📖 TRY ASKING:\n• "What is a credit score?"\n• "How do I improve my credit?"\n• "How does analytics work?"\n• "How to get recommendations?"\n• "What's in the report?"\n\nWhat would you like to know?`,
    },
  };

  // Smart response matching
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Check each knowledge base item
    for (const [key, item] of Object.entries(knowledgeBase)) {
      if (key === 'default') continue;
      for (const keyword of item.keywords) {
        if (message.includes(keyword)) {
          return item.response;
        }
      }
    }

    return knowledgeBase.default.response;
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
    };

    setMessages([...messages, userMessage]);

    // Notification for sent message
    addNotification('Message sent to assistant', 'info');

    // Add bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(input),
      };
      setMessages((prev) => [...prev, botResponse]);
      
      // Notification for bot response
      addNotification('New response from assistant', 'info');
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          title="Open Chat"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <h3>💳 Credit Assistant</h3>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message ${msg.type}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
