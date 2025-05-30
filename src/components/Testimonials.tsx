import React from 'react';
import { StarIcon } from 'lucide-react';
import GradientText from './GradientText';
const TestimonialCard = ({
  quote,
  author,
  rating,
  role,
  avatar = null
}) => {
  const initials = author.split(' ').map(n => n[0]).join('');
  return <div className="p-8 bg-white rounded-3xl border border-primary-100 hover:border-primary-300 transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-primary-100/30">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
      </div>
      <div className="mb-8 relative">
        <svg className="absolute -top-2 -left-2 h-8 w-8 text-primary-200 transform rotate-180 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
        <p className="text-gray-600 pl-6 text-lg leading-relaxed italic">
          {quote}
        </p>
      </div>
      <div className="flex items-center">
        {avatar ? <img src={avatar} alt={author} className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-primary-100" /> : <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium mr-4 shadow-lg">
            {initials}
          </div>}
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>;
};
const Testimonials = () => {
  const testimonials = [{
    quote: 'Bumba has transformed my cooking routine. The recipes are easy to follow and everything tastes amazing!',
    author: 'Sarah Johnson',
    role: 'Busy Professional',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  }, {
    quote: "The quality of ingredients is exceptional. It's made healthy eating so much more convenient.",
    author: 'Michael Chen',
    role: 'Fitness Enthusiast',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    quote: 'Perfect for our family. Even my picky eaters are trying new foods and enjoying them!',
    author: 'Jessica Williams',
    role: 'Parent of Two',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
  }];
  return <section className="w-full bg-gradient-to-b from-primary-50 to-white py-24" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <GradientText variant="primary">
              What Our Customers Say
            </GradientText>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who have transformed their
            dining experience with Bumba.
          </p>
        </div>
        {/* Background decoration */}
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute right-0 bottom-1/3 w-80 h-80 bg-secondary-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((testimonial, index) => <TestimonialCard key={index} {...testimonial} />)}
        </div>
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">
                Ready to experience Bumba?
              </h3>
              <p className="text-white/90">
                Join our community of food lovers and start enjoying delicious,
                healthy meals today.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <button className="px-8 py-4 bg-white text-primary-600 hover:bg-gray-50 rounded-full font-medium transition-all duration-300 shadow-lg transform hover:-translate-y-1 button-hover-effect">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Testimonials;