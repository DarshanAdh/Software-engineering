
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, rating, delay }) => {
  return (
    <div 
      className="glass-card p-6 rounded-2xl shadow-sm animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center mb-3">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} mr-1`} 
          />
        ))}
      </div>
      <p className="text-foreground mb-6">"{content}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="ml-3">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Stranded Driver",
      content: "I had a flat tire on the highway and was panicking. Within 15 minutes of using Roadside Rescue, a helper arrived and changed my tire. The real-time tracking was so reassuring!",
      rating: 5,
      delay: 0.1
    },
    {
      name: "Michael Chen",
      role: "Regular User",
      content: "My battery died in a shopping center parking lot. Used the app and someone came with a jump starter within 20 minutes. Transparent pricing and no surprises. Highly recommend!",
      rating: 5,
      delay: 0.2
    },
    {
      name: "David Rodriguez",
      role: "Helper",
      content: "Being a helper on Roadside Rescue has been great. I use my mechanical skills to help people and make extra income. The app makes it easy to find nearby jobs that I can quickly attend to.",
      rating: 5,
      delay: 0.3
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4 animate-slide-up opacity-0" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>What Our Users Say</h2>
          <p className="text-xl text-muted-foreground animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Real experiences from drivers and helpers in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
