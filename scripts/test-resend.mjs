import { Resend } from 'resend'

const resend = new Resend('re_xxxxxxxxx') // replace with your real Resend API key

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'abhinavraj2510@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
})

if (error) {
  console.error('Resend error:', error)
  process.exit(1)
}

console.log('Email sent:', data)
