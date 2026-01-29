'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  Package,
} from 'lucide-react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductSheet } from '@/components/products/ProductSheet';
import { deleteProductAction, revalidateProducts } from './actions';
import { useDebounce } from '@/hooks/use-debounce';

const formatPriceRange = (variants: any) => {
  // ✅ FIX: Strictly check if variants is an array
  if (!Array.isArray(variants) || variants.length === 0) return 'N/A';

  const prices = variants.map((v) => v.amount);

  // Safe check if prices array is empty (defensive programming)
  if (prices.length === 0) return 'N/A';

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) return `TSh ${min.toLocaleString()}`;
  return `TSh ${min.toLocaleString()} - ${max.toLocaleString()}`;
};

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsSheetOpen(true);
  };
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Updated ID type to number
    const loadingToast = toast.loading('Deleting product...');
    const result = await deleteProductAction(id.toString()); // Convert number to string for server action if needed, or update action types
    if (result.success) {
      toast.dismiss(loadingToast);
      toast.success('Product deleted');
    } else {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete product');
    }
  };

  const handleSheetSuccess = async () => {
    await revalidateProducts();
    router.refresh();
  };

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return initialProducts;
    const lowerTerm = debouncedSearch.toLowerCase();
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerTerm) ||
        p.category.toLowerCase().includes(lowerTerm),
    );
  }, [initialProducts, debouncedSearch]);

  return (
    <div className='space-y-6'>
      {/* Top Stats - Cleaned up */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='bg-green-600 border-none shadow-md text-white md:col-span-1'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium mb-1'>
                Total Products
              </p>
              <h3 className='text-3xl font-bold'>{initialProducts.length}</h3>
            </div>
            <div className='h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <Package className='h-6 w-6 text-white' />
            </div>
          </CardContent>
        </Card>

        {/* Add Product Button Card */}
        <Card
          className='border-dashed border-2 border-slate-300 bg-slate-50/50 shadow-none flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-green-400 transition-all group md:col-span-1'
          onClick={handleCreate}>
          <div className='flex flex-col items-center gap-2 text-slate-400 group-hover:text-green-600 transition-colors py-4'>
            <div className='h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform'>
              <Plus className='h-5 w-5' />
            </div>
            <span className='text-sm font-semibold'>Add New Product</span>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <Input
            placeholder='Search products...'
            className='pl-10 border-none bg-slate-50 focus-visible:ring-0 h-11 rounded-xl'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2 w-full sm:w-auto px-2'>
          <Button
            variant='outline'
            className='flex-1 sm:flex-none border-slate-200 rounded-xl h-10 gap-2 text-slate-600'>
            <Filter className='h-4 w-4' /> Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className='shadow-sm border-slate-200 overflow-hidden rounded-2xl'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-slate-50/80'>
              <TableRow>
                <TableHead className='w-[80px] py-4 pl-6'>Image</TableHead>
                <TableHead className='py-4'>Product Details</TableHead>
                <TableHead className='py-4'>Category</TableHead>
                {/* Removed Stock Status Column */}
                <TableHead className='py-4'>Pricing (Farmer)</TableHead>
                <TableHead className='text-right py-4 pr-6'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-64 text-center'>
                    <div className='flex flex-col items-center justify-center text-slate-500'>
                      <p className='font-medium'>No products found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className='hover:bg-slate-50/60 transition-colors'>
                    <TableCell className='pl-6 py-3'>
                      <div className='relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 bg-white shadow-sm'>
                        {product.img ? (
                          <img
                            src={`${product.img}`}
                            alt={product.name}
                            sizes='48px'
                            className='object-cover'
                            // unoptimized={true} // ✅ ADD THIS LINE
                            // priority
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center text-sm font-bold text-slate-300 bg-slate-50'>
                            {product.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-semibold text-slate-900'>
                          {product.name}
                        </span>
                        <div className='flex gap-2'>
                          {product.is_featured && (
                            <Badge
                              variant='secondary'
                              className='text-[10px] h-5 bg-yellow-50 text-yellow-700 border-yellow-200'>
                              Featured
                            </Badge>
                          )}
                          {product.is_popular && (
                            <Badge
                              variant='secondary'
                              className='text-[10px] h-5 bg-purple-50 text-purple-700 border-purple-200'>
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm font-medium text-slate-600'>
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className='font-medium text-slate-900'>
                      {formatPriceRange(product.farmer_price)}
                    </TableCell>
                    <TableCell className='text-right pr-6'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-lg'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='w-[160px] rounded-xl'>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className='mr-2 h-4 w-4' /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() => handleDelete(product.id)}>
                            <Trash2 className='mr-2 h-4 w-4' /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        productToEdit={selectedProduct}
        onSuccess={handleSheetSuccess}
      />
    </div>
  );
}
