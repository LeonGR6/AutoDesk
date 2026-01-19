import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CarCard } from '@/components/CarCard';
import { Brand, CarModel } from '@/types/database';
import { Button } from '@/components/ui/button';
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

      {/* Brand Filter Pills */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Explora por Marca</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecciona una marca para filtrar los vehículos disponibles.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center gap-3 flex-wrap">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              variant={selectedBrand === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedBrand('all')}
              className="rounded-xl"
            >
              Todas
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? 'default' : 'outline'}
                onClick={() => setSelectedBrand(brand.id)}
                className="rounded-xl"
              >
                {brand.name}
              </Button>
            ))}
          </div>
        )}
      </section>

      {/* Cars Catalog */}
      <section className="container mx-auto px-4 py-12 bg-card/50 rounded-3xl mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Nuestro Catálogo</h2>
            <p className="text-muted-foreground">
              {filteredCars.length} vehículos disponibles
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
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
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">AutoMax</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AutoMax Dealership. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
