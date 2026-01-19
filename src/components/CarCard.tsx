import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CarModel } from '@/types/database';
import { Fuel, Settings2, Calendar, DollarSign } from 'lucide-react';

interface CarCardProps {
  car: CarModel & { brands?: { name: string } };
}

export function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
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
          {car.brands?.name && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {car.brands.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{car.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{car.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Settings2 className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1 text-primary font-bold text-lg">
          <DollarSign className="h-5 w-5" />
          {formatPrice(car.price)}
        </div>
        <Button size="sm">Ver detalles</Button>
      </CardFooter>
    </Card>
  );
}
