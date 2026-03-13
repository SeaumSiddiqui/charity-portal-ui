import React from 'react';
import { Heart, Users, Globe, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const HomePage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  const features = [
    {
      icon: Heart,
      title: 'Charity Programs',
      description: 'Access various charity programs designed to support communities in need across Bangladesh.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with agents and authenticators who help facilitate your charity applications.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Be part of Qatar Charity\'s worldwide mission to provide humanitarian aid and development.',
    },
    {
      icon: Award,
      title: 'Transparent Process',
      description: 'Track your applications and enrollment status with our transparent and secure system.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Beneficiaries Served' },
    { number: '50+', label: 'Active Programs' },
    { number: '100+', label: 'Partner Organizations' },
    { number: '15+', label: 'Years of Service' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Qatar Charity
              <span className="block text-gray-100">Bangladesh</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Empowering communities through compassionate charity programs and sustainable development initiatives across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <Button
                  onClick={login}
                  variant="ghost"
                  size="lg"
                  className="bg-white text-primary-900 hover:bg-primary-900 hover:text-white shadow-xl font-semibold transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-primary-900 hover:bg-primary-900 hover:text-white shadow-xl font-semibold transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary-900 shadow-xl font-semibold transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-dark-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Serve Our Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our comprehensive platform connects beneficiaries with life-changing charity programs through a transparent and efficient process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-secondary-900/30 rounded-2xl mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary-900 dark:text-dark-primary-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Getting started with our charity programs is straightforward and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register & Apply',
                description: 'Create your account and work with our agents to submit your application for charity programs.',
              },
              {
                step: '02',
                title: 'Review & Verification',
                description: 'Our authenticators carefully review and verify your application to ensure eligibility.',
              },
              {
                step: '03',
                title: 'Enrollment & Support',
                description: 'Once approved, get enrolled in programs and receive ongoing support from our team.',
              },
            ].map((process, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center justify-center w-16 h-16 bg-primary-900 dark:bg-dark-primary-500 text-white rounded-full mx-auto mb-6 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {process.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 dark:from-dark-primary-900 dark:to-dark-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of beneficiaries who have transformed their lives through our charity programs.
          </p>
          {!isAuthenticated ? (
            <Button
              onClick={login}
              variant="ghost"
              size="lg"
              className="bg-white text-primary-900 hover:bg-primary-900 hover:text-white shadow-xl font-semibold transition-all duration-300"
            >
              Sign Up Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              className="bg-white text-primary-900 hover:bg-primary-900 hover:text-white shadow-xl font-semibold transition-all duration-300"
            >
              View Your Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-900 dark:bg-dark-primary-500 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Qatar Charity Bangladesh</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Dedicated to empowering communities through sustainable charity programs and humanitarian aid across Bangladesh.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dhaka, Bangladesh</li>
                <li>+880 1234 567890</li>
                <li>info@qcharity.bd</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Qatar Charity Bangladesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};