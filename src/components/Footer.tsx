import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <a href="#" className="text-primary-600 text-xl font-semibold mb-4 block">
              Bumba
            </a>
            <p className="text-gray-600 mb-6">
              Fresh ingredients and delicious recipes delivered to your door. We
              make healthy eating convenient and enjoyable.
            </p>
            <div className="flex space-x-4">
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => <a key={i} href="#" className="text-gray-400 hover:text-primary-600 transition-colors" aria-label={`Social link ${i + 1}`}>
                  <Icon className="h-5 w-5" />
                </a>)}
            </div>
          </div>
          {/* Our Company Column */}
          <div>
            <h3 className="text-base font-semibold mb-4">Our Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Press'].map(item => <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
          {/* Resources Column */}
          <div>
            <h3 className="text-base font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {['FAQs', 'Cooking Tips', 'Meal Planning', 'Gift Cards'].map(item => <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                      {item}
                    </a>
                  </li>)}
            </ul>
          </div>
          {/* Contact Us Column */}
          <div>
            <h3 className="text-base font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@bumba.com" className="text-gray-600 hover:text-primary-600 transition-colors">
                  support@bumba.com
                </a>
              </li>
              <li>
                <a href="tel:(800) 555-1234" className="text-gray-600 hover:text-primary-600 transition-colors">
                  (800) 555-1234
                </a>
              </li>
              <li className="text-gray-600">
                123 Healthy Way
                <br />
                Foodville, CA 90210
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2023 Bumba. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(item => <a key={item} href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">
                  {item}
                </a>)}
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;