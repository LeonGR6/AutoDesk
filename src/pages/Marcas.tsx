import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { BrandCard } from '@/components/BrandCard';
import { Brand, CarModel } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

const Marcas = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [carCounts, setCarCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [brandsRes, carsRes] = await Promise.all([
      supabase.from('brands').select('*').order('name'),
      supabase.from('car_models').select('brand_id')
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    
    if (carsRes.data) {
      const counts: Record<string, number> = {};
      carsRes.data.forEach((car: { brand_id: string }) => {
        counts[car.brand_id] = (counts[car.brand_id] || 0) + 1;
      });
      setCarCounts(counts);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Marcas</h1>
          <p className="text-muted-foreground">Explora nuestras marcas disponibles</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <BrandCard 
                key={brand.id} 
                brand={brand} 
                modelCount={carCounts[brand.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marcas;
