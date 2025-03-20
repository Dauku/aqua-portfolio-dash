
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

interface ContactProps {
  email: string;
  phone: string;
  location: string;
}

const Contact = ({ email, phone, location }: ContactProps) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  return (
    <section id="contact" className="py-10">
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
    </section>
  );
};

export default Contact;
