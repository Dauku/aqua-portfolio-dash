
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Briefcase, GraduationCap, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CareerService, CareerItem } from '@/utils/airtable';
import { Skeleton } from '@/components/ui/skeleton';

export const CareerJourney = () => {
  const [filter, setFilter] = useState('all');
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  const { 
    data: careerItems, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['career'],
    queryFn: () => CareerService.getAll(),
    retry: 1
  });
  
  // Filter timeline items
  const filteredItems = !careerItems || careerItems.length === 0 
    ? [] 
    : filter === 'all' 
      ? careerItems 
      : careerItems.filter(item => item.type === filter);
  
  if (isLoading) {
    return (
      <div className="space-y-8 py-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error || !careerItems || careerItems.length === 0) {
    return (
      <section id="career">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="section-title text-2xl font-bold mb-4">
            <span className="bg-aqua/10 px-4 py-1 rounded-md">Career Journey</span>
          </h3>
          <p className="section-subtitle text-muted-foreground">
            My professional path and the skills I've developed along the way
          </p>
        </motion.div>
      
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No career data available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add career information in the Airtable "Career" table to display your professional journey here.
          </p>
        </div>
      </section>
    );
  }
  
  return (
    <section id="career">
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h3 className="section-title text-2xl font-bold mb-4">
          <span className="bg-aqua/10 px-4 py-1 rounded-md">Career Journey</span>
        </h3>
        <p className="section-subtitle text-muted-foreground">
          My professional path and the skills I've developed along the way
        </p>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {['all', 'work', 'education', 'achievement'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === type 
                  ? 'bg-aqua text-white shadow-md' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Timeline */}
      <div className="relative mt-12 ml-4 md:ml-0">
        {/* Vertical line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border z-0" />
        
        {filteredItems.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} isEven={index % 2 === 0} />
        ))}
      </div>
    </section>
  );
};

// Timeline item component
const TimelineItem = ({ 
  item, 
  index, 
  isEven 
}: { 
  item: CareerItem; 
  index: number; 
  isEven: boolean;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  // Determine icon component based on type
  const getIcon = (type: string) => {
    switch(type) {
      case 'work': return Briefcase;
      case 'education': return GraduationCap;
      case 'achievement': return Award;
      default: return Briefcase;
    }
  };
  
  // Determine icon background color based on type
  const getIconBg = (type: string) => {
    switch(type) {
      case 'work': return 'bg-aqua';
      case 'education': return 'bg-cream';
      case 'achievement': return 'bg-amber-500';
      default: return 'bg-muted';
    }
  };
  
  const Icon = getIcon(item.type);
  
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex md:items-center mb-12 md:mb-24 ${
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Timeline icon */}
      <div className="absolute md:static left-0 mt-1 flex items-center justify-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${getIconBg(item.type)} text-white`}>
          <Icon size={16} />
        </div>
      </div>
      
      {/* Content */}
      <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12 text-right' : 'md:pl-12'}`}>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
            <h3 className="text-lg font-bold text-primary">{item.title}</h3>
            <span className="text-sm text-muted-foreground">{item.period}</span>
          </div>
          <div className="mb-4">
            <p className="font-medium">{item.company}</p>
            <p className="text-sm text-muted-foreground">{item.location}</p>
          </div>
          <p className="text-sm mb-4">{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
