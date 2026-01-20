import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Tag, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  brandsCount?: number;
  modelsCount?: number;
}

export function HeroSection({ brandsCount = 0, modelsCount = 0 }: HeroSectionProps) {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Encuentra tu próximo{' '}
            <span className="text-primary">vehículo ideal</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Descubre nuestra colección exclusiva de camionetas y SUVs de las mejores marcas. 
            Calidad, confianza y el mejor servicio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tienda">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Car className="h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/marcas">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explorar Marcas
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{brandsCount}</h3>
            <p className="text-muted-foreground">Marcas Disponibles</p>
          </div>
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{modelsCount}</h3>
            <p className="text-muted-foreground">Modelos en Stock</p>
          </div>
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">100%</h3>
            <p className="text-muted-foreground">Garantía Incluida</p>
          </div>
        </div>
      </div>
    </section>
  );
}
