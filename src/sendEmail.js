const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'ap-south-1' });

exports.handler = async (event) => {
    try {

        //Any auth/middleware stuff will be done her e, like discord account validation etc , which will be parsed from a JWT which is passed through the authentication header.

        // Parse the POST request body
        const body = JSON.parse(event.body);
        
        // Extract email details from the request body
        const { source, destination, subject, bodyText, bodyHtml } = body;
        
        // Validate that required fields are present
        if (!source || !destination || !subject || !bodyText) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required parameters' }),
            };
        }

        // Set up email parameters
        const emailParams = {
            Source: source,
            Destination: {
                ToAddresses: destination, // 'destination' should be an array of email addresses
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8'
                },
                Body: {
                    Text: {
                        Data: bodyText,
                        Charset: 'UTF-8'
                    },
                    // Optional HTML body
                    ...(bodyHtml && {
                        Html: {
                            Data: bodyHtml,
                            Charset: 'UTF-8'
                        }
                    })
                }
            }
        };

        // Send the email
        const result = await ses.sendEmail(emailParams).promise();
        console.log('Email sent successfully:', result);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully', result }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email', details: error.message }),
        };
    }
};
