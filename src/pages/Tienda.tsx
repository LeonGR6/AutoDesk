import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { CarCard } from '@/components/CarCard';
import { Brand, CarModel } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';

const Tienda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<(CarModel & { brands?: { name: string } })[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) setSelectedBrand(brandParam);
  }, [searchParams]);

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

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    if (value === 'all') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', value);
    }
    setSearchParams(searchParams);
  };

  let filteredCars = cars;
  
  // Filter by brand
  if (selectedBrand !== 'all') {
    filteredCars = filteredCars.filter(car => car.brand_id === selectedBrand);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredCars = filteredCars.filter(car => 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort
  switch (sortBy) {
    case 'price-asc':
      filteredCars = [...filteredCars].sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      filteredCars = [...filteredCars].sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'name':
      filteredCars = [...filteredCars].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'year':
      filteredCars = [...filteredCars].sort((a, b) => b.year - a.year);
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tienda</h1>
          <p className="text-muted-foreground">Encuentra el vehículo perfecto para ti</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedBrand} onValueChange={handleBrandChange}>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="name">Nombre A-Z</SelectItem>
              <SelectItem value="year">Año más reciente</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{filteredCars.length} vehículos encontrados</span>
          </div>
        </div>

        {/* Cars Grid */}
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
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No se encontraron vehículos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tienda;
