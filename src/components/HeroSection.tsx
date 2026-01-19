import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import { ArrowRight, Car } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Showroom de autos"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Tu próximo vehículo te espera en{' '}
            <span className="text-primary">AutoMax</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Descubre nuestra colección exclusiva de camionetas y SUVs de las mejores marcas. 
            Calidad, confianza y el mejor servicio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </section>
  );
}
