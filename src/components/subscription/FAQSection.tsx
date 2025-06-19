import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import GradientText from '../GradientText';
import { motion, AnimatePresence } from 'framer-motion';
const faqs = [{
  question: 'How does the subscription work?',
  answer: "Choose your preferred plan, select your meals weekly, and we'll deliver them fresh to your door. You can skip weeks, pause, or cancel anytime."
}, {
  question: 'Can I customize my meal selections?',
  answer: 'Yes! Each week you can choose from our rotating menu of 20+ dishes, including vegetarian, vegan, and protein-rich options.'
}, {
  question: 'What if I need to skip a week?',
  answer: 'No problem! You can skip weeks or pause your subscription easily through your account with no penalties. Just let us know 5 days before your next delivery.'
}, {
  question: 'How fresh are the meals?',
  answer: 'All meals are prepared fresh with high-quality ingredients and delivered within 24 hours of preparation to ensure maximum freshness.'
}, {
  question: 'Are there any commitments?',
  answer: 'None at all. While we offer subscriptions for convenience and savings, you can cancel anytime with no cancellation fees.'
}];
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return <section className="w-full bg-white py-24" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center mb-12">
            <GradientText variant="primary">
              Frequently Asked Questions
            </GradientText>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors" aria-expanded={openIndex === index}>
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === index && <motion.div initial={{
                height: 0
              }} animate={{
                height: 'auto'
              }} exit={{
                height: 0
              }} transition={{
                duration: 0.2
              }} className="overflow-hidden">
                      <div className="p-6 pt-0 text-gray-600 bg-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default FAQSection;