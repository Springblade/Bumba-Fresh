import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
const faqs = [{
  question: "What's included in my subscription?",
  answer: "Your subscription includes weekly deliveries of fresh, pre-portioned ingredients and detailed recipe cards. You'll also get access to our recipe library, priority customer support, and exclusive member discounts."
}, {
  question: 'Can I skip weeks or pause my subscription?',
  answer: 'Yes! You can easily skip weeks or pause your subscription at any time. Just log into your account and manage your deliveries - no questions asked.'
}, {
  question: 'How far in advance can I customize my meals?',
  answer: 'You can customize your meals up to 3 weeks in advance. We recommend selecting your meals at least 5 days before your scheduled delivery to ensure availability.'
}, {
  question: 'What if I need to change my plan?',
  answer: 'You can change your plan at any time. Changes made before your weekly cutoff will apply to your next delivery. Any changes after the cutoff will apply to the following week.'
}, {
  question: 'Are there any commitments or cancellation fees?',
  answer: "No commitments or cancellation fees! You can cancel your subscription at any time. We want you to stay because you love our service, not because you're locked in."
}, {
  question: 'What about dietary restrictions and preferences?',
  answer: 'We offer a variety of meals suitable for different dietary preferences including vegetarian, vegan, and gluten-free options. You can customize your meal preferences in your account settings.'
}];
const FAQ = () => {
  return <Accordion.Root type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => <Accordion.Item key={index} value={`item-${index}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left">
              <span className="text-lg font-medium text-gray-900">
                {faq.question}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform duration-200 ease-out transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>)}
    </Accordion.Root>;
};
export default FAQ;