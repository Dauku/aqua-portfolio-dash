
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CareerItem } from '@/utils/airtable';

interface CareerItemFormProps {
  item: CareerItem;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (field: string, value: any) => void;
  onDelete: () => void;
  onSave: () => void;
}

const CareerItemForm = ({ 
  item, 
  isEditing, 
  onEdit, 
  onChange, 
  onDelete,
  onSave
}: CareerItemFormProps) => {
  const [localItem, setLocalItem] = useState<CareerItem>(item);
  
  const handleChange = (field: string, value: any) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onChange(field, value);
  };
  
  if (!isEditing) {
    return (
      <div className="border rounded-md p-4 mb-4 bg-card hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm">{item.company} • {item.location}</p>
            <p className="text-sm text-muted-foreground">{item.period}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="p-1 rounded-full hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4 mb-4 bg-card">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`title-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id={`title-${item.id || 'new'}`}
              value={localItem.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Position title"
            />
          </div>
          
          <div>
            <label htmlFor={`company-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              Company/Institution
            </label>
            <Input
              id={`company-${item.id || 'new'}`}
              value={localItem.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Company name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`location-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id={`location-${item.id || 'new'}`}
              value={localItem.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
          
          <div>
            <label htmlFor={`period-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              Period
            </label>
            <Input
              id={`period-${item.id || 'new'}`}
              value={localItem.period}
              onChange={(e) => handleChange('period', e.target.value)}
              placeholder="January 2020 - Present"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor={`description-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id={`description-${item.id || 'new'}`}
            value={localItem.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Role description and achievements"
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor={`type-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Type
          </label>
          <Select 
            value={localItem.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id={`type-${item.id || 'new'}`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work Experience</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onEdit}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerItemForm;
