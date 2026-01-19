import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CarCard } from '@/components/CarCard';
import { BrandCard } from '@/components/BrandCard';
import { Brand, CarModel } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<(CarModel & { brands?: { name: string } })[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [brandsRes, carsRes] = await Promise.all([
      supabase.from('brands').select('*').order('name'),
      supabase.from('car_models').select('*, brands(name)').order('created_at', { ascending: false })
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    if (carsRes.data) setCars(carsRes.data as (CarModel & { brands?: { name: string } })[]);
    setLoading(false);
  };

  const filteredCars = selectedBrand === 'all' 
    ? cars 
    : cars.filter(car => car.brand_id === selectedBrand);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Featured Brands */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Marcas Destacadas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trabajamos con las mejores marcas del mercado para ofrecerte calidad y confiabilidad.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <BrandCard 
                key={brand.id} 
                brand={brand} 
                modelCount={cars.filter(c => c.brand_id === brand.id).length}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cars Catalog with Filter */}
      <section className="container mx-auto px-4 py-16 bg-card/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Nuestro Catálogo</h2>
            <p className="text-muted-foreground">
              Explora nuestra selección de vehículos disponibles.
            </p>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {filteredCars.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron vehículos para esta marca.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold text-lg mb-2">AutoMax Dealership</p>
          <p className="text-sm opacity-80">© 2024 Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
