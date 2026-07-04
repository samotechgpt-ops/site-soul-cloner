
CREATE POLICY "admin_settings_no_client_access" ON public.admin_settings FOR ALL USING (false) WITH CHECK (false);
