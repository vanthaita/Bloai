import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/admin/blog');
  return null;
}