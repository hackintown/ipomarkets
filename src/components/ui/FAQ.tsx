"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
    {
        question: "What services does your IPO markets platform offer?",
        answer: "Our IPO markets platform provides comprehensive services including pre-IPO analysis, market timing recommendations, IPO pricing insights, and post-IPO performance tracking. We help investors make informed decisions about upcoming and recent public offerings."
    },
    {
        question: "How do you source your IPO data and insights?",
        answer: "We aggregate data from multiple reliable sources including SEC filings, investment banks, financial news outlets, and proprietary algorithms. Our team of financial analysts then reviews this information to provide accurate, timely, and actionable insights."
    },
    {
        question: "Can I get alerts for upcoming IPOs that match my investment criteria?",
        answer: "Yes, our platform allows you to set custom alerts based on industry, expected valuation, growth metrics, and other parameters. You'll receive notifications when IPOs matching your criteria are announced or when significant updates occur."
    },
    {
        question: "Do you provide analysis on international IPO markets?",
        answer: "Absolutely. While we have deep coverage of US markets, our platform also tracks and analyzes significant IPOs in major global markets including Europe, Asia, and emerging markets, giving you a comprehensive view of worldwide IPO activity."
    }
]

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section className="py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4 lg:mb-6">
                Frequently Asked&nbsp;
                <span className="text-primary mt-2">Questions</span>
            </h2>
            <p className="mt-2 max-w-3xl mx-auto text-base font-light lg:text-lg text-muted-foreground text-center mb-8">
                We are a company with a DNA of entrepreneurship, and hence, we value
                the time and money invested by our clients.
            </p>
            <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-4">
                        <button
                            className="flex justify-between items-center w-full text-left border border-border p-4 bg-card focus:rounded-b-none rounded-lg focus:outline-none"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={activeIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <span className="text-lg font-medium">{faq.question}</span>
                            <span className="ml-6 flex-shrink-0">
                                {activeIndex === index ? '−' : '+'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    id={`faq-answer-${index}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >   
                                    <div className="p-4 bg-background rounded-b-lg shadow-sm">
                                        <p className="text-foreground">{faq.answer}</p>
                                    </div>
                                </motion.div>   
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    )
}
