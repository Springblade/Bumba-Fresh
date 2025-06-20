import React, { lazy } from 'react';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import GradientText from './GradientText';
const HealthyInsights = () => {
  const articles = [{
    title: 'Simple Tips for Healthy Eating',
    excerpt: 'Discover easy ways to incorporate healthier choices into your daily routine.',
    date: 'May 15, 2023',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    gradient: 'from-secondary-500 to-secondary-600',
    author: 'Dr. Emma Roberts',
    authorRole: 'Nutritionist',
    authorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  }, {
    title: 'Meal Prep Made Easy',
    excerpt: 'Learn how to efficiently prepare meals for the entire week in just a few hours.',
    date: 'May 12, 2023',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790',
    gradient: 'from-primary-500 to-primary-600',
    author: 'Chef Michael Torres',
    authorRole: 'Culinary Expert',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  }, {
    title: 'Benefits of Home Cooking',
    excerpt: 'Why preparing meals at home can improve your health, budget, and family relationships.',
    date: 'May 10, 2023',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f',
    gradient: 'from-accent-500 to-accent-600',
    author: 'Lisa Johnson',
    authorRole: 'Health Coach',
    authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg'
  }];
  return <section className="w-full bg-white" id="insights">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-4">
          <GradientText variant="primary">Latest Healthy Insights</GradientText>
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
          Expert tips and advice for a healthier lifestyle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map(article => <div key={article.title} className="group blog-card">
              <div className="aspect-[3/2] relative overflow-hidden">
                <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
                    Nutrition
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-primary-500" />
                    {article.date}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-primary-500" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="font-bold text-2xl mb-3 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={article.authorAvatar} alt={article.author} className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-primary-100" />
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {article.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {article.authorRole}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                    Read more
                    <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium transition-all duration-300 flex items-center mx-auto">
            View All Articles
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>;
};
export default HealthyInsights;