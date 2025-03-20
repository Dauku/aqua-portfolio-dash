
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
      // No default skills, leave empty for placeholder
      setSkills([]);
      setLoading(false);
    }
  }, [skillItems]);
  
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

  // Show placeholder when no skills are available
  if (skills.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg bg-muted/30">
        <h3 className="text-xl font-medium text-muted-foreground">No skills data available</h3>
        <p className="mt-2 text-sm text-muted-foreground">Skills information will appear here once added.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 my-8">
      {skills.map((skill, index) => (
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
