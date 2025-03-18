
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

// Career timeline data
const careerData = [
  {
    id: 1,
    type: 'work',
    title: 'Senior Frontend Developer',
    company: 'TechNova Solutions',
    location: 'San Francisco, CA',
    period: '2020 - Present',
    description: 'Led the frontend development team in creating responsive, accessible web applications. Implemented modern frontend practices and mentored junior developers.',
    skills: ['React', 'TypeScript', 'GraphQL', 'Design Systems'],
    icon: Briefcase
  },
  {
    id: 2,
    type: 'education',
    title: 'Master in Computer Science',
    company: 'Stanford University',
    location: 'Stanford, CA',
    period: '2018 - 2020',
    description: 'Specialized in Human-Computer Interaction and User Experience Design. Thesis on adaptive user interfaces for accessibility.',
    skills: ['Research', 'UI/UX', 'Prototyping', 'Accessibility'],
    icon: GraduationCap
  },
  {
    id: 3,
    type: 'work',
    title: 'UX Designer & Developer',
    company: 'Creative Digital Agency',
    location: 'New York, NY',
    period: '2016 - 2018',
    description: 'Created digital experiences for clients across various industries. Combined design thinking with technical implementation.',
    skills: ['UI Design', 'JavaScript', 'CSS Animation', 'Responsive Design'],
    icon: Briefcase
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Design Excellence Award',
    company: 'International Design Association',
    location: 'Global',
    period: '2017',
    description: 'Received recognition for outstanding contributions to digital design in the e-commerce sector.',
    skills: [],
    icon: Award
  },
  {
    id: 5,
    type: 'education',
    title: 'Bachelor in Design & Computing',
    company: 'University of Sydney',
    location: 'Sydney, Australia',
    period: '2012 - 2016',
    description: 'Double major in Interactive Media and Software Development. Graduated with honors.',
    skills: ['Interaction Design', 'Web Development', 'User Research'],
    icon: GraduationCap
  },
];

// Skills data
const skills = [
  { name: 'Frontend Development', level: 95 },
  { name: 'UI/UX Design', level: 90 },
  { name: 'Backend Development', level: 75 },
  { name: 'Mobile Development', level: 70 },
  { name: 'Project Management', level: 80 },
];

const Career = () => {
  const [filter, setFilter] = useState('all');
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  // Filter timeline items
  const filteredItems = filter === 'all' 
    ? careerData 
    : careerData.filter(item => item.type === filter);
  
  return (
    <section id="career" className="py-24 bg-secondary/20">
      <div className="section-container">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="bg-aqua/10 px-4 py-1 rounded-md">Career Journey</span>
          </h2>
          <p className="section-subtitle">
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
        
        {/* Skills section */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center mb-12">Skills & Expertise</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <SkillBar 
                key={skill.name} 
                skill={skill} 
                index={index} 
              />
            ))}
          </div>
        </div>
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
  item: typeof careerData[0]; 
  index: number; 
  isEven: boolean;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  // Determine icon background color based on type
  const getIconBg = (type: string) => {
    switch(type) {
      case 'work': return 'bg-aqua';
      case 'education': return 'bg-cream';
      case 'achievement': return 'bg-amber-500';
      default: return 'bg-muted';
    }
  };
  
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
          <item.icon size={16} />
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
          
          {item.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.skills.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs bg-muted rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Skill bar component
const SkillBar = ({ 
  skill, 
  index 
}: { 
  skill: { name: string; level: number }; 
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
          className="h-full bg-aqua"
        />
      </div>
    </motion.div>
  );
};

export default Career;
