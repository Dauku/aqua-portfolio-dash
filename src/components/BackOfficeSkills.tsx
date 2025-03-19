import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { SkillService, SkillItem } from '@/utils/airtable';
import SkillItemForm from '@/components/SkillItemForm';

const BackOfficeSkills = () => {
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSkillItems();
  }, []);

  const loadSkillItems = async () => {
    try {
      setIsLoading(true);
      const items = await SkillService.getAll();
      setSkillItems(items);
    } catch (error) {
      console.error('Error loading skill items:', error);
      toast({
        title: "Failed to load skills",
        description: "Could not load skills. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: SkillItem = {
      name: "",
      category: "other",
    };
    
    setSkillItems([...skillItems, newItem]);
    setEditingItemId('new');
  };

  const handleItemChange = (id: string | undefined, field: string, value: any) => {
    setSkillItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditItem = (id: string | undefined) => {
    setEditingItemId(id || null);
  };

  const handleSaveItem = async (item: SkillItem) => {
    try {
      setIsSaving(true);
      const savedItem = await SkillService.save(item);
      
      if (savedItem) {
        setSkillItems(prev => {
          // If this was a new item, replace it with the saved version
          if (!item.id) {
            return [...prev.filter(i => i !== item), savedItem];
          }
          
          // Otherwise update the existing item
          return prev.map(i => i.id === item.id ? savedItem : i);
        });
        
        toast({
          title: "Skill saved",
          description: "Skill has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Failed to save",
        description: "Could not save skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setEditingItemId(null);
    }
  };

  const handleDeleteItem = async (id: string | undefined) => {
    // If it's a new item that hasn't been saved yet
    if (!id) {
      setSkillItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    
    try {
      const success = await SkillService.delete(id);
      
      if (success) {
        setSkillItems(prev => prev.filter(item => item.id !== id));
        
        toast({
          title: "Skill deleted",
          description: "Skill has been deleted.",
        });
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Failed to delete",
        description: "Could not delete skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Skills & Technologies</h2>
        <Button onClick={handleAddItem} disabled={isSaving}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      <div className="space-y-4">
        {skillItems.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No skills added yet.</p>
            <Button onClick={handleAddItem} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          skillItems.map((item, index) => (
            <SkillItemForm
              key={item.id || `new-${index}`}
              item={item}
              isEditing={editingItemId === item.id}
              onEdit={() => handleEditItem(item.id)}
              onChange={(field, value) => handleItemChange(item.id, field, value)}
              onDelete={() => handleDeleteItem(item.id)}
              onSave={() => handleSaveItem(item)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BackOfficeSkills;
