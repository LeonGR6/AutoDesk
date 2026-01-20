import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CarModel } from '@/types/database';
import { Fuel, Settings2, Calendar } from 'lucide-react';
import { CarDetailModal } from './CarDetailModal';

interface CarCardProps {
  car: CarModel & { brands?: { name: string } };
}

export function CarCard({ car }: CarCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden bg-muted rounded-t-2xl">
            {car.image_url ? (
              <img
                src={car.image_url}
                alt={car.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                <span className="text-4xl font-bold text-secondary">{car.name.charAt(0)}</span>
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Nuevo
            </Badge>
            {car.brands?.name && (
              <Badge className="absolute top-3 right-3" variant="secondary">
                {car.brands.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2">{car.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{car.description}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-xl">
              <Calendar className="h-4 w-4" />
              {car.year}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-xl">
              <Fuel className="h-4 w-4" />
              {car.fuel_type}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-xl">
              <Settings2 className="h-4 w-4" />
              {car.transmission}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between">
          <div className="text-primary font-bold text-xl">
            {formatPrice(car.price)}
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>Ver detalles</Button>
        </CardFooter>
      </Card>

      <CarDetailModal car={car} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
