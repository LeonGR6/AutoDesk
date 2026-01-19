import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Brand, CarModel } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminModels() {
  const [models, setModels] = useState<(CarModel & { brands?: { name: string } })[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CarModel | null>(null);
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    year: new Date().getFullYear(),
    price: 0,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    description: '',
    image_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [modelsRes, brandsRes] = await Promise.all([
      supabase.from('car_models').select('*, brands(name)').order('name'),
      supabase.from('brands').select('*').order('name')
    ]);

    if (modelsRes.data) setModels(modelsRes.data as (CarModel & { brands?: { name: string } })[]);
    if (brandsRes.data) setBrands(brandsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const modelData = {
      brand_id: formData.brand_id,
      name: formData.name,
      year: formData.year,
      price: formData.price,
      fuel_type: formData.fuel_type,
      transmission: formData.transmission,
      description: formData.description || null,
      image_url: formData.image_url || null,
    };

    if (editingModel) {
      const { error } = await supabase
        .from('car_models')
        .update(modelData)
        .eq('id', editingModel.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Modelo actualizado correctamente' });
        fetchData();
        closeDialog();
      }
    } else {
      const { error } = await supabase.from('car_models').insert(modelData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Modelo creado correctamente' });
        fetchData();
        closeDialog();
      }
    }
  };

  const handleDelete = async (model: CarModel) => {
    if (!confirm(`¿Estás seguro de eliminar el modelo "${model.name}"?`)) return;

    const { error } = await supabase.from('car_models').delete().eq('id', model.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Modelo eliminado correctamente' });
      fetchData();
    }
  };

  const openEditDialog = (model: CarModel) => {
    setEditingModel(model);
    setFormData({
      brand_id: model.brand_id,
      name: model.name,
      year: model.year,
      price: Number(model.price),
      fuel_type: model.fuel_type || 'Gasolina',
      transmission: model.transmission || 'Automática',
      description: model.description || '',
      image_url: model.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingModel(null);
    setFormData({
      brand_id: '',
      name: '',
      year: new Date().getFullYear(),
      price: 0,
      fuel_type: 'Gasolina',
      transmission: 'Automática',
      description: '',
      image_url: '',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modelos</h1>
          <p className="text-muted-foreground">Administra los modelos de vehículos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => closeDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Editar Modelo' : 'Nuevo Modelo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Select
                    value={formData.brand_id}
                    onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuel_type">Combustible</Label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Diésel">Diésel</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmisión</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automática">Automática</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">{editingModel ? 'Actualizar' : 'Crear'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.brands?.name || '-'}</TableCell>
                  <TableCell>{model.year}</TableCell>
                  <TableCell>{formatPrice(Number(model.price))}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(model)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(model)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {models.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay modelos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
