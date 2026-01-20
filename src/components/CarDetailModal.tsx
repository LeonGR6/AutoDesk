import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CarModel } from '@/types/database';
import { Fuel, Settings2, Calendar, DollarSign } from 'lucide-react';

interface CarDetailModalProps {
  car: (CarModel & { brands?: { name: string } }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CarDetailModal({ car, open, onOpenChange }: CarDetailModalProps) {
  if (!car) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{car.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            {car.image_url ? (
              <img
                src={car.image_url}
                alt={car.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                <span className="text-4xl font-bold text-secondary">{car.name.charAt(0)}</span>
              </div>
            )}
            {car.brands?.name && (
              <Badge className="absolute top-3 right-3" variant="secondary">
                {car.brands.name}
              </Badge>
            )}
          </div>

          {/* Description */}
          {car.description && (
            <p className="text-muted-foreground">{car.description}</p>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Año</p>
                <p className="font-medium">{car.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
              <Fuel className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Combustible</p>
                <p className="font-medium">{car.fuel_type || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
              <Settings2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Transmisión</p>
                <p className="font-medium">{car.transmission || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Precio</p>
                <p className="font-medium text-primary">{formatPrice(car.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

