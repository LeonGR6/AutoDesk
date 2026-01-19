import { Card, CardContent } from '@/components/ui/card';
import { Brand } from '@/types/database';
import { Link } from 'react-router-dom';

interface BrandCardProps {
  brand: Brand;
  modelCount?: number;
}

export function BrandCard({ brand, modelCount }: BrandCardProps) {
  return (
    <Link to={`/tienda?brand=${brand.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-muted/50 rounded-2xl">
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <span className="text-3xl font-bold text-primary">{brand.name.charAt(0)}</span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {brand.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
          {modelCount !== undefined && (
            <p className="text-sm text-primary mt-3 font-medium">
              {modelCount} modelos
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
