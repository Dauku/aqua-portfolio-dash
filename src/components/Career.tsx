
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { Briefcase, GraduationCap, Award } from 'lucide-react';
import { Badge } from './ui/badge';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

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

// Skills data ordered by category
const skillsData = [
  {
    category: "web",
    title: "Web Development",
    skills: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'PHP', icon: 'php' },
      { name: 'SQL', icon: 'sql' },
      { name: 'Bootstrap', icon: 'bootstrap' },
      { name: 'Bubble.io', icon: 'bubble' },
      { name: 'Figma', icon: 'figma' },
    ]
  },
  {
    category: "api",
    title: "API & Integration",
    skills: [
      { name: 'API Integration', icon: 'api' },
      { name: 'Postman', icon: 'postman' },
      { name: 'N8N', icon: 'n8n' },
      { name: 'OpenAI', icon: 'openai' },
    ]
  },
  {
    category: "software",
    title: "Software Development",
    skills: [
      { name: 'C++', icon: 'cpp' },
      { name: 'C#', icon: 'csharp' },
      { name: 'Unity', icon: 'unity' },
      { name: 'Arduino', icon: 'arduino' },
      { name: 'Java', icon: 'java' },
    ]
  },
  {
    category: "data",
    title: "Data & Analytics",
    skills: [
      { name: 'BigQuery', icon: 'bigquery' },
      { name: 'Metabase', icon: 'metabase' },
      { name: 'Airtable', icon: 'airtable' },
      { name: 'Airbyte', icon: 'airbyte' },
    ]
  },
  {
    category: "other",
    title: "Other Skills",
    skills: [
      { name: 'Network', icon: 'network' },
      { name: 'Project Management', icon: 'project' },
    ]
  }
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
        
        {/* Skills section with logos */}
        <div className="mt-24">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-10">
                {/* All skills in one continuous flow */}
                <div className="flex flex-wrap justify-center gap-4">
                  {skillsData.flatMap(category => 
                    category.skills.map((skill, skillIndex) => (
                      <SkillIcon 
                        key={`${category.category}-${skill.name}`} 
                        skill={skill} 
                        category={category.title}
                        index={skillIndex} 
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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

// Individual skill icon component with SVG logos
const SkillIcon = ({ 
  skill, 
  category,
  index 
}: { 
  skill: { name: string; icon: string }; 
  category: string;
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  // Function to render SVG icons
  const renderIcon = (iconName: string) => {
    const commonClasses = "w-6 h-6 mb-2";
    const primaryColor = "#278783"; // aqua
    const secondaryColor = "#FFEBD0"; // cream
    
    switch(iconName) {
      case 'html':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.08 0L4.282 8.094H19.864L19.397 13.103H3.824L3.034 21.188H18.608L17.894 24H3.568L4.282 16H16.963L17.429 10.992H4.73L5.08 0Z" fill={primaryColor}/>
          </svg>
        );
      case 'css':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3L4.35 6.5H17.75L17.4 8.5H4L3.3 12H16.7L16 16L10.55 17.95L5.55 16L5.85 14H2.35L1.8 18.5L10.55 22L20.2 18.5L22 3H5Z" fill={primaryColor}/>
          </svg>
        );
      case 'javascript':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H24V24H0V0ZM22.034 18.276C21.843 17.236 21.129 16.351 19.203 15.507C18.425 15.131 17.562 14.886 17.363 14.285C17.29 13.898 17.299 13.697 17.39 13.455C17.582 12.786 18.315 12.594 18.891 12.786C19.258 12.914 19.598 13.186 19.82 13.628C20.946 12.876 20.946 12.876 21.691 12.378C21.411 11.924 21.267 11.724 21.072 11.532C20.459 10.855 19.594 10.505 18.312 10.532C18.149 10.559 17.986 10.578 17.822 10.605C17.159 10.769 16.525 11.105 16.144 11.578C15.144 12.815 15.457 15.003 16.744 15.898C18.004 16.892 19.884 17.095 20.104 17.953C20.315 18.957 19.52 19.369 18.477 19.213C17.738 19.011 17.31 18.64 16.923 18.013C16.104 18.494 16.104 18.494 15.261 18.985C15.495 19.512 15.743 19.747 16.094 20.088C18.185 21.993 23.025 21.929 23.865 19.013C23.892 18.94 24.028 18.421 23.867 17.492L22.034 18.276ZM13.053 11.105H10.856C10.856 13.129 10.847 15.135 10.847 17.168C10.847 18.386 10.91 19.494 10.701 19.84C10.374 20.524 9.559 20.406 9.146 20.251C8.714 20.025 8.505 19.712 8.296 19.323C8.241 19.204 8.204 19.112 8.185 19.103C7.393 19.594 6.601 20.088 5.809 20.579C6.174 21.347 6.693 21.993 7.357 22.416C8.398 23.065 9.819 23.229 11.295 22.937C12.236 22.717 13.053 22.242 13.543 21.466C14.197 20.515 14.105 19.331 14.097 18.002C14.115 15.709 14.097 13.416 14.097 11.114L13.053 11.105Z" fill={primaryColor}/>
          </svg>
        );
      case 'php':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.018C5.377 6.018 0 8.232 0 11C0 13.768 5.377 15.982 12 15.982C18.623 15.982 24 13.768 24 11C24 8.232 18.623 6.018 12 6.018ZM7.285 8.528H8.855L8.414 10.968H9.747C10.459 10.968 10.947 10.845 11.206 10.6C11.466 10.355 11.563 9.939 11.4 9.35L10.959 7.255H12.522L12.978 9.45C13.262 10.513 13.123 11.283 12.559 11.758C11.994 12.233 11.044 12.473 9.706 12.473H8.249L7.973 13.995H6.41L7.285 8.528ZM13.56 13.995L14.435 8.528H16.005L15.564 10.968H16.897C17.608 10.968 18.097 10.845 18.356 10.6C18.616 10.355 18.712 9.939 18.55 9.35L18.109 7.255H19.671L20.128 9.45C20.411 10.513 20.273 11.283 19.708 11.758C19.144 12.233 18.193 12.473 16.856 12.473H15.398L15.124 13.995H13.56ZM0.921 13.995L1.796 8.528H3.366L2.925 10.968H4.258C4.97 10.968 5.458 10.845 5.718 10.6C5.978 10.355 6.074 9.939 5.912 9.35L5.471 7.255H7.034L7.49 9.45C7.773 10.513 7.635 11.283 7.07 11.758C6.506 12.233 5.556 12.473 4.219 12.473H2.76L2.484 13.995H0.921Z" fill={primaryColor}/>
          </svg>
        );
      case 'sql':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.22 2 5 3.79 5 6V18C5 20.21 8.22 22 12 22C15.78 22 19 20.21 19 18V6C19 3.79 15.78 2 12 2ZM17 18C17 18.5 15.1 20 12 20C8.9 20 7 18.5 7 18V15.82C8.45 16.82 10.56 17 12 17C13.44 17 15.55 16.82 17 15.82V18ZM17 13.5C17 14 15.1 15.5 12 15.5C8.9 15.5 7 14 7 13.5V11.32C8.45 12.32 10.56 12.5 12 12.5C13.44 12.5 15.55 12.32 17 11.32V13.5ZM12 10.5C8.9 10.5 7 9 7 8.5V6C7 5.5 8.9 4 12 4C15.1 4 17 5.5 17 6V8.5C17 9 15.1 10.5 12 10.5Z" fill={primaryColor}/>
          </svg>
        );
      case 'bootstrap':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.75 2C3.68 2 2 3.68 2 5.75V18.25C2 20.32 3.68 22 5.75 22H18.25C20.32 22 22 20.32 22 18.25V5.75C22 3.68 20.32 2 18.25 2H5.75ZM12.95 16.27C14.03 16.27 14.85 15.97 15.4 15.38C15.95 14.79 16.23 13.98 16.23 12.94C16.23 12.23 16.05 11.63 15.7 11.17C15.35 10.7 14.85 10.38 14.2 10.2C14.72 10 15.13 9.71 15.4 9.32C15.67 8.94 15.8 8.45 15.8 7.85C15.8 6.89 15.53 6.15 15 5.63C14.47 5.1 13.67 4.83 12.61 4.83H8.27V16.27H12.95ZM10.11 6.39H12.27C12.88 6.39 13.33 6.52 13.62 6.79C13.92 7.05 14.06 7.44 14.06 7.94C14.06 8.46 13.91 8.85 13.62 9.13C13.33 9.4 12.87 9.54 12.24 9.54H10.11V6.39ZM10.11 11.05H12.58C13.26 11.05 13.76 11.2 14.1 11.5C14.44 11.8 14.61 12.24 14.61 12.82C14.61 13.39 14.44 13.82 14.11 14.13C13.77 14.43 13.28 14.59 12.62 14.59H10.11V11.05Z" fill={primaryColor}/>
          </svg>
        );
      case 'bubble':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 13H13V16.5C13 17.05 12.55 17.5 12 17.5C11.45 17.5 11 17.05 11 16.5V13H7.5C6.95 13 6.5 12.55 6.5 12C6.5 11.45 6.95 11 7.5 11H11V7.5C11 6.95 11.45 6.5 12 6.5C12.55 6.5 13 6.95 13 7.5V11H16.5C17.05 11 17.5 11.45 17.5 12C17.5 12.55 17.05 13 16.5 13Z" fill={primaryColor}/>
          </svg>
        );
      case 'figma':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 2H8.5C6.57 2 5 3.57 5 5.5C5 7.043 6.013 8.329 7.42 8.817C6.013 9.305 5 10.591 5 12.134C5 13.677 6.013 14.963 7.42 15.451C6.013 15.939 5 17.224 5 18.768C5 20.695 6.57 22.268 8.5 22.268C10.43 22.268 12 20.695 12 18.768V15.451C12.62 15.683 13.297 15.817 14 15.817C16.76 15.817 19 13.58 19 10.817C19 8.054 16.76 5.817 14 5.817C13.297 5.817 12.62 5.951 12 6.183V5.5C12 3.57 10.43 2 8.5 2ZM11 18.634C11 20.055 9.921 21.134 8.5 21.134C7.079 21.134 6 20.055 6 18.634C6 17.213 7.079 16.134 8.5 16.134C9.921 16.134 11 17.213 11 18.634ZM11 12C11 13.421 9.921 14.5 8.5 14.5C7.079 14.5 6 13.421 6 12C6 10.579 7.079 9.5 8.5 9.5C9.921 9.5 11 10.579 11 12ZM14 14.5C11.791 14.5 10 12.709 10 10.5C10 8.291 11.791 6.5 14 6.5C16.209 6.5 18 8.291 18 10.5C18 12.709 16.209 14.5 14 14.5ZM8.5 8.5C7.079 8.5 6 7.421 6 6C6 4.579 7.079 3.5 8.5 3.5H11V8.5H8.5Z" fill={primaryColor}/>
          </svg>
        );
      case 'api':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20V8H22V4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V8H4V4ZM20 20H4V16H2V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V16H20V20ZM14.89 8.7L13.41 10.18C13.78 10.695 14 11.315 14 12C14 13.66 12.66 15 11 15C9.34 15 8 13.66 8 12C8 10.34 9.34 9 11 9C11.685 9 12.305 9.22 12.82 9.59L14.3 8.11C13.33 7.41 12.215 7 11 7C8.235 7 6 9.235 6 12C6 14.765 8.235 17 11 17C13.765 17 16 14.765 16 12C16 10.785 15.59 9.67 14.89 8.7ZM18.5 12C18.5 12.83 18.32 13.62 18.03 14.36L19.83 15.3C20.27 14.29 20.5 13.175 20.5 12C20.5 10.825 20.27 9.71 19.83 8.7L18.03 9.64C18.32 10.38 18.5 11.17 18.5 12ZM3.5 12C3.5 11.17 3.68 10.38 3.97 9.64L2.17 8.7C1.73 9.71 1.5 10.825 1.5 12C1.5 13.175 1.73 14.29 2.17 15.3L3.97 14.36C3.68 13.62 3.5 12.83 3.5 12Z" fill={primaryColor}/>
          </svg>
        );
      case 'postman':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.527 10.777L17.61 6.693L18.318 7.4L14.232 11.485L13.527 10.777ZM21.063 7.5C21.063 7.5 21.468 6.64 20.723 5.897C19.978 5.153 19.118 5.558 19.118 5.558L12.005 12.67L11.979 14.388L13.697 14.362L20.808 7.25C20.808 7.25 21.063 7.5 21.063 7.5ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4Z" fill={primaryColor}/>
          </svg>
        );
      case 'n8n':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM7.5 15H10.5V18H13.5V15H16.5V12H13.5V9H10.5V12H7.5V15ZM18 9H15V6H12V9H9V12H12V15H15V12H18V9Z" fill={primaryColor}/>
          </svg>
        );
      case 'openai':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6604 9.90617C19.2488 8.27409 18.9903 6.48763 18.028 5.10593C16.6463 3.14065 14.0345 2.62576 11.962 3.8388L9.9376 1.97857C9.6731 1.73688 9.26389 1.75958 9.02596 2.02861L6.27579 5.06613C6.0379 5.33516 6.06107 5.74381 6.33009 5.9817L8.35001 7.8437C7.86945 9.69281 8.45777 11.7112 10.0159 13.0067C11.5978 14.3243 13.79 14.5657 15.5726 13.7909L17.5923 15.6488C17.8568 15.8909 18.266 15.868 18.5039 15.5992L21.2541 12.5617C21.4918 12.2927 21.4688 11.884 21.1996 11.6463L19.1793 9.79072C19.0197 9.83655 18.8464 9.87757 18.6604 9.90617ZM9.6731 10.8499C8.50246 9.81924 8.23339 8.10384 9.06251 6.74531L11.2547 8.74214C11.5192 8.9838 11.9282 8.9608 12.1664 8.6918L14.2905 6.34595C15.5726 6.49355 16.5968 7.40255 16.8555 8.67074C17.0999 9.88831 16.3897 10.9646 15.4192 11.3962C15.0215 10.6288 14.2336 10.082 13.3171 9.99301C11.9282 9.86153 10.7462 10.6977 10.2429 11.9334C9.97848 11.6006 9.8014 11.2376 9.6731 10.8499ZM16.3438 12.7576L14.1515 10.7608C13.3171 10.4051 12.3389 10.698 11.9053 11.5265L9.78094 13.875C9.46255 15.1842 10.0732 16.548 11.3095 17.1357C12.6064 17.7614 14.1667 17.2693 14.9095 16.0591C15.1349 15.7259 15.2905 15.3553 15.3785 14.9768C16.4804 14.775 17.402 14.0839 17.8596 13.0757C17.3563 13.0069 16.8438 12.9076 16.3438 12.7576ZM10.1259 18.9417L8.19634 17.1589C7.93223 16.9174 7.52327 16.9401 7.28534 17.2091L4.53516 20.2466C4.29727 20.5157 4.32045 20.9242 4.58947 21.1623L6.51939 22.9451C6.78388 23.1867 7.19309 23.164 7.43103 22.8949L10.1812 19.8575C10.4191 19.5883 10.3959 19.1796 10.1259 18.9417ZM15.7713 22.9373L17.7047 21.1546C17.9688 20.913 17.9458 20.5043 17.6768 20.2666L14.9266 17.2291C14.6576 16.9913 14.2487 17.0143 14.0108 17.2832L12.0774 19.066C11.8131 19.3078 11.8361 19.7162 12.105 19.9541L14.8552 22.9917C15.1244 23.2297 15.5335 23.2068 15.7713 22.9373ZM2.97058 13.8756L4.90483 15.6583C5.16932 15.8998 5.57828 15.8773 5.81647 15.6082L8.56664 12.5707C8.80453 12.3015 8.78111 11.893 8.51233 11.6551L6.57808 9.87241C6.31359 9.63072 5.90438 9.65341 5.66669 9.92244L2.91651 12.9599C2.67863 13.229 2.70155 13.6375 2.97058 13.8756Z" fill={primaryColor}/>
          </svg>
        );
      case 'cpp':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 15.97L10.91 14.8H13.07L13.5 15.97H14.5L12.5 10.03H11.5L9.5 15.97H10.5ZM11.27 13.88L12 11.47L12.73 13.88H11.27ZM5 15.97H10V14.97H5V15.97ZM14 15.97H19V14.97H14V15.97ZM14.5 12.97H16.5V10.97H18.5V12.97H20.5V9.97H14.5V12.97ZM7 9.97H3V10.97H5V16.97H7V9.97ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill={primaryColor}/>
          </svg>
        );
      case 'csharp':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 15.97L11.91 14.8H14.07L14.5 15.97H15.5L13.5 10.03H12.5L10.5 15.97H11.5ZM12.27 13.88L13 11.47L13.73 13.88H12.27ZM18.5 12.97H17.5V14.97H16.5V12.97H15.5V11.97H16.5V9.97H17.5V11.97H18.5V12.97ZM20.5 11.97H21.5V12.97H20.5V11.97ZM19.5 9.97H20.5V10.97H19.5V9.97ZM20.5 13.97H21.5V14.97H20.5V13.97ZM19.5 15.97H20.5V16.97H19.5V15.97ZM8 9.97H4V10.97H6V16.97H8V9.97ZM22 3H2C0.9 3 0 3.9 0 5V19C0 20.1 0.9 21 2 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM22 19H2V5H22V19Z" fill={primaryColor}/>
          </svg>
        );
      case 'unity':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9997 2.00001L4.98682 5.3147L3.59558 9.7267L1 12.0027L3.59558 14.2787L4.9837 18.6894L12 22.0001L19.0133 18.6867L20.4036 14.2747L23 12.0001L20.4044 9.7241L19.0164 5.31348L11.9997 2.00001ZM15.9997 17.4001L12.0017 14.4001L8.00366 17.4001L6.60141 13.0001H11.9997V6.6001L16.0017 9.6001L14.5994 14.0001H8.60141L12.5994 6.6001L19.0017 9.6001L17.0017 12.0001L19.0017 14.4001L12.5994 17.4001L8.60141 10.0001H14.5994L15.9997 14.4001L15.9997 17.4001Z" fill={primaryColor}/>
          </svg>
        );
      case 'arduino':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.53 11C1.69 11 1 11.693 1 12.53V16.97C1 17.807 1.693 18.5 2.53 18.5H4.97C5.807 18.5 6.5 17.807 6.5 16.97V12.53C6.5 11.693 5.807 11 4.97 11H2.53ZM12.53 11C11.69 11 11 11.693 11 12.53V16.97C11 17.807 11.693 18.5 12.53 18.5H14.97C15.807 18.5 16.5 17.807 16.5 16.97V12.53C16.5 11.693 15.807 11 14.97 11H12.53ZM8.5 2.1C7.94 2.453 7.5 3.119 7.5 4V20C7.5 20.882 7.94 21.547 8.5 21.9C9.06 22.252 9.776 22.241 10.5 22V2C9.776 1.76 9.06 1.747 8.5 2.1ZM4 14.72C4 14.872 3.882 15 3.72 15C3.569 15 3.439 14.872 3.449 14.72C3.439 14.579 3.569 14.44 3.72 14.44C3.882 14.44 4 14.569 4 14.72ZM14 14.72C14 14.872 13.882 15 13.72 15C13.569 15 13.439 14.872 13.449 14.72C13.439 14.579 13.569 14.44 13.72 14.44C13.882 14.44 14 14.569 14 14.72ZM22 13.4C22 13.847 21.648 14.2 21.2 14.2H17.6V18.1C17.6 18.547 17.248 18.9 16.8 18.9C16.352 18.9 16 18.547 16 18.1V9.9C16 9.453 16.352 9.1 16.8 9.1C17.248 9.1 17.6 9.453 17.6 9.9V13.4H21.2C21.648 13.4 22 13.753 22 14.2V13.4Z" fill={primaryColor}/>
          </svg>
        );
      case 'java':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.55 14.43C9.55 14.43 8.5 15.04 10.12 15.19C12.09 15.35 13.18 15.33 14.94 14.94C14.94 14.94 15.52 15.3 16.27 15.61C12.46 17.26 7.63 15.96 9.55 14.43M9.01 12.21C9.01 12.21 7.81 13.05 9.43 13.18C11.55 13.36 13.25 13.36 15.61 12.86C15.61 12.86 16.01 13.27 16.63 13.49C12 14.97 6.74 14.03 9.01 12.21M16.36 16.95C16.36 16.95 17.1 17.56 15.84 18.05C13.55 18.92 7.61 19.09 5.61 18.12C4.83 17.75 6.25 17.17 6.68 17.05C7.13 16.92 7.38 16.95 7.38 16.95C6.5 16.32 2.34 17.45 4.52 18.05C11.44 19.86 17.01 17.7 16.36 16.95M9.72 10.09C9.72 10.09 6.45 10.88 8.46 11.02C9.51 11.1 11.62 11.02 13.56 10.89C15.13 10.78 16.7 10.54 16.7 10.54C16.7 10.54 15.99 10.86 15.49 11.12C11.38 12.31 5.2 11.92 7 10.81C8.48 9.9 9.72 10.09 9.72 10.09M14.68 14.32C18.85 12.27 16.94 10.28 15.79 10.67C15.46 10.78 15.3 10.89 15.3 10.89C15.3 10.89 15.45 10.67 15.9 10.56C18.96 9.73 21.31 13.05 14.54 14.42C14.54 14.42 14.63 14.36 14.68 14.32M10.17 17.03C14.24 17.29 20.08 16.81 20.24 15.07C20.24 15.07 20 15.9 16.86 16.6C13.28 17.39 8.8 17.31 6.22 16.79C6.22 16.79 6.74 17.42 10.17 17.03M8.72 8.27C8.72 8.27 6.11 8.86 7.72 9.25C8.54 9.44 10.28 9.43 11.87 9.33C13.15 9.22 14.44 9.02 14.44 9.02C14.44 9.02 13.77 9.29 13.3 9.52C10.13 10.4 5.02 10.1 6.4 9.25C7.54 8.55 8.72 8.27 8.72 8.27M13.76 11.93C16.92 10.5 15.47 9.17 14.43 9.45C14.21 9.52 14.08 9.57 14.08 9.57C14.08 9.57 14.21 9.42 14.5 9.36C16.81 8.77 18.5 11.08 13.65 12.02C13.65 12.02 13.73 11.97 13.76 11.93M11.47 0C11.47 0 13.22 1.76 9.97 4.46C7.33 6.7 9.25 7.85 9.97 9.21C8.1 7.5 6.69 6.03 7.63 4.68C9.03 2.73 12.09 2.1 11.47 0M10.74 19.96C14.59 20.1 19.67 19.62 19.74 18.05C19.74 18.05 19.5 18.71 16.82 19.26C13.76 19.88 9.97 19.82 7.72 19.45C7.72 19.45 8.22 19.95 10.74 19.96Z" fill={primaryColor}/>
          </svg>
        );
      case 'bigquery':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.2 4.5V19.5H19.2V4.5H4.2ZM0.6 0.9H22.8V23.1H0.6V0.9ZM15.6 15.9H7.8V13.5H15.6V15.9ZM13.8 8.25L17.1 11.55L13.8 14.85L12.15 13.2L13.8 11.55L12.15 9.9L13.8 8.25ZM9.6 8.25L11.25 9.9L9.6 11.55L11.25 13.2L9.6 14.85L6.3 11.55L9.6 8.25Z" fill={primaryColor}/>
          </svg>
        );
      case 'metabase':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 6.5C9.5 8.16 8.16 9.5 6.5 9.5C4.84 9.5 3.5 8.16 3.5 6.5C3.5 4.84 4.84 3.5 6.5 3.5C8.16 3.5 9.5 4.84 9.5 6.5ZM9.5 17.5C9.5 19.16 8.16 20.5 6.5 20.5C4.84 20.5 3.5 19.16 3.5 17.5C3.5 15.84 4.84 14.5 6.5 14.5C8.16 14.5 9.5 15.84 9.5 17.5ZM20.5 17.5C20.5 19.16 19.16 20.5 17.5 20.5C15.84 20.5 14.5 19.16 14.5 17.5C14.5 15.84 15.84 14.5 17.5 14.5C19.16 14.5 20.5 15.84 20.5 17.5ZM14.5 6.5C14.5 4.84 15.84 3.5 17.5 3.5C19.16 3.5 20.5 4.84 20.5 6.5C20.5 8.16 19.16 9.5 17.5 9.5C15.84 9.5 14.5 8.16 14.5 6.5ZM10.5 12C10.5 13.38 9.38 14.5 8 14.5C6.62 14.5 5.5 13.38 5.5 12C5.5 10.62 6.62 9.5 8 9.5C9.38 9.5 10.5 10.62 10.5 12ZM18.5 12C18.5 13.38 17.38 14.5 16 14.5C14.62 14.5 13.5 13.38 13.5 12C13.5 10.62 14.62 9.5 16 9.5C17.38 9.5 18.5 10.62 18.5 12Z" fill={primaryColor}/>
          </svg>
        );
      case 'airtable':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5919 3.39532L3.5 8.46175V10.5419L11.7806 15.7871C11.9241 15.8769 12.0759 15.8769 12.2194 15.7871L20.5 10.5419V8.46175L12.4081 3.39532C12.155 3.2349 11.845 3.2349 11.5919 3.39532Z" fill={primaryColor}/>
            <path d="M4 12V19.5C4 19.7761 4.22386 20 4.5 20H8.5C8.77614 20 9 19.7761 9 19.5V14.5C9 14.2239 9.22386 14 9.5 14H14.5C14.7761 14 15 14.2239 15 14.5V19.5C15 19.7761 15.2239 20 15.5 20H19.5C19.7761 20 20 19.7761 20 19.5V12L12.1194 17.6871C12.0425 17.7357 11.9575 17.7357 11.8806 17.6871L4 12Z" fill={primaryColor}/>
          </svg>
        );
      case 'airbyte':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.96288C9.55429 5.22215 5.52143 4.21305 2 5.36288V16.6557C5.52143 15.5059 9.55429 16.515 12 18.2557M12 6.96288C14.4457 5.22215 18.4786 4.21305 22 5.36288V16.6557C18.4786 15.5059 14.4457 16.515 12 18.2557M12 6.96288V18.2557" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'network':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C14.21 1 16 2.79 16 5C16 7.21 14.21 9 12 9C9.79 9 8 7.21 8 5C8 2.79 9.79 1 12 1ZM12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM18 20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V19H4V17H20V19H18V20ZM10 12H6C4.9 12 4 12.9 4 14V16H6V14H10V12ZM14 12V14H18V16H20V14C20 12.9 19.1 12 18 12H14Z" fill={primaryColor}/>
          </svg>
        );
      case 'project':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H14.82C14.25 1.44 12.53 0.64 11 1.2C10.14 1.5 9.5 2.16 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM7 7H17V5H19V19H5V5H7V7ZM12 17V15H13C14.1 15 15 14.1 15 13C15 11.9 14.1 11 13 11H11V9H15V7H9V13H13C13 13 13 15 11 15V17H12Z" fill={primaryColor}/>
          </svg>
        );
      default:
        return <span className="text-2xl">🔧</span>;
    }
  };
  
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.03 }}
      className="group"
    >
      <div className="flex flex-col items-center justify-center w-[55px] h-[55px] p-2 bg-card rounded-lg border border-border hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
        {renderIcon(skill.icon)}
        <span className="text-xs font-medium text-center opacity-0 group-hover:opacity-100 absolute -bottom-6 min-w-max transition-opacity bg-background/80 px-2 py-1 rounded-md shadow-sm">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
};

export default Career;

