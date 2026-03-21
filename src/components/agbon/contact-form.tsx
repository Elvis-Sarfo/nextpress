'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'
import { AgbonSectionTitle } from './section-title'
import { t as agbonT } from '@/lib/agbon-translations'

interface ContactFormProps {
  locale?: string
  badge?: string
  title?: string
  subtitle?: string
  description?: string
  email?: string
  phone?: string
  address?: string
  formTitle?: string
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  submitLabel?: string
  submittingLabel?: string
  subjectOptions?: Array<{ label: string; value: string }>
  showContactInfo?: boolean
}

export function AgbonContactForm({
  locale = 'en',
  badge,
  title,
  subtitle,
  description,
  email = 'info@agbon.com',
  phone = '+1 (555) 123-4567',
  address = 'Industrial Park, Zone A',
  formTitle = 'Send Us a Message',
  successTitle = 'Message sent successfully!',
  successMessage = "We'll get back to you as soon as possible.",
  errorTitle = 'Failed to send message',
  submitLabel = 'Send Message',
  submittingLabel = 'Sending...',
  subjectOptions = [],
  showContactInfo = true,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: '', message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const resolvedSubjectOptions = subjectOptions.length > 0
    ? subjectOptions
    : [
        { label: 'Product Inquiry', value: 'product-inquiry' },
        { label: 'After Sales Support', value: 'after-sales' },
        { label: 'Partnership Opportunity', value: 'partnership' },
        { label: 'General Inquiry', value: 'general' },
        { label: 'Other', value: 'other' },
      ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        const data = await res.json()
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to send message.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // <div className="max-w-6xl mx-auto"> 
      <div className={showContactInfo ? 'grid lg:grid-cols-3 gap-8' : ''}>
        {showContactInfo && (
          <div className="lg:col-span-1 space-y-6">
            <div>
              <AgbonSectionTitle
                title={title || agbonT('contact.heading', locale)}
                subTitle={subtitle || badge || agbonT('contact.subtitle', locale)}
              />
              <p className="text-gray-600 mt-3 text-sm">{description || agbonT('contact.description', locale)}</p>
            </div>
            <div className="space-y-4">
              {[
                { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: phone, href: `tel:${phone}` },
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: email, href: `mailto:${email}` },
                { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: address },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-[#FF6B35] mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[#1a1a1a] hover:text-[#FF6B35] transition">{item.value}</a>
                    ) : (
                      <p className="text-sm text-[#1a1a1a]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={showContactInfo ? 'lg:col-span-2' : ''}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{formTitle}</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">{successTitle}</h3>
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-1">{errorTitle}</h3>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    value={formData.name} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    id="phone" name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company / Farm Name</label>
                  <input
                    id="company" name="company" type="text"
                    value={formData.company} onChange={handleChange}
                    placeholder="Your company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject" name="subject" required
                  value={formData.subject} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition bg-white"
                >
                  <option value="">Select a subject</option>
                  {resolvedSubjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message" name="message" required rows={6}
                  value={formData.message} onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A24] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? submittingLabel : submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    // </div>
  )
}
