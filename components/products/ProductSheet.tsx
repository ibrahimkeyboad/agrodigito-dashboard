'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Product, PriceItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Loader2, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess: () => void;
}

// Helper: Merge prices into form-friendly format
const mergePrices = (farmers: PriceItem[] = [], agrovets: PriceItem[] = []) => {
  const map = new Map();
  // Safe check if arrays are null in DB
  (farmers || []).forEach((p) =>
    map.set(p.size, { size: p.size, farmer: p.amount, agrovet: 0 }),
  );
  (agrovets || []).forEach((p) => {
    if (map.has(p.size)) {
      map.get(p.size).agrovet = p.amount;
    } else {
      map.set(p.size, { size: p.size, farmer: 0, agrovet: p.amount });
    }
  });
  return Array.from(map.values());
};

export function ProductSheet({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}: ProductSheetProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    img: '',
    measure: '',
    description: '',
    is_exclusive: false,
    is_featured: false,
    is_popular: false,
    variants: [{ size: '', farmer: 0, agrovet: 0 }],
  });

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        const mergedVariants = mergePrices(
          productToEdit.farmer_price,
          productToEdit.agrovet_price,
        );
        setFormData({
          name: productToEdit.name,
          category: productToEdit.category,
          img: productToEdit.img || '',
          measure: productToEdit.measure || '',
          description: productToEdit.description || '',
          is_exclusive: productToEdit.is_exclusive || false,
          is_featured: productToEdit.is_featured || false,
          is_popular: productToEdit.is_popular || false,
          variants:
            mergedVariants.length > 0
              ? mergedVariants
              : [{ size: '', farmer: 0, agrovet: 0 }],
        });
      } else {
        // Reset
        setFormData({
          name: '',
          category: '',
          img: '',
          measure: '',
          description: '',
          is_exclusive: false,
          is_featured: false,
          is_popular: false,
          variants: [{ size: '', farmer: 0, agrovet: 0 }],
        });
      }
    }
  }, [productToEdit, isOpen]);

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newVariants = [...formData.variants];
    // @ts-ignore
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', farmer: 0, agrovet: 0 }],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) {
      toast.warning('You must have at least one size variant.');
      return;
    }
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async () => {
    if (!formData.name) return toast.error('Product name is required');

    setLoading(true);
    try {
      // transform variants
      const farmer_price = formData.variants.map((v) => ({
        size: v.size,
        amount: Number(v.farmer),
      }));
      const agrovet_price = formData.variants.map((v) => ({
        size: v.size,
        amount: Number(v.agrovet),
      }));

      const payload = {
        name: formData.name,
        category: formData.category,
        img: formData.img,
        measure: formData.measure,
        description: formData.description,
        is_exclusive: formData.is_exclusive,
        is_featured: formData.is_featured,
        is_popular: formData.is_popular,
        farmer_price,
        agrovet_price,
        // No quantity_in_stock in new schema
      };

      if (productToEdit) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', productToEdit.id);
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        toast.success('Product created successfully');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to save product', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* 1. Added more width (sm:max-w-[640px]) for better layout */}
      <SheetContent className='sm:max-w-[640px] w-full p-0 overflow-y-auto bg-slate-50'>
        {/* Header with nice padding */}
        <SheetHeader className='p-6 bg-white border-b border-slate-100 sticky top-0 z-10'>
          <SheetTitle className='text-xl font-bold text-slate-900'>
            {productToEdit ? 'Edit Product' : 'Create New Product'}
          </SheetTitle>
          <SheetDescription>
            Fill in the details below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        {/* Main Form Content with Padding */}
        <div className='p-6 space-y-8'>
          {/* Section 1: Basic Details */}
          <section className='space-y-4'>
            <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider'>
              General Information
            </h4>
            <div className='grid gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>
                    Product Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder='e.g. Snowmectin'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='category'>
                    Category <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='category'
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder='e.g. Pesticides'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='img'>Image URL</Label>
                <Input
                  id='img'
                  value={formData.img}
                  onChange={(e) =>
                    setFormData({ ...formData, img: e.target.value })
                  }
                  placeholder='https://...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='desc'>Description</Label>
                <Textarea
                  id='desc'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Product description and details...'
                  className='resize-none h-24'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='measure'>Unit Measure</Label>
                <Input
                  id='measure'
                  value={formData.measure}
                  onChange={(e) =>
                    setFormData({ ...formData, measure: e.target.value })
                  }
                  placeholder='e.g. Liters, Kgs'
                />
              </div>
            </div>
          </section>

          {/* Section 2: Visibility Flags */}
          <section className='space-y-4'>
            <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider'>
              Visibility & Badges
            </h4>
            <div className='flex gap-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='featured'
                  checked={formData.is_featured}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, is_featured: !!c })
                  }
                />
                <Label htmlFor='featured' className='cursor-pointer'>
                  Featured
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='popular'
                  checked={formData.is_popular}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, is_popular: !!c })
                  }
                />
                <Label htmlFor='popular' className='cursor-pointer'>
                  Popular
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='exclusive'
                  checked={formData.is_exclusive}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, is_exclusive: !!c })
                  }
                />
                <Label htmlFor='exclusive' className='cursor-pointer'>
                  Exclusive
                </Label>
              </div>
            </div>
          </section>

          {/* Section 3: Pricing Variants */}
          <section className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider'>
                Pricing & Variants
              </h4>
              <Button
                size='sm'
                variant='outline'
                onClick={addVariant}
                className='h-8 border-dashed border-slate-300'>
                <Plus className='mr-2 h-3.5 w-3.5' /> Add Variant
              </Button>
            </div>

            <div className='space-y-3'>
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className='flex gap-3 items-end p-4 rounded-xl bg-white border border-slate-200 shadow-sm transition-all hover:border-green-200'>
                  <div className='grid gap-1.5 flex-[2]'>
                    <Label className='text-xs font-medium text-slate-500'>
                      Size
                    </Label>
                    <Input
                      className='h-9'
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, 'size', e.target.value)
                      }
                      placeholder='e.g. 1Ltr'
                    />
                  </div>
                  <div className='grid gap-1.5 flex-[3]'>
                    <Label className='text-xs font-medium text-green-700'>
                      Farmer Price (TSh)
                    </Label>
                    <Input
                      className='h-9 font-mono'
                      type='number'
                      value={variant.farmer}
                      onChange={(e) =>
                        handleVariantChange(index, 'farmer', e.target.value)
                      }
                    />
                  </div>
                  <div className='grid gap-1.5 flex-[3]'>
                    <Label className='text-xs font-medium text-blue-700'>
                      Agrovet Price (TSh)
                    </Label>
                    <Input
                      className='h-9 font-mono'
                      type='number'
                      value={variant.agrovet}
                      onChange={(e) =>
                        handleVariantChange(index, 'agrovet', e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-9 w-9 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg'
                    onClick={() => removeVariant(index)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <SheetFooter className='p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10'>
          <div className='flex w-full gap-4'>
            <Button variant='outline' className='flex-1' onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className='flex-1 bg-green-600 hover:bg-green-700'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              <Save className='mr-2 h-4 w-4' /> Save Product
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
