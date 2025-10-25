from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import json
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class EmailService:
    def __init__(self):
        # Pre-configured Gmail SMTP settings
        self.smtp_config = {
            'host': 'smtp.gmail.com',
            'port': 587,
            'username': 'liyunzi0902@gmail.com',  # Your Gmail as sender
            'password': 'pxhj mkgf jndg jhhb',    # Your app password
            'use_tls': True
        }
        self.default_recipient = 'liyunzi0902@gmail.com'  # Default recipient
    
    def create_email_template(self, alert_data):
        """Create beautiful HTML email template"""
        priority_emoji = {
            'high': '🔥',
            'medium': '⚡',
            'low': '📈'
        }
        
        priority_color = {
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981'
        }
        
        ticker = alert_data.get('ticker', 'UNKNOWN')
        priority = alert_data.get('priority', 'low')
        mention_count = alert_data.get('mentionCount', 0)
        volume_ratio = alert_data.get('volumeRatio', 1.0)
        current_price = alert_data.get('currentPrice', 0)
        price_change = alert_data.get('priceChange', 0)
        detected_at = alert_data.get('detectedAt', datetime.now().isoformat())
        
        subject = f"{priority_emoji[priority]} Meme Stock Alert: {ticker} - {priority.upper()} Priority"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meme Stock Alert</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                .alert-card {{ background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .ticker {{ font-size: 28px; font-weight: bold; color: {priority_color[priority]}; }}
                .priority {{ display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: {priority_color[priority]}20; color: {priority_color[priority]}; }}
                .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }}
                .stat {{ text-align: center; padding: 15px; background: #f1f3f4; border-radius: 8px; }}
                .stat-value {{ font-size: 24px; font-weight: bold; color: #1a1a1a; }}
                .stat-label {{ font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }}
                .price {{ font-size: 32px; font-weight: bold; color: {'#10b981' if price_change >= 0 else '#ef4444'}; }}
                .change {{ font-size: 16px; color: {'#10b981' if price_change >= 0 else '#ef4444'}; }}
                .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }}
                .cta-button {{ display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Meme Stock Alert</h1>
                    <p>Real-time social sentiment analysis detected unusual activity</p>
                </div>
                
                <div class="content">
                    <div class="alert-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div class="ticker">${ticker}</div>
                            <span class="priority">{priority}</span>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <div class="price">${current_price:.2f}</div>
                            <div class="change">{'+' if price_change >= 0 else ''}{price_change:.2f}%</div>
                        </div>
                        
                        <div class="stats">
                            <div class="stat">
                                <div class="stat-value">{mention_count}</div>
                                <div class="stat-label">Mentions</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">{volume_ratio:.1f}x</div>
                                <div class="stat-label">Volume Ratio</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">{datetime.fromisoformat(detected_at.replace('Z', '+00:00')).strftime('%H:%M')}</div>
                                <div class="stat-label">Detected</div>
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:3000" class="cta-button">View Dashboard</a>
                        </div>
                    </div>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #374151;">📊 Alert Details</h3>
                        <p style="margin: 5px 0; color: #6b7280;">
                            <strong>Stock:</strong> {ticker}<br>
                            <strong>Priority:</strong> {priority.upper()}<br>
                            <strong>Social Mentions:</strong> {mention_count} mentions detected<br>
                            <strong>Volume Spike:</strong> {volume_ratio:.1f}x average volume<br>
                            <strong>Current Price:</strong> ${current_price:.2f} ({'+' if price_change >= 0 else ''}{price_change:.2f}%)<br>
                            <strong>Detected:</strong> {datetime.fromisoformat(detected_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')}
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This alert was generated by the Meme Stock Alerts Dashboard</p>
                    <p>To unsubscribe or modify settings, visit your dashboard settings</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        MEME STOCK ALERT - {priority.upper()} PRIORITY
        
        Stock: {ticker}
        Price: ${current_price:.2f} ({'+' if price_change >= 0 else ''}{price_change:.2f}%)
        Social Mentions: {mention_count}
        Volume Ratio: {volume_ratio:.1f}x average
        Detected: {datetime.fromisoformat(detected_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')}
        
        View full dashboard: http://localhost:3000
        """
        
        return subject, html_content, text_content
    
    def send_email(self, to_email, alert_data):
        """Send email using Python SMTP"""
        try:
            subject, html_content, text_content = self.create_email_template(alert_data)
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_config['username']
            msg['To'] = to_email
            
            # Add text and HTML parts
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Connect to SMTP server
            server = smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port'])
            if self.smtp_config['use_tls']:
                server.starttls()
            
            server.login(self.smtp_config['username'], self.smtp_config['password'])
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent successfully to {to_email} for {alert_data.get('ticker')}")
            return True, "Email sent successfully"
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False, str(e)
    
    def test_connection(self):
        """Test SMTP connection"""
        try:
            server = smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port'])
            if self.smtp_config['use_tls']:
                server.starttls()
            server.login(self.smtp_config['username'], self.smtp_config['password'])
            server.quit()
            return True, "SMTP connection successful"
        except Exception as e:
            return False, str(e)

# Initialize email service
email_service = EmailService()

@app.route('/api/email', methods=['POST'])
def handle_email():
    """Handle email API requests"""
    try:
        data = request.get_json()
        action = data.get('action')
        
        if action == 'send-alert':
            alert_data = data.get('alert', {})
            to_email = data.get('email', email_service.default_recipient)
            
            if not to_email:
                return jsonify({'success': False, 'message': 'Email address required'}), 400
            
            success, message = email_service.send_email(to_email, alert_data)
            return jsonify({'success': success, 'message': message})
        
        elif action == 'test-connection':
            success, message = email_service.test_connection()
            return jsonify({'success': success, 'message': message})
        
        elif action == 'update-settings':
            # Only update recipient email, SMTP settings are pre-configured
            settings = data.get('settings', {})
            if settings and settings.get('email'):
                email_service.default_recipient = settings.get('email')
            return jsonify({'success': True, 'message': 'Email settings updated successfully'})
        
        else:
            return jsonify({'success': False, 'message': 'Invalid action'}), 400
            
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/email', methods=['GET'])
def get_email_info():
    """Get email service information"""
    return jsonify({
        'message': 'Python Email Service',
        'status': 'running',
        'smtp_host': email_service.smtp_config['host'],
        'smtp_port': email_service.smtp_config['port']
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Python Email Service'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
