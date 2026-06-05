-- Permite elegir si la medida del torso es "Busto" o "Pecho"
-- Los registros existentes quedan con 'Busto' por defecto
alter table talentos    add column if not exists busto_label text default 'Busto';
alter table solicitudes add column if not exists busto_label text default 'Busto';
