const formatValue = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return value.toString();
};

const generateNestedTable = (arrayOfObjects) => {
  if (arrayOfObjects.length === 0) return 'No items';

  return `
    <ul style="margin: 5px 0; padding-left: 20px;">
      ${arrayOfObjects.map(obj =>
    `<li>${obj.itemName} - Quantity: ${obj.quantity}</li>`
  ).join('')}
    </ul>
  `;
};

const generateArraySection = (title, arrayOfObjects) => {
  if (!arrayOfObjects || arrayOfObjects.length === 0) return '';

  return `
      <div style="margin: 20px 0;">
        <strong style="font-size: 16px;">${title}:</strong>
        ${generateNestedTable(arrayOfObjects)}
      </div>
    `;
};

const generateTable = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;"><strong>${key}</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;">${formatValue(value)}</td>
        </tr>
      `)
    .join('');
};

export const getEmailTemplate = (requirements) => {
  const { items, ...otherDetails } = requirements;

  return `
            <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

                    <h2 style="color: #2c3e50; margin-bottom: 20px;">Request for Proposal</h2>

                    <p>Dear Vendor,</p>

                    <p>We invite you to submit a proposal for the following requirements for our newly opened office</p>

                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Key Details:</strong>
                        <ul style="margin: 10px 0;">
                          ${generateArraySection('Items', items)}
                        </ul>
                    </div>

                     <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Other Details:</strong>
                        <ul style="margin: 10px 0;">
                          ${generateTable(otherDetails)}
                        </ul>
                    </div>

                    <p><strong>Note: Please make sure that your proposal should include your Company Name, Cost which we have to pay, Expected Delivery Date, and Last date for us to pay, otherwise we won't be able to accept your proposal</strong></p>
                    <p>We look forward to your proposal. Reply at <b>business@thiaoldaxo.resend.app</b></p>

                    <p>
                        Best regards,<br>
                                Sanyam Jain<br>
                                    Dev Solutions
                                </p>

                            </body>
                        </html>
                        `
}

export const emailTemplateRequestingResend = () => {
  return `
            <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

                    <h2 style="color: #2c3e50; margin-bottom: 20px;">I would like to inform you that your previous proposal was sent with incomplete information</h2>
                    <p><strong>Kindly make sure you have sent all the information which we had listed in our requirements in our first email</strong></p>

                    <p>
                        Best regards,<br>
                                Sanyam Jain<br>
                                    Dev Solutions
                                </p>

                            </body>
                        </html>
                        `
}

export const getEmailTemplateForPlacingOrder = (senderName) => {

  return `
            <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

                    <h2 style="color: #2c3e50; margin-bottom: 20px;">Congratulations 🎉</h2>

                    <p>Dear ${senderName}</p>

                    <p>We are glad to inform you that we are giving this order to you, please provide the services as you promised</p>

                    <p>
                        Best regards,<br>
                                Sanyam Jain<br>
                                    Dev Solutions
                                </p>

                            </body>
                        </html>
                        `
}

