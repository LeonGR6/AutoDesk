-- Create brands table
CREATE TABLE public.brands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create models table
CREATE TABLE public.car_models (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    description TEXT,
    fuel_type TEXT,
    transmission TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app_role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for brands (public read, admin write)
CREATE POLICY "Anyone can view brands" ON public.brands
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert brands" ON public.brands
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brands" ON public.brands
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brands" ON public.brands
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for car_models (public read, admin write)
CREATE POLICY "Anyone can view car models" ON public.car_models
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert car models" ON public.car_models
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update car models" ON public.car_models
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete car models" ON public.car_models
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial data: 5 brands
INSERT INTO public.brands (name, description) VALUES
    ('GMC', 'Marca americana de camionetas y SUVs premium'),
    ('Ford', 'Fabricante estadounidense con larga trayectoria'),
    ('Chevrolet', 'Marca icónica americana de General Motors'),
    ('Toyota', 'Fabricante japonés líder en confiabilidad'),
    ('Honda', 'Marca japonesa conocida por su eficiencia');

-- Insert initial data: 5 models per brand
INSERT INTO public.car_models (brand_id, name, year, price, fuel_type, transmission, description) VALUES
    -- GMC models
    ((SELECT id FROM public.brands WHERE name = 'GMC'), 'Sierra', 2024, 55000.00, 'Gasolina', 'Automática', 'Camioneta pickup de trabajo pesado'),
    ((SELECT id FROM public.brands WHERE name = 'GMC'), 'Yukon', 2024, 72000.00, 'Gasolina', 'Automática', 'SUV de lujo de tamaño completo'),
    ((SELECT id FROM public.brands WHERE name = 'GMC'), 'Terrain', 2024, 35000.00, 'Gasolina', 'Automática', 'SUV compacta versátil'),
    ((SELECT id FROM public.brands WHERE name = 'GMC'), 'Acadia', 2024, 45000.00, 'Gasolina', 'Automática', 'SUV mediana para familias'),
    ((SELECT id FROM public.brands WHERE name = 'GMC'), 'Canyon', 2024, 42000.00, 'Gasolina', 'Automática', 'Pickup mediana todoterreno'),
    -- Ford models
    ((SELECT id FROM public.brands WHERE name = 'Ford'), 'F-150', 2024, 48000.00, 'Gasolina', 'Automática', 'La pickup más vendida de América'),
    ((SELECT id FROM public.brands WHERE name = 'Ford'), 'Mustang', 2024, 55000.00, 'Gasolina', 'Manual', 'Muscle car icónico'),
    ((SELECT id FROM public.brands WHERE name = 'Ford'), 'Explorer', 2024, 52000.00, 'Gasolina', 'Automática', 'SUV familiar espaciosa'),
    ((SELECT id FROM public.brands WHERE name = 'Ford'), 'Bronco', 2024, 58000.00, 'Gasolina', 'Automática', 'SUV todoterreno aventurera'),
    ((SELECT id FROM public.brands WHERE name = 'Ford'), 'Ranger', 2024, 38000.00, 'Gasolina', 'Automática', 'Pickup mediana versátil'),
    -- Chevrolet models
    ((SELECT id FROM public.brands WHERE name = 'Chevrolet'), 'Silverado', 2024, 52000.00, 'Gasolina', 'Automática', 'Pickup robusta y confiable'),
    ((SELECT id FROM public.brands WHERE name = 'Chevrolet'), 'Tahoe', 2024, 68000.00, 'Gasolina', 'Automática', 'SUV grande para toda la familia'),
    ((SELECT id FROM public.brands WHERE name = 'Chevrolet'), 'Camaro', 2024, 45000.00, 'Gasolina', 'Manual', 'Deportivo de alto rendimiento'),
    ((SELECT id FROM public.brands WHERE name = 'Chevrolet'), 'Equinox', 2024, 32000.00, 'Gasolina', 'Automática', 'SUV compacta eficiente'),
    ((SELECT id FROM public.brands WHERE name = 'Chevrolet'), 'Colorado', 2024, 40000.00, 'Gasolina', 'Automática', 'Pickup mediana moderna'),
    -- Toyota models
    ((SELECT id FROM public.brands WHERE name = 'Toyota'), 'Tacoma', 2024, 42000.00, 'Gasolina', 'Automática', 'Pickup mediana legendaria'),
    ((SELECT id FROM public.brands WHERE name = 'Toyota'), 'Tundra', 2024, 58000.00, 'Gasolina', 'Automática', 'Pickup de tamaño completo'),
    ((SELECT id FROM public.brands WHERE name = 'Toyota'), '4Runner', 2024, 52000.00, 'Gasolina', 'Automática', 'SUV todoterreno resistente'),
    ((SELECT id FROM public.brands WHERE name = 'Toyota'), 'RAV4', 2024, 35000.00, 'Híbrido', 'Automática', 'SUV compacta popular'),
    ((SELECT id FROM public.brands WHERE name = 'Toyota'), 'Supra', 2024, 55000.00, 'Gasolina', 'Automática', 'Deportivo de alto rendimiento'),
    -- Honda models
    ((SELECT id FROM public.brands WHERE name = 'Honda'), 'Pilot', 2024, 48000.00, 'Gasolina', 'Automática', 'SUV familiar de tres filas'),
    ((SELECT id FROM public.brands WHERE name = 'Honda'), 'CR-V', 2024, 35000.00, 'Híbrido', 'Automática', 'SUV compacta best-seller'),
    ((SELECT id FROM public.brands WHERE name = 'Honda'), 'Accord', 2024, 32000.00, 'Híbrido', 'Automática', 'Sedán mediano premium'),
    ((SELECT id FROM public.brands WHERE name = 'Honda'), 'Civic', 2024, 28000.00, 'Gasolina', 'Manual', 'Compacto deportivo y eficiente'),
    ((SELECT id FROM public.brands WHERE name = 'Honda'), 'Ridgeline', 2024, 45000.00, 'Gasolina', 'Automática', 'Pickup con plataforma unibody');