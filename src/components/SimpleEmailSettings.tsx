import React, { useState, useEffect } from 'react';
import { Mail, Settings, TestTube, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface SimpleEmailSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string) => void;
}

const SimpleEmailSettingsModal: React.FC<SimpleEmailSettingsProps> = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Load saved email from localStorage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userEmail', email);
    onSave(email);
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Test the Python email service connection
      const response = await fetch('http://localhost:5001/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-connection',
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test connection: ' + (error as Error).message,
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Email Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your-email@example.com"
              />
              <p className="text-sm text-gray-600 mt-1">
                We'll send meme stock alerts to this email address
              </p>
            </div>

            {/* Pre-configured Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Pre-configured Email Service</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Email notifications are sent from our secure Gmail service. 
                    No additional configuration needed!
                  </p>
                </div>
              </div>
            </div>

            {/* Test Connection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Test Email Service</h4>
                  <p className="text-sm text-gray-600">Verify the email service is working</p>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <TestTube className="w-4 h-4" />
                  <span>{testing ? 'Testing...' : 'Test Service'}</span>
                </button>
              </div>
              
              {testResult && (
                <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
                  testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">What You'll Receive:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Real-time meme stock alerts</li>
                <li>• Beautiful HTML email templates</li>
                <li>• Priority-based notifications</li>
                <li>• Stock data and volume analysis</li>
                <li>• Direct links to the dashboard</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!email}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailSettingsModal;
