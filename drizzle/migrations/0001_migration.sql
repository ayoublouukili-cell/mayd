create policy "Portfolio media is readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio');

create policy "Admins can upload portfolio media"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update portfolio media"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete portfolio media"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio' and public.has_role(auth.uid(), 'admin'));