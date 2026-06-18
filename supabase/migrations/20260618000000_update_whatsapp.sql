-- Set WhatsApp number to +213770741873
INSERT INTO public.admin_settings (id, whatsapp_number)
VALUES (1, '213770741873')
ON CONFLICT (id) DO UPDATE SET whatsapp_number = EXCLUDED.whatsapp_number;
