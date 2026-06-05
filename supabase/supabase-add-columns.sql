-- Agregar campos faltantes de modelos
alter table talentos add column if not exists hombros        text;
alter table talentos add column if not exists talle_pantalon text;
alter table talentos add column if not exists ubicacion      text;
