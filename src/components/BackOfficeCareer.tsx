import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { CareerService, CareerItem } from '@/utils/airtable';
import CareerItemForm from '@/components/CareerItemForm';

const BackOfficeCareer = () => {
  const [careerItems, setCareerItems] = useState<CareerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCareerItems();
  }, []);

  const loadCareerItems = async () => {
    try {
      setIsLoading(true);
      const items = await CareerService.getAll();
      setCareerItems(items);
    } catch (error) {
      console.error('Error loading career items:', error);
      toast({
        title: "Failed to load career items",
        description: "Could not load career items. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: CareerItem = {
      title: "",
      company: "",
      location: "",
      period: "",
      description: "",
      type: "work",
    };
    
    setCareerItems([...careerItems, newItem]);
    setEditingItemId('new');
  };

  const handleItemChange = (id: string | undefined, field: string, value: any) => {
    setCareerItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditItem = (id: string | undefined) => {
    setEditingItemId(id || null);
  };

  const handleSaveItem = async (item: CareerItem) => {
    try {
      setIsSaving(true);
      const savedItem = await CareerService.save(item);
      
      if (savedItem) {
        setCareerItems(prev => {
          // If this was a new item, replace it with the saved version
          if (!item.id) {
            return [...prev.filter(i => i !== item), savedItem];
          }
          
          // Otherwise update the existing item
          return prev.map(i => i.id === item.id ? savedItem : i);
        });
        
        toast({
          title: "Item saved",
          description: "Career item has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving career item:', error);
      toast({
        title: "Failed to save",
        description: "Could not save career item. Please try again.",
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
      setCareerItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    
    try {
      const success = await CareerService.delete(id);
      
      if (success) {
        setCareerItems(prev => prev.filter(item => item.id !== id));
        
        toast({
          title: "Item deleted",
          description: "Career item has been deleted.",
        });
      }
    } catch (error) {
      console.error('Error deleting career item:', error);
      toast({
        title: "Failed to delete",
        description: "Could not delete career item. Please try again.",
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
        <h2 className="text-xl font-bold">Career Timeline</h2>
        <Button onClick={handleAddItem} disabled={isSaving}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <div className="space-y-4">
        {careerItems.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No career items yet.</p>
            <Button onClick={handleAddItem} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Career Item
            </Button>
          </div>
        ) : (
          careerItems.map((item, index) => (
            <CareerItemForm
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

export default BackOfficeCareer;
