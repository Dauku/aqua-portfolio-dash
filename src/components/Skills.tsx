
import { useEffect, useState } from 'react';
import { SkillItem } from '@/utils/airtable';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillsProps {
  skillItems?: SkillItem[];
}

const Skills = ({ skillItems = [] }: SkillsProps) => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  
  useEffect(() => {
    if (skillItems && skillItems.length > 0) {
      setSkills(skillItems);
      setLoading(false);
    } else {
      // Default skills if none are provided
      setSkills([
        {
          name: 'HTML',
          category: 'web',
          logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l-3-9h20l-3 9h-6l2-6h-6l2 6z"/></svg>'
        },
        {
          name: 'CSS',
          category: 'web',
          logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 13h6m-3-3v6m-6-9h12v10H6z"/></svg>'
        }
      ]);
      setLoading(false);
    }
  }, [skillItems]);
  
  // Helper function to sort skills by category
  const sortedSkills = [...skills].sort((a, b) => {
    const order = { web: 1, api: 2, software: 3, network: 4, data: 5, other: 6 };
    return order[a.category as keyof typeof order] - order[b.category as keyof typeof order];
  });
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 my-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="w-14 h-14 rounded-md" />
            <Skeleton className="w-16 h-4 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 my-8">
      {sortedSkills.map((skill, index) => (
        <div 
          key={skill.id || index} 
          className="group flex flex-col items-center"
        >
          <div 
            className="w-14 h-14 rounded-md flex items-center justify-center border border-border p-2 bg-card hover:bg-primary/10 transition-colors"
            dangerouslySetInnerHTML={{ __html: skill.logoSvg || '' }}
          />
          <span className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {skill.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Skills;
