import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Tag, Users, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalModels: 0,
    totalUsers: 0,
    avgPrice: 0,
  });
  const [recentModels, setRecentModels] = useState<{ name: string; brand: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    
    const [brandsRes, modelsRes, profilesRes, recentRes] = await Promise.all([
      supabase.from('brands').select('id', { count: 'exact', head: true }),
      supabase.from('car_models').select('price'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('car_models').select('name, price, brands(name)').order('created_at', { ascending: false }).limit(5)
    ]);

    const prices = modelsRes.data?.map(m => Number(m.price)) || [];
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    setStats({
      totalBrands: brandsRes.count || 0,
      totalModels: modelsRes.data?.length || 0,
      totalUsers: profilesRes.count || 0,
      avgPrice,
    });

    if (recentRes.data) {
      setRecentModels(recentRes.data.map((m: any) => ({
        name: m.name,
        brand: m.brands?.name || 'N/A',
        price: Number(m.price),
      })));
    }

    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statCards = [
    { title: 'Total Marcas', value: stats.totalBrands, icon: Tag, color: 'text-primary' },
    { title: 'Total Modelos', value: stats.totalModels, icon: Car, color: 'text-secondary' },
    { title: 'Usuarios', value: stats.totalUsers, icon: Users, color: 'text-muted-foreground' },
    { title: 'Precio Promedio', value: formatPrice(stats.avgPrice), icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modelos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentModels.map((model, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{model.name}</p>
                  <p className="text-sm text-muted-foreground">{model.brand}</p>
                </div>
                <span className="font-semibold text-primary">{formatPrice(model.price)}</span>
              </div>
            ))}
            {recentModels.length === 0 && !loading && (
              <p className="text-muted-foreground text-center py-4">No hay modelos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
