'use client';

import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { useApiMutation, queryKeys } from '@/lib/api';
import { ClubEvent } from '@/lib/types';
import { csrfHeaders } from '@/lib/csrf';
import { toast } from 'sonner';
import { uploadCloudinary } from '@/lib/cloudinary';

interface EventsSectionProps {
  events: ClubEvent[];
  isAdmin: boolean;
  manage?: boolean;
}

export default function EventsSection({ events, isAdmin, manage = false }: EventsSectionProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const mutation = useApiMutation([queryKeys.events]);
  const imageUploadMutation = useMutation({ mutationFn: uploadCloudinary });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const { secure_url } = await imageUploadMutation.mutateAsync(file);
      setImageUrl(secure_url);
      toast.success('Image uploaded.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  const startEdit = (event: ClubEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setImageUrl(event.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Enter an event heading and description.');
      return;
    }
    setIsSaving(true);
    try {
      const isEditing = editingId !== null;
      await mutation.mutateAsync({
        url: isEditing ? `/api/events/${editingId}` : '/api/events',
        method: isEditing ? 'PATCH' : 'POST',
        headers: csrfHeaders(),
        body: { title: title.trim(), description: description.trim(), image_url: imageUrl.trim() || '/images/bg.webp' },
      });
      resetForm();
      toast.success(isEditing ? 'Event updated.' : 'Event created.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save event.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeEvent = async (event: ClubEvent) => {
    if (!confirm(`Delete “${event.title}”?`)) return;
    try {
      await mutation.mutateAsync({ url: `/api/events/${event.id}`, method: 'DELETE', headers: csrfHeaders() });
      if (editingId === event.id) resetForm();
      toast.success('Event deleted.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete event.');
    }
  };

  return (
    <section aria-labelledby="events-heading" className={manage ? 'py-8' : 'bg-white py-12 sm:py-16'}>
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[2.5px] text-saffron">Out in the field</p>
          <h2 id="events-heading" className="mt-2 font-serif text-3xl font-bold text-jade sm:text-4xl">Club Events</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Field trips, community gatherings, and moments worth sharing.</p>
        </div>

        {manage && isAdmin && (
          <form onSubmit={saveEvent} className="mb-10 rounded-2xl border-2 border-dashed border-jade/40 bg-cream p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-jade">
              {editingId === null ? <Plus size={18} /> : <Pencil size={17} />}
              {editingId === null ? 'Create an event' : 'Edit event'}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-neutral-600">Heading text
                <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} placeholder="e.g. Wetland Watch at Sukhna Lake" className="mt-1 w-full rounded-lg border border-borderLight bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-jade" />
              </label>
              <div className="text-xs font-semibold text-neutral-600">Event image
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={isUploadingImage || isSaving} className="inline-flex items-center gap-2 rounded-lg border border-borderLight bg-white px-3 py-2.5 text-sm font-semibold text-jade hover:bg-jade-light disabled:opacity-50">
                    {isUploadingImage ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
                    {isUploadingImage ? 'Uploading image…' : 'Upload image'}
                  </button>
                  {imageUrl && <img src={imageUrl} alt="Selected event" className="h-12 w-16 rounded-md border border-borderLight object-cover" />}
                </div>
              </div>
              <label className="text-xs font-semibold text-neutral-600 sm:col-span-2">Description text
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="Tell visitors about this event…" className="mt-1 w-full rounded-lg border border-borderLight bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-jade" />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={isSaving || isUploadingImage} className="rounded-lg bg-jade px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#135a38] disabled:opacity-50">{isSaving ? 'Saving…' : editingId === null ? 'Create event' : 'Save changes'}</button>
              {editingId !== null && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-200"><X size={15} /> Cancel</button>}
            </div>
          </form>
        )}

        {events.length === 0 ? (
          <p className="rounded-xl bg-cream p-6 text-sm text-neutral-600">No events have been added yet.</p>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {events.map((event, index) => (
              <article key={event.id} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-cream shadow-sm">
                {manage && isAdmin && (
                  <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <button type="button" onClick={() => startEdit(event)} aria-label={`Edit ${event.title}`} className="rounded-lg bg-white/95 p-2 text-jade shadow hover:bg-white"><Pencil size={16} /></button>
                    <button type="button" onClick={() => removeEvent(event)} aria-label={`Delete ${event.title}`} className="rounded-lg bg-white/95 p-2 text-rose shadow hover:bg-white"><Trash2 size={16} /></button>
                  </div>
                )}
                <div className={`flex flex-col md:min-h-[330px] ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <div className="h-[230px] w-full shrink-0 overflow-hidden md:h-[330px] md:w-1/2">
                    <img src={event.image_url || '/images/bg.webp'} alt={event.title} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/bg.webp'; }} />
                  </div>
                  <div className="flex flex-1 items-center p-6 sm:p-9 md:w-1/2 md:p-12">
                    <div className="max-w-xl">
                      <p className="text-xs font-bold uppercase tracking-[2px] text-saffron">Chandigarh Birding Club</p>
                      <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-jade sm:text-3xl">{event.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-neutral-700 sm:text-base">{event.description}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
