
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form after success
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Reset success message after a delay
      setTimeout(() => {
        setSubmitSuccess(null);
      }, 5000);
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
      
      <div className="section-container">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="bg-aqua/10 px-4 py-1 rounded-md">Contact Me</span>
          </h2>
          <p className="section-subtitle">
            Let's collaborate on your next project
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card p-8 rounded-lg border border-border shadow-sm h-full">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-aqua/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-aqua" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <a href="mailto:hello@example.com" className="text-lg hover:text-aqua transition-colors">
                      hello@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-aqua/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-aqua" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                    <a href="tel:+1234567890" className="text-lg hover:text-aqua transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-aqua/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-aqua" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                    <p className="text-lg">San Francisco, CA</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Connect with me</h4>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-muted rounded-full hover:bg-aqua hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-muted rounded-full hover:bg-aqua hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-muted rounded-full hover:bg-aqua hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-lg border border-border shadow-sm"
            >
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              {submitSuccess === true && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                  Thank you for your message! I'll get back to you soon.
                </div>
              )}
              
              {submitSuccess === false && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  There was an error sending your message. Please try again.
                </div>
              )}
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-aqua/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-aqua/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-aqua/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-aqua/50"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-aqua text-white rounded-md font-medium flex items-center justify-center transition-colors hover:bg-aqua/90 focus:outline-none focus:ring-2 focus:ring-aqua/50 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
