-- Eliminar tabla anterior si existe
drop table if exists talentos;

-- Crear tabla con estructura correcta
create table talentos (
  id            uuid default gen_random_uuid() primary key,
  nombre        text not null,
  edad          integer,
  categoria     text not null check (categoria in ('modelos','fotografos','maquilladores')),
  rol           text,              -- "Modelo", "Fotógrafa", "Maquilladora"...

  -- Solo modelos
  altura        text,              -- "1,73 m"
  busto         text,
  cintura       text,
  cadera        text,
  talle_ropa    text,              -- "M", "S", "38"
  talle_calzado text,
  pelo          text,              -- "Castaño claro, lacio"
  ojos          text,              -- "Celestes"

  -- Solo fotógrafos y maquilladores
  estilo        text,              -- "Editorial, retrato, moda"

  -- Imágenes (URLs de Cloudinary)
  portada_1     text,
  portada_2     text,
  galeria       text[],            -- Array de hasta 6 URLs

  created_at    timestamp with time zone default timezone('utc', now()) not null
);

-- Row Level Security
alter table talentos enable row level security;

-- Cualquiera puede leer
create policy "Lectura pública"
  on talentos for select
  using (true);

-- Solo usuarios autenticados pueden escribir
create policy "Escritura autenticada"
  on talentos for all
  using (auth.role() = 'authenticated');
