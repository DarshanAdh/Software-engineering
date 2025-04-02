
import React from 'react';
import { MapPin, Clock, CreditCard, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: "Request Help",
    description: "Enter your location and select the type of assistance you need.",
    icon: <MapPin className="w-6 h-6" />,
    delay: 0.1
  },
  {
    title: "Get Matched",
    description: "We'll connect you with a nearby helper with the right skills.",
    icon: <Car className="w-6 h-6" />,
    delay: 0.2
  },
  {
    title: "Track in Real-Time",
    description: "Follow your helper's progress on our live map as they head to your location.",
    icon: <Clock className="w-6 h-6" />,
    delay: 0.3
  },
  {
    title: "Pay & Review",
    description: "Pay securely through the app and rate your helper's service.",
    icon: <CreditCard className="w-6 h-6" />,
    delay: 0.4
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4 animate-slide-up opacity-0" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>How It Works</h2>
          <p className="text-xl text-muted-foreground animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Get back on the road in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center animate-slide-up opacity-0"
              style={{ animationDelay: `${step.delay}s`, animationFillMode: 'forwards' }}
            >
              <div className="feature-icon-container mb-6">
                <div className="feature-icon-bg" />
                {step.icon}
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+2rem)] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent hidden lg:block" />
              )}
              
              <span className="absolute top-3 -right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Button asChild size="lg" className="animate-slide-up opacity-0 btn-hover" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <Link to="/request">Need Help Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
