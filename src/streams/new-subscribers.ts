'use server';
import ConfirmEmail from '../emails/emailConfirmation';
import * as React from 'react';
import prismaWithPulse from '../lib/db-with-pulse';
import { Resend } from 'resend';
import pRetry from 'p-retry';

// Initialize Resend client
const resendClient = new Resend(process.env.RESEND_API_KEY);

// Function to send user creation email
const sendUserCreationEmail = async (email: string, token: string) => {
  const from = `Email Confirmation <onboarding@resend.dev>`;
  const link = `${process.env.NEXT_PUBLIC_URL}/subscriber/confirm?token=${token}`;

  const emailOptions = {
    from,
    to: email,
    subject: 'Confirm your email',
    react: React.createElement(ConfirmEmail, {
      email,
      link,
    }),
  };

  console.log(emailOptions);

  return await resendClient.emails.send(emailOptions);
};

// Stream user creation events and send emails
const emailStream = async () => {
  const stream = await prismaWithPulse.subscriber.stream({
    name: 'new-subscribers', // Add `name` so that we never lose events
    create: {},
  });

  process.on('exit', (code) => {
    console.log('Closing Prisma Pulse Stream.');
    stream.stop();
  });

  for await (const event of stream) {
    console.log('Received event:', event);
    const { email, token } = event.created;

    // Rather than trying to catch an error, we rely on pulse to retry the event
    // This allows us to have a more resilient system that can handle intermittent network problems
    await sendUserCreationEmail(email, token);
  }
};

// Main function
async function main() {
  try {
    await pRetry(() => emailStream(), {
      // timeout stuff maybe
      retries: 3,
    });
  } catch (error) {
    // at this point we've already exhausted retries and still failing
    // Pulse still has the message though! we can go fix things and try this again
    // raise an alert or something here so we know it's wrong
    console.error('Failed to send emails:', error);
  }
}

// Run the main function
main();
