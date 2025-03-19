
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
    const commonClasses = "w-12 h-12 mb-2";
    const primaryColor = "#278783"; // aqua
    const DarkColor = "#000000"; // dark
    const secondaryColor = "#FFEBD0"; // cream
    
    switch(iconName) {
      case 'html':
        return (
          <svg className={commonClasses} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 28L4 3H28L26 28L16 31L6 28Z" fill="#E44D26"></path>
            <path d="M26 5H16V29.5L24 27L26 5Z" fill="#F16529"></path>
            <path d="M9.5 17.5L8.5 8H24L23.5 11H11.5L12 14.5H23L22 24L16 26L10 24L9.5 19H12.5L13 21.5L16 22.5L19 21.5L19.5 17.5H9.5Z" fill="white"></path>
          </svg>
        );
      case 'css':
        return (
          <svg className={commonClasses} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 28L4 3H28L26 28L16 31L6 28Z" fill="#1172B8"></path>
            <path d="M26 5H16V29.5L24 27L26 5Z" fill="#33AADD"></path>
            <path d="M19.5 17.5H9.5L9 14L17 11.5H9L8.5 8.5H24L23.5 12L17 14.5H23L22 24L16 26L10 24L9.5 19H12.5L13 21.5L16 22.5L19 21.5L19.5 17.5Z" fill="white"></path>
        </svg>
        );
      case 'javascript':
        return (
          <svg className={commonClasses} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="28" height="28" fill="#FFCA28"></rect>
          <path d="M19 25.2879L21.0615 23.9237C21.2231 24.4313 22.2462 25.6368 23.5385 25.6368C24.8308 25.6368 25.4308 24.931 25.4308 24.463C25.4308 23.1878 24.1112 22.7382 23.4774 22.5223C23.374 22.4871 23.289 22.4581 23.2308 22.4328C23.2009 22.4198 23.1558 22.4025 23.0979 22.3804C22.393 22.1111 19.7923 21.1175 19.7923 18.2373C19.7923 15.065 22.8538 14.7002 23.5462 14.7002C23.9991 14.7002 26.1769 14.7557 27.2615 16.7939L25.2615 18.1898C24.8231 17.3015 24.0946 17.0081 23.6462 17.0081C22.5385 17.0081 22.3077 17.8201 22.3077 18.1898C22.3077 19.227 23.5112 19.6919 24.5273 20.0844C24.7932 20.1871 25.0462 20.2848 25.2615 20.3866C26.3692 20.91 28 21.7666 28 24.463C28 25.8136 26.8672 28.0002 24.0154 28.0002C20.1846 28.0002 19.1692 25.7003 19 25.2879Z" fill="#3E3E3E"></path>
          <path d="M9 25.5587L11.1487 24.1953C11.317 24.7026 11.9713 25.638 12.9205 25.638C13.8698 25.638 14.3557 24.663 14.3557 24.1953V15.0002H16.9982V24.1953C17.041 25.4636 16.3376 28.0002 13.2332 28.0002C10.379 28.0002 9.19242 26.3039 9 25.5587Z" fill="#3E3E3E"></path>
        </svg>
        );
      case 'php':
        return (
          <svg className={commonClasses} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#8892BF"></circle>
            <path d="M14.4392 10H16.1192L15.6444 12.5242H17.154C17.9819 12.5419 18.5986 12.7269 19.0045 13.0793C19.4184 13.4316 19.5402 14.1014 19.3698 15.0881L18.5541 19.4889H16.8497L17.6288 15.2863C17.7099 14.8457 17.6856 14.533 17.5558 14.348C17.426 14.163 17.146 14.0705 16.7158 14.0705L15.3644 14.0573L14.3661 19.4889H12.6861L14.4392 10Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.74092 12.5243H10.0036C10.9612 12.533 11.6552 12.8327 12.0854 13.4229C12.5156 14.0132 12.6576 14.8193 12.5115 15.8414C12.4548 16.3085 12.3289 16.7665 12.1341 17.2159C11.9474 17.6652 11.6878 18.0704 11.355 18.4317C10.9491 18.8898 10.5149 19.1805 10.0523 19.304C9.58969 19.4274 9.11076 19.489 8.61575 19.489H7.15484L6.69222 22H5L6.74092 12.5243ZM7.43485 17.9956L8.16287 14.0441H8.40879C8.49815 14.0441 8.5914 14.0396 8.6888 14.0309C9.33817 14.0221 9.87774 14.0882 10.308 14.2291C10.7462 14.37 10.8923 14.9031 10.7462 15.8282C10.5678 16.9296 10.2186 17.5727 9.69926 17.7577C9.1799 17.934 8.53053 18.0176 7.75138 18.0088H7.58094C7.53224 18.0088 7.48355 18.0043 7.43485 17.9956Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.4365 12.5243H21.1738L19.4329 22H21.1251L21.5878 19.489H23.0487C23.5437 19.489 24.0226 19.4274 24.4852 19.304C24.9479 19.1805 25.382 18.8898 25.7879 18.4317C26.1207 18.0704 26.3803 17.6652 26.567 17.2159C26.7618 16.7665 26.8877 16.3085 26.9444 15.8414C27.0905 14.8193 26.9486 14.0132 26.5183 13.4229C26.0881 12.8327 25.3942 12.533 24.4365 12.5243ZM22.5958 14.0441L21.8678 17.9956C21.9165 18.0043 21.9652 18.0088 22.0139 18.0088H22.1843C22.9635 18.0176 23.6128 17.934 24.1322 17.7577C24.6515 17.5727 25.0007 16.9296 25.1792 15.8282C25.3253 14.9031 25.1792 14.37 24.7409 14.2291C24.3107 14.0882 23.7711 14.0221 23.1217 14.0309C23.0243 14.0396 22.9311 14.0441 22.8417 14.0441H22.5958Z" fill="white"></path>
        </svg>
        );
      case 'sql':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.22 2 5 3.79 5 6V18C5 20.21 8.22 22 12 22C15.78 22 19 20.21 19 18V6C19 3.79 15.78 2 12 2ZM17 18C17 18.5 15.1 20 12 20C8.9 20 7 18.5 7 18V15.82C8.45 16.82 10.56 17 12 17C13.44 17 15.55 16.82 17 15.82V18ZM17 13.5C17 14 15.1 15.5 12 15.5C8.9 15.5 7 14 7 13.5V11.32C8.45 12.32 10.56 12.5 12 12.5C13.44 12.5 15.55 12.32 17 11.32V13.5ZM12 10.5C8.9 10.5 7 9 7 8.5V6C7 5.5 8.9 4 12 4C15.1 4 17 5.5 17 6V8.5C17 9 15.1 10.5 12 10.5Z" fill={DarkColor}/>
          </svg>
        );
      case 'bootstrap':
        return (
          <svg className={commonClasses} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_iconCarrier">
              <path d="M0,222.991225 C0,241.223474 14.7785318,256 33.0087747,256 L222.991225,256 C241.223474,256 256,241.221468 256,222.991225 L256,33.0087747 C256,14.7765263 241.221468,0 222.991225,0 L33.0087747,0 C14.7765263,0 0,14.7785318 0,33.0087747 L0,222.991225 Z" fill="#563D7C"></path>
              <path d="M106.157563,113.238095 L106.157563,76.9845938 L138.069328,76.9845938 C141.108559,76.9845938 144.039202,77.2378593 146.861345,77.7443978 C149.683488,78.2509362 152.179961,79.1554557 154.35084,80.4579832 C156.52172,81.7605107 158.258397,83.5695496 159.560924,85.8851541 C160.863452,88.2007585 161.514706,91.1675823 161.514706,94.7857143 C161.514706,101.298352 159.560944,106.001853 155.653361,108.896359 C151.745779,111.790864 146.752832,113.238095 140.67437,113.238095 L106.157563,113.238095 Z M72.07493,50.5 L72.07493,205.5 L147.186975,205.5 C154.133788,205.5 160.899594,204.631661 167.484594,202.894958 C174.069594,201.158255 179.93088,198.480877 185.068627,194.862745 C190.206375,191.244613 194.294803,186.577293 197.334034,180.860644 C200.373264,175.143996 201.892857,168.37819 201.892857,160.563025 C201.892857,150.866431 199.541107,142.581033 194.837535,135.706583 C190.133963,128.832132 183.00635,124.020088 173.454482,121.270308 C180.401295,117.941627 185.647508,113.672295 189.193277,108.462185 C192.739047,103.252075 194.511905,96.7395349 194.511905,88.9243697 C194.511905,81.6881057 193.317939,75.6097352 190.929972,70.6890756 C188.542005,65.7684161 185.177193,61.8247114 180.835434,58.8578431 C176.493676,55.8909749 171.283644,53.756309 165.205182,52.4537815 C159.12672,51.151254 152.397096,50.5 145.016106,50.5 L72.07493,50.5 Z M106.157563,179.015406 L106.157563,136.466387 L143.279412,136.466387 C150.660401,136.466387 156.594049,138.166883 161.080532,141.567927 C165.567016,144.968971 167.810224,150.649353 167.810224,158.609244 C167.810224,162.661552 167.122789,165.990183 165.747899,168.595238 C164.373009,171.200293 162.527789,173.262597 160.212185,174.782213 C157.89658,176.301828 155.219203,177.387252 152.179972,178.038515 C149.140741,178.689779 145.956833,179.015406 142.628151,179.015406 L106.157563,179.015406 Z" fill="#FFFFFF"> </path>
            </g>
          </svg>
        );
      case 'bubble':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 13H13V16.5C13 17.05 12.55 17.5 12 17.5C11.45 17.5 11 17.05 11 16.5V13H7.5C6.95 13 6.5 12.55 6.5 12C6.5 11.45 6.95 11 7.5 11H11V7.5C11 6.95 11.45 6.5 12 6.5C12.55 6.5 13 6.95 13 7.5V11H16.5C17.05 11 17.5 11.45 17.5 12C17.5 12.55 17.05 13 16.5 13Z" fill={DarkColor}/>
          </svg>
        );
      case 'figma':
        return (
          <svg className={commonClasses} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#1ABCFE" d="M8.55 8c0-1.289 1.019-2.333 2.275-2.333C12.082 5.667 13.1 6.71 13.1 8c0 1.289-1.018 2.333-2.275 2.333C9.57 10.333 8.55 9.29 8.55 8z"></path>
            <path fill="#0ACF83" d="M4 12.667c0-1.289 1.019-2.334 2.275-2.334H8.55v2.334C8.55 13.955 7.531 15 6.275 15S4 13.955 4 12.667z"></path>
            <path fill="#FF7262" d="M8.55 1v4.667h2.275c1.257 0 2.275-1.045 2.275-2.334C13.1 2.045 12.082 1 10.825 1H8.55z"></path>
            <path fill="#F24E1E" d="M4 3.333c0 1.289 1.019 2.334 2.275 2.334H8.55V1H6.275C5.019 1 4 2.045 4 3.333z"></path>
            <path fill="#A259FF" d="M4 8c0 1.289 1.019 2.333 2.275 2.333H8.55V5.667H6.275C5.019 5.667 4 6.71 4 8z"></path>
          </svg>
        );
      case 'api':
        return (
          <svg className={commonClasses} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_iconCarrier">
            <path d="M432.4 453.5l-17 46.7h34.4z" fill="#fefefe"></path>
            <path d="M725.3 259.7H312.2c-16.5 0-30 13.5-30 30v413.1c0 16.5 13.5 30 30 30h413.1c16.5 0 30-13.5 30-30V289.7c0-16.6-13.5-30-30-30z m-98.8 164.5h25.4V550h-25.4V424.2z m-116.5 0h40.8c15.5 0 25.5 0.6 30.2 1.9 7.2 1.9 13.2 6 18.1 12.3 4.9 6.3 7.3 14.5 7.3 24.5 0 7.7-1.4 14.2-4.2 19.5s-6.4 9.4-10.7 12.4c-4.3 3-8.7 5-13.2 6-6.1 1.2-14.8 1.8-26.4 1.8h-16.6V550H510V424.2z m-90.7 0h26.9L496.5 550h-27.6l-11-28.6h-50.3L397.2 550h-27l49.1-125.8z m229.1 273.3H352.6c-19.4 0-35.1-15.7-35.1-35.1v-295c0-5.5 4.5-10 10-10s10 4.5 10 10v295c0 8.3 6.8 15.1 15.1 15.1h295.8c5.5 0 10 4.5 10 10s-4.4 10-10 10z" fill="#fefefe"></path>
            <path d="M569.4 479.2c3.4-1.3 6-3.4 7.9-6.2 1.9-2.8 2.9-6.1 2.9-9.8 0-4.6-1.3-8.4-4-11.3-2.7-3-6.1-4.8-10.2-5.6-3-0.6-9.1-0.9-18.3-0.9h-12.3v35.7h13.9c10 0.1 16.7-0.6 20.1-1.9z" fill="#fefefe"></path>
            <path d="M648.4 677.5H352.6c-8.3 0-15.1-6.8-15.1-15.1v-295c0-5.5 4.5-10 10-10s10 4.5 10 10v295c0 19.4 15.7 35.1 35.1 35.1h295.8c5.5 0 10-4.5 10-10s-4.4-10-10-10z" fill="#000000"></path>
            <path d="M865 386.5c11 0 20-9 20-20s-9-20-20-20h-69.7v-56.8c0-38.6-31.4-70-70-70h-27.8v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H611v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-46.5v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H438v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-85.8c-38.6 0-70 31.4-70 70v56.8h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V433h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v46.5h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V606h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v56.8c0 38.6 31.4 70 70 70H343v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5H516v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h82.8c38.6 0 70-31.4 70-70V646H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865c11 0 20-9 20-20s-9-20-20-20h-69.7V473H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865zM755.3 702.7c0 16.5-13.5 30-30 30H312.2c-16.5 0-30-13.5-30-30v-413c0-16.5 13.5-30 30-30h413.1c16.5 0 30 13.5 30 30v413z" fill="#000000"></path>
          </g>
        </svg>
        );
      case 'postman':
        return (
          <svg className={commonClasses} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M 31.880859 3 C 27.661475 3.013642 23.379516 3.9528594 19.330078 5.9199219 C 12.416078 9.2789219 7.1204219 15.247719 4.6074219 22.511719 C -0.63657812 37.637719 7.3749531 54.149578 22.501953 59.392578 C 37.628953 64.635578 54.140766 56.624047 59.384766 41.498047 C 61.928766 34.228047 61.453453 26.240266 58.064453 19.322266 C 53.036797 8.9744219 42.663731 2.9651371 31.880859 3 z M 31.533203 4.9863281 C 34.613636 4.9329984 37.755719 5.4107969 40.835938 6.4785156 C 47.596938 8.8225156 53.151391 13.755359 56.275391 20.193359 C 59.400391 26.631359 59.837141 34.048547 57.494141 40.810547 C 52.613141 54.890547 37.243109 62.34875 23.162109 57.46875 C 9.0811094 52.58875 1.6239062 37.217719 6.5039062 23.136719 C 10.316406 12.135938 20.531658 5.1767914 31.533203 4.9863281 z M 31.638672 8.3183594 C 30.803672 8.3063594 29.968719 8.3399688 29.136719 8.4179688 C 28.584719 8.4359688 28.152875 8.8982188 28.171875 9.4492188 C 28.189875 10.001219 28.652125 10.433063 29.203125 10.414062 C 29.244125 10.413063 29.287125 10.409344 29.328125 10.402344 C 30.080125 10.324344 30.834844 10.286063 31.589844 10.289062 C 32.136844 10.213062 32.517406 9.7081094 32.441406 9.1621094 C 32.382406 8.7381094 32.059672 8.3983594 31.638672 8.3183594 z" fill="currentColor"/>
          </svg>
        );
      case 'n8n':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
          <title>n8n</title>
          <path d="M21.4737 5.6842c-1.1772 0 -2.1663 0.8051 -2.4468 1.8947h-2.8955c-1.235 0 -2.289 0.893 -2.492 2.111l-0.1038 0.623a1.263 1.263 0 0 1 -1.246 1.0555H11.289c-0.2805 -1.0896 -1.2696 -1.8947 -2.4468 -1.8947s-2.1663 0.8051 -2.4467 1.8947H4.973c-0.2805 -1.0896 -1.2696 -1.8947 -2.4468 -1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663 -0.8051 2.4468 -1.8947h1.4223c0.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663 -0.8051 2.4468 -1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l0.1038 0.623c0.203 1.218 1.257 2.111 2.492 2.111h0.3692c0.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263 -1.131 2.5263 -2.5263s-1.131 -2.5263 -2.5263 -2.5263c-1.1772 0 -2.1664 0.805 -2.4468 1.8947h-0.3692a1.263 1.263 0 0 1 -1.246 -1.0555l-0.1037 -0.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 0.821 -1.4794l0.1038 -0.623a1.263 1.263 0 0 1 1.2459 -1.0555h2.8955c0.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263 -1.131 2.5263 -2.5263s-1.131 -2.5263 -2.5263 -2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1 -1.2631 1.2632 1.263 1.263 0 0 1 -1.2632 -1.2632 1.263 1.263 0 0 1 1.2632 -1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1 -1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631 -1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1 -1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632 -1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1 -1.2631 1.2631 1.263 1.263 0 0 1 -1.2632 -1.2631 1.263 1.263 0 0 1 1.2632 -1.2632" fill="#000000" stroke-width="1"></path>
        </svg>
        );
      case 'openai':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729Zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944Zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464ZM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872Zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667Zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66ZM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813Zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
                fill={DarkColor}
                />
          </svg>
        );
      case 'cpp':
        return (
          <svg className={commonClasses} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/>
            <path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/>
            <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"/>
          </svg>
        );
      case 'csharp':
        return (
          <svg className={commonClasses} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#00549d" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path>
            <path fill="#0086d4" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path>
            <path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path>
            <path fill="#0075c0" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path>
            <path fill="#fff" fill-rule="evenodd" d="M31 21H33V27H31zM38 21H40V27H38z" clip-rule="evenodd"></path>
            <path fill="#fff" fill-rule="evenodd" d="M29 23H35V25H29zM36 23H42V25H36z" clip-rule="evenodd"></path>
          </svg>
        );
      case 'unity':
        return (
          <svg className={commonClasses} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M26.531 25.599l-5.728-9.599 5.728-9.599 2.803 9.599zM13.864 24.667l-7.197-7.068h11.469l5.728 9.599zM13.864 7.197l10-2.531-5.728 9.599h-11.605c0 0.136 7.333-7.068 7.333-7.068zM28.531 0l-13.061 3.333-2 3.333h-3.871l-9.599 9.333 9.599 9.333h3.871l1.864 3.333 13.068 3.333 3.463-12.667-1.864-3.333 2-3.333z" fill={DarkColor}></path>
          </svg>
        );
      case 'arduino':
        return (
          <svg className={commonClasses} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1372.201 1372.684">
          <path fill="#00979D" stroke="#81C9CB" strokeWidth=".932" strokeMiterlimit="10" d="M1371.701 686.024c0 378.658-306.972 685.605-685.549 685.605C307.451 1371.629.5 1064.682.5 686.024.5 307.455 307.451.483 686.152.483c378.594.001 685.549 306.972 685.549 685.541z"/>
          <g fill="#FFF">
            <path d="M947.959 931.196c-12.909 0-26.127-.929-39.127-2.864-108.978-15.554-181.848-93.822-222.665-153.989-40.946 60.166-113.811 138.512-222.74 154.045a275.864 275.864 0 0 1-39.133 2.785c-67.753 0-131.358-25.217-179.201-71.003-48.299-46.165-74.951-108.114-74.951-174.171 0-66.14 26.651-128.004 75.021-174.253 47.797-45.793 111.449-70.936 179.231-70.936 12.918 0 26.067.928 39.023 2.783 108.932 15.535 181.794 93.813 222.743 153.99 40.825-60.177 113.689-138.432 222.658-153.99 13-1.863 26.148-2.783 39.066-2.783 67.753 0 131.401 25.208 179.197 70.936 48.345 46.249 74.937 108.113 74.937 174.253 0 66.057-26.524 128.006-74.868 174.171-47.881 45.785-111.434 71.026-179.191 71.026M734.42 686.024c21.283 40.534 84.067 141.676 186.692 156.375 8.984 1.236 18.028 1.923 26.839 1.923 92.185 0 167.225-71.002 167.225-158.322s-75.023-158.321-167.291-158.321c-8.812 0-17.853.629-26.753 1.921-102.644 14.664-165.428 115.806-186.712 156.424M424.393 527.702c-92.308 0-167.36 70.998-167.36 158.321 0 87.305 75.021 158.322 167.245 158.322 8.852 0 17.897-.688 26.879-1.922 102.629-14.697 165.394-115.783 186.689-156.375-21.237-40.535-84.061-141.761-186.689-156.376-8.877-1.341-17.945-1.97-26.764-1.97"/>
            <path d="M354.37 662.051h152.625v49.181H354.37zM1016.484 662.051h-51.671v-51.747h-49.348v51.747h-51.648v49.181h51.648v51.737h49.348v-51.737h51.671z"/>
          </g>
        </svg>
        );
      case 'java':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.55 14.43C9.55 14.43 8.5 15.04 10.12 15.19C12.09 15.35 13.18 15.33 14.94 14.94C14.94 14.94 15.52 15.3 16.27 15.61C12.46 17.26 7.63 15.96 9.55 14.43M9.01 12.21C9.01 12.21 7.81 13.05 9.43 13.18C11.55 13.36 13.25 13.36 15.61 12.86C15.61 12.86 16.01 13.27 16.63 13.49C12 14.97 6.74 14.03 9.01 12.21M16.36 16.95C16.36 16.95 17.1 17.56 15.84 18.05C13.55 18.92 7.61 19.09 5.61 18.12C4.83 17.75 6.25 17.17 6.68 17.05C7.13 16.92 7.38 16.95 7.38 16.95C6.5 16.32 2.34 17.45 4.52 18.05C11.44 19.86 17.01 17.7 16.36 16.95M9.72 10.09C9.72 10.09 6.45 10.88 8.46 11.02C9.51 11.1 11.62 11.02 13.56 10.89C15.13 10.78 16.7 10.54 16.7 10.54C16.7 10.54 15.99 10.86 15.49 11.12C11.38 12.31 5.2 11.92 7 10.81C8.48 9.9 9.72 10.09 9.72 10.09M14.68 14.32C18.85 12.27 16.94 10.28 15.79 10.67C15.46 10.78 15.3 10.89 15.3 10.89C15.3 10.89 15.45 10.67 15.9 10.56C18.96 9.73 21.31 13.05 14.54 14.42C14.54 14.42 14.63 14.36 14.68 14.32M10.17 17.03C14.24 17.29 20.08 16.81 20.24 15.07C20.24 15.07 20 15.9 16.86 16.6C13.28 17.39 8.8 17.31 6.22 16.79C6.22 16.79 6.74 17.42 10.17 17.03M8.72 8.27C8.72 8.27 6.11 8.86 7.72 9.25C8.54 9.44 10.28 9.43 11.87 9.33C13.15 9.22 14.44 9.02 14.44 9.02C14.44 9.02 13.77 9.29 13.3 9.52C10.13 10.4 5.02 10.1 6.4 9.25C7.54 8.55 8.72 8.27 8.72 8.27M13.76 11.93C16.92 10.5 15.47 9.17 14.43 9.45C14.21 9.52 14.08 9.57 14.08 9.57C14.08 9.57 14.21 9.42 14.5 9.36C16.81 8.77 18.5 11.08 13.65 12.02C13.65 12.02 13.73 11.97 13.76 11.93M11.47 0C11.47 0 13.22 1.76 9.97 4.46C7.33 6.7 9.25 7.85 9.97 9.21C8.1 7.5 6.69 6.03 7.63 4.68C9.03 2.73 12.09 2.1 11.47 0M10.74 19.96C14.59 20.1 19.67 19.62 19.74 18.05C19.74 18.05 19.5 18.71 16.82 19.26C13.76 19.88 9.97 19.82 7.72 19.45C7.72 19.45 8.22 19.95 10.74 19.96Z" fill={DarkColor}/>
          </svg>
        );
      case 'bigquery':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g id="SVGRepo_iconCarrier">
            <defs>
              <style>
                {`
                  .cls-1 { fill: #aecbfa; }
                  .cls-1, .cls-2, .cls-3 { fill-rule: evenodd; }
                  .cls-2 { fill: #669df6; }
                  .cls-3 { fill: #4285f4; }
                `}
              </style>
            </defs>
            <title>BigQuery Icon</title>
            <g data-name="Product Icons">
              <g>
                <path className="cls-1" d="M6.73,10.83v2.63A4.91,4.91,0,0,0,8.44,15.2V10.83Z"></path>
                <path className="cls-2" d="M9.89,8.41v7.53A7.62,7.62,0,0,0,11,16,8,8,0,0,0,12,16V8.41Z"></path>
                <path className="cls-1" d="M13.64,11.86v3.29a5,5,0,0,0,1.7-1.82V11.86Z"></path>
                <path className="cls-3" d="M17.74,16.32l-1.42,1.42a.42.42,0,0,0,0,.6l3.54,3.54a.42.42,0,0,0,.59,0l1.43-1.43a.42.42,0,0,0,0-.59l-3.54-3.54a.42.42,0,0,0-.6,0"></path>
                <path className="cls-2" d="M11,2a9,9,0,1,0,9,9,9,9,0,0,0-9-9m0,15.69A6.68,6.68,0,1,1,17.69,11,6.68,6.68,0,0,1,11,17.69"></path>
              </g>
            </g>
          </g>
        </svg>
        );
      case 'metabase':
        return (
          <svg className={commonClasses} viewBox="-34 0 324 324" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g id="SVGRepo_iconCarrier">
            <g fill="#509EE3">
              <ellipse cx="19.3939396" cy="82.7565395" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="19.3939396" cy="137.927566" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="73.6969698" cy="82.7565395" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="73.6969698" cy="138.463513" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="128" cy="82.7565395" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="128" cy="19.703938" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="128" cy="138.463513" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="182.30303" cy="82.7565395" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="236.60606" cy="82.7565395" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="182.30303" cy="138.463513" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="236.60606" cy="138.463513" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="19.3939396" cy="193.098592" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="73.6969698" cy="193.634539" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="128" cy="193.634539" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="182.30303" cy="193.634539" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="236.60606" cy="193.634539" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="19.3939396" cy="248.269618" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="73.6969698" cy="248.805565" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="128" cy="248.805565" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="128" cy="303.976591" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse opacity="0.2" cx="182.30303" cy="248.805565" rx="19.3939394" ry="19.703938"></ellipse> 
              <ellipse cx="236.60606" cy="248.805565" rx="19.3939394" ry="19.703938"></ellipse>
            </g>
          </g>
        </svg>
        );
      case 'airtable':
        return (
          <svg className={commonClasses} viewBox="0 -20.5 256 256" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M114.25873,2.70101695 L18.8604023,42.1756384 C13.5552723,44.3711638 13.6102328,51.9065311 18.9486282,54.0225085 L114.746142,92.0117514 C123.163769,95.3498757 132.537419,95.3498757 140.9536,92.0117514 L236.75256,54.0225085 C242.08951,51.9065311 242.145916,44.3711638 236.83934,42.1756384 L141.442459,2.70101695 C132.738459,-0.900338983 122.961284,-0.900338983 114.25873,2.70101695" fill="#FFBF00"></path> 
              <path d="M136.349071,112.756863 L136.349071,207.659101 C136.349071,212.173089 140.900664,215.263892 145.096461,213.600615 L251.844122,172.166219 C254.281184,171.200072 255.879376,168.845451 255.879376,166.224705 L255.879376,71.3224678 C255.879376,66.8084791 251.327783,63.7176768 247.131986,65.3809537 L140.384325,106.815349 C137.94871,107.781496 136.349071,110.136118 136.349071,112.756863" fill="#26B5F8"></path> 
              <path d="M111.422771,117.65355 L79.742409,132.949912 L76.5257763,134.504714 L9.65047684,166.548104 C5.4112904,168.593211 0.000578531073,165.503855 0.000578531073,160.794612 L0.000578531073,71.7210757 C0.000578531073,70.0173017 0.874160452,68.5463864 2.04568588,67.4384994 C2.53454463,66.9481944 3.08848814,66.5446689 3.66412655,66.2250305 C5.26231864,65.2661153 7.54173107,65.0101153 9.47981017,65.7766689 L110.890522,105.957098 C116.045234,108.002206 116.450206,115.225166 111.422771,117.65355" fill="#ED3049"></path> 
              <path d="M111.422771,117.65355 L79.742409,132.949912 L2.04568588,67.4384994 C2.53454463,66.9481944 3.08848814,66.5446689 3.66412655,66.2250305 C5.26231864,65.2661153 7.54173107,65.0101153 9.47981017,65.7766689 L110.890522,105.957098 C116.045234,108.002206 116.450206,115.225166 111.422771,117.65355" fill-opacity="0.25" fill="#000000"></path> 
            </g>
          </g>
        </svg>
        );
      case 'airbyte':
        return (
          <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.96288C9.55429 5.22215 5.52143 4.21305 2 5.36288V16.6557C5.52143 15.5059 9.55429 16.515 12 18.2557M12 6.96288C14.4457 5.22215 18.4786 4.21305 22 5.36288V16.6557C18.4786 15.5059 14.4457 16.515 12 18.2557M12 6.96288V18.2557" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      <div className="flex flex-col items-center justify-center w-[150px] h-[150px] p-2 bg-card rounded-lg border border-border hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
        {renderIcon(skill.icon)}
        <span className="text-xs font-medium text-center opacity-0 group-hover:opacity-100 absolute -bottom-6 min-w-max transition-opacity bg-background/80 px-2 py-1 rounded-md shadow-sm">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
};

export default Career;

