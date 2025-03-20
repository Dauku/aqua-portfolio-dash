
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ContactProps {
  email: string;
  phone: string;
  location: string;
}

const Contact = ({ email, phone, location }: ContactProps) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demonstration purposes, just show a toast
    toast({
      title: "Message Sent",
      description: "Thank you for your message. I'll get back to you soon!",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
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
                <a href={`mailto:${email}`} className="text-lg hover:text-aqua transition-colors">
                  {email}
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-aqua/10 p-3 rounded-full">
                <Phone className="h-5 w-5 text-aqua" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                <a href={`tel:${phone}`} className="text-lg hover:text-aqua transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-aqua/10 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-aqua" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                <p className="text-lg">{location}</p>
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
      
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
          <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Inquiry"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="I'd like to discuss a project..."
                rows={5}
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-aqua hover:bg-aqua/90 text-white">
              Send Message
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
