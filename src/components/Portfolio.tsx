
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/utils/animations';
import { ExternalLink, Github } from 'lucide-react';
import { PortfolioItem } from '@/utils/airtable';

type PortfolioProps = {
  items?: PortfolioItem[];
};

const Portfolio = ({ items = [] }: PortfolioProps) => {
  // Generate tags for filtering from the portfolio items
  const allTags = ["All", ...Array.from(new Set(items.flatMap(item => item.tags || [])))];
  
  const [selectedTag, setSelectedTag] = useState("All");
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  // Filter portfolio items based on selected tag
  const filteredItems = selectedTag === "All" 
    ? items 
    : items.filter(item => item.tags?.includes(selectedTag));
  
  // Show placeholder when no portfolio items are available
  if (!items || items.length === 0) {
    return (
      <div>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-aqua/10 px-4 py-1 rounded-md">Portfolio</span>
          </h2>
          <p className="text-muted-foreground">
            Selected projects that showcase my passion for design and development
          </p>
        </motion.div>
        
        <div className="text-center py-16 border border-dashed rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium text-muted-foreground">No portfolio projects available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add project information in the Airtable "Portfolio" table to display your work here.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <section id="portfolio">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cream/20 rounded-bl-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-aqua/10 rounded-tr-[100px] -z-10" />
      
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-aqua/10 px-4 py-1 rounded-md">Portfolio</span>
        </h2>
        <p className="text-muted-foreground">
          Selected projects that showcase my passion for design and development
        </p>
        
        {/* Filter tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag 
                  ? 'bg-aqua text-white shadow-md' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Portfolio grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => (
          <PortfolioCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

// Portfolio card component
const PortfolioCard = ({ item, index }: { item: PortfolioItem, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300"
    >
      {/* Image container with overlay */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <div className="space-y-2">
            {item.tags && item.tags.map(tag => (
              <span key={tag} className="inline-block mr-2 px-2 py-1 text-xs font-medium bg-black/40 text-white rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            {item.github && (
              <a href={item.github} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
                <Github size={16} />
              </a>
            )}
            {item.link && (
              <a href={item.link} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 group-hover:text-aqua transition-colors">{item.title}</h3>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>
    </motion.div>
  );
};

export default Portfolio;
