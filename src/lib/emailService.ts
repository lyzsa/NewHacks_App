import nodemailer from 'nodemailer';
import { EmailNotification, EmailSettings, EmailTemplate } from '@/types/email';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private settings: EmailSettings;

  constructor(settings: EmailSettings) {
    this.settings = settings;
    this.transporter = nodemailer.createTransport({
      host: settings.smtpConfig.host,
      port: settings.smtpConfig.port,
      secure: settings.smtpConfig.secure,
      auth: settings.smtpConfig.auth,
    });
  }

  private generateEmailTemplate(alert: EmailNotification): EmailTemplate {
    const priorityEmoji = {
      high: '🔥',
      medium: '⚡',
      low: '📈'
    };

    const priorityColor = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };

    const subject = `${priorityEmoji[alert.priority]} Meme Stock Alert: ${alert.ticker} - ${alert.priority.toUpperCase()} Priority`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meme Stock Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .alert-card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .ticker { font-size: 28px; font-weight: bold; color: ${priorityColor[alert.priority]}; }
          .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${priorityColor[alert.priority]}20; color: ${priorityColor[alert.priority]}; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat { text-align: center; padding: 15px; background: #f1f3f4; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }
          .price { font-size: 32px; font-weight: bold; color: ${alert.priceChange >= 0 ? '#10b981' : '#ef4444'}; }
          .change { font-size: 16px; color: ${alert.priceChange >= 0 ? '#10b981' : '#ef4444'}; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
          .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
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
                <div class="ticker">$${alert.ticker}</div>
                <span class="priority">${alert.priority}</span>
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <div class="price">$${alert.currentPrice.toFixed(2)}</div>
                <div class="change">${alert.priceChange >= 0 ? '+' : ''}${alert.priceChange.toFixed(2)}%</div>
              </div>
              
              <div class="stats">
                <div class="stat">
                  <div class="stat-value">${alert.mentionCount}</div>
                  <div class="stat-label">Mentions</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${alert.volumeRatio.toFixed(1)}x</div>
                  <div class="stat-label">Volume Ratio</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${new Date(alert.detectedAt).toLocaleTimeString()}</div>
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
                <strong>Stock:</strong> ${alert.ticker}<br>
                <strong>Priority:</strong> ${alert.priority.toUpperCase()}<br>
                <strong>Social Mentions:</strong> ${alert.mentionCount} mentions detected<br>
                <strong>Volume Spike:</strong> ${alert.volumeRatio.toFixed(1)}x average volume<br>
                <strong>Current Price:</strong> $${alert.currentPrice.toFixed(2)} (${alert.priceChange >= 0 ? '+' : ''}${alert.priceChange.toFixed(2)}%)<br>
                <strong>Detected:</strong> ${new Date(alert.detectedAt).toLocaleString()}
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
    `;

    const text = `
      MEME STOCK ALERT - ${alert.priority.toUpperCase()} PRIORITY
      
      Stock: ${alert.ticker}
      Price: $${alert.currentPrice.toFixed(2)} (${alert.priceChange >= 0 ? '+' : ''}${alert.priceChange.toFixed(2)}%)
      Social Mentions: ${alert.mentionCount}
      Volume Ratio: ${alert.volumeRatio.toFixed(1)}x average
      Detected: ${new Date(alert.detectedAt).toLocaleString()}
      
      View full dashboard: http://localhost:3000
    `;

    return { subject, html, text };
  }

  async sendAlert(alert: EmailNotification): Promise<boolean> {
    if (!this.settings.enabled) {
      console.log('Email notifications disabled');
      return false;
    }

    // Check if we should send based on priority settings
    const shouldSend = 
      (alert.priority === 'high' && this.settings.highPriorityOnly) ||
      (alert.priority === 'medium' && this.settings.mediumPriorityOnly) ||
      (alert.priority === 'low' && this.settings.lowPriorityOnly);

    if (!shouldSend) {
      console.log(`Skipping email for ${alert.ticker} - priority ${alert.priority} not enabled`);
      return false;
    }

    try {
      const template = this.generateEmailTemplate(alert);
      
      const mailOptions = {
        from: `"Meme Stock Alerts" <${this.settings.smtpConfig.auth.user}>`,
        to: this.settings.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully for ${alert.ticker}:`, result.messageId);
      
      return true;
    } catch (error) {
      console.error(`Failed to send email for ${alert.ticker}:`, error);
      return false;
    }
  }

  async sendBulkAlerts(alerts: EmailNotification[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const alert of alerts) {
      const success = await this.sendAlert(alert);
      if (success) {
        sent++;
      } else {
        failed++;
      }
      
      // Add small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { sent, failed };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}
