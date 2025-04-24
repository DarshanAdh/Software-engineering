
import React from 'react';
import { Car, Clock, CreditCard, Map, Shield, Star } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:bg-secondary/50 animate-slide-up opacity-0" 
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="feature-icon-container">
        <div className="feature-icon-bg" />
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Car size={24} />,
      title: "Instant Assistance",
      description: "Request immediate help for flat tires, jump-starts, fuel delivery, and lockouts.",
      delay: 0.1
    },
    {
      icon: <Map size={24} />,
      title: "Real-Time Tracking",
      description: "Track your helper's location and ETA with live updates on our interactive map.",
      delay: 0.2
    },
    {
      icon: <Shield size={24} />,
      title: "Vetted Helpers",
      description: "All helpers undergo thorough background checks and skill verification.",
      delay: 0.3
    },
    {
      icon: <Clock size={24} />,
      title: "Quick Response",
      description: "Our network of helpers ensures assistance arrives in minutes, not hours.",
      delay: 0.4
    },
    {
      icon: <CreditCard size={24} />,
      title: "Transparent Pricing",
      description: "Know exactly what you'll pay with our clear, upfront service pricing.",
      delay: 0.5
    },
    {
      icon: <Star size={24} />,
      title: "Quality Assurance",
      description: "Rate and review helpers after each service to maintain high standards.",
      delay: 0.6
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4 animate-slide-up opacity-0" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>Why Choose Roadside Rescue?</h2>
          <p className="text-xl text-muted-foreground animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            We're revolutionizing roadside assistance with speed, reliability, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
