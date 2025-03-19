import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PortfolioService, PortfolioItem } from '@/utils/airtable';
import PortfolioItemForm from '@/components/PortfolioItemForm';

const BackOfficePortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setIsLoading(true);
      const items = await PortfolioService.getAll();
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
      toast({
        title: "Failed to load portfolio items",
        description: "Could not load portfolio items. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: PortfolioItem = {
      title: "",
      description: "",
      image: "",
      tags: [],
    };
    
    setPortfolioItems([...portfolioItems, newItem]);
    setEditingItemId('new');
  };

  const handleItemChange = (id: string | undefined, field: string, value: any) => {
    setPortfolioItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditItem = (id: string | undefined) => {
    setEditingItemId(id || null);
  };

  const handleSaveItem = async (item: PortfolioItem) => {
    try {
      setIsSaving(true);
      const savedItem = await PortfolioService.save(item);
      
      if (savedItem) {
        setPortfolioItems(prev => {
          // If this was a new item, replace it with the saved version
          if (!item.id) {
            return [...prev.filter(i => i !== item), savedItem];
          }
          
          // Otherwise update the existing item
          return prev.map(i => i.id === item.id ? savedItem : i);
        });
        
        toast({
          title: "Item saved",
          description: "Portfolio item has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: "Failed to save",
        description: "Could not save portfolio item. Please try again.",
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
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    
    try {
      const success = await PortfolioService.delete(id);
      
      if (success) {
        setPortfolioItems(prev => prev.filter(item => item.id !== id));
        
        toast({
          title: "Item deleted",
          description: "Portfolio item has been deleted.",
        });
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Failed to delete",
        description: "Could not delete portfolio item. Please try again.",
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
        <h2 className="text-xl font-bold">Portfolio Items</h2>
        <Button onClick={handleAddItem} disabled={isSaving}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <div className="space-y-4">
        {portfolioItems.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No portfolio items yet.</p>
            <Button onClick={handleAddItem} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Portfolio Item
            </Button>
          </div>
        ) : (
          portfolioItems.map((item, index) => (
            <PortfolioItemForm
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

export default BackOfficePortfolio;
