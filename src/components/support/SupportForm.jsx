'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { supportTicketSchema } from '@/utils/validators';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

export default function SupportForm() {
  const [serverFeedback, setServerFeedback] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      name: '',
      email: '',
      category: 'general',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setSubmitError(null);
    setServerFeedback(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setSubmitError(json?.error?.message || 'Validation failed on the server.');
        return;
      }

      setServerFeedback(json.data);
      reset();
    } catch {
      setSubmitError('Unable to reach /api/support right now.');
    }
  };

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-[#29342d] bg-[#151d18] p-6 md:p-8"
    >
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
          Support Inquiry
        </h2>
        <p className="text-xs text-[#9ba69d]">
          Validated client-side and server-side via{' '}
          <code className="text-[#c6ff3d]">POST /api/support</code>. Database persistence activates
          once Supabase tables are configured in Phases 18–19.
        </p>
      </div>

      {serverFeedback ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3.5 text-xs text-emerald-200"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverFeedback.message}</span>
        </div>
      ) : null}

      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-400/35 bg-red-400/10 p-3.5 text-xs text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="support-name"
            className="block font-mono text-xs uppercase text-[#9ba69d]"
          >
            Name
          </label>
          <Input id="support-name" type="text" error={errors.name} {...register('name')} />
          {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="support-email"
            className="block font-mono text-xs uppercase text-[#9ba69d]"
          >
            Email
          </label>
          <Input id="support-email" type="email" error={errors.email} {...register('email')} />
          {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="support-category"
          className="block font-mono text-xs uppercase text-[#9ba69d]"
        >
          Category
        </label>
        <Select id="support-category" {...register('category')}>
          <option value="general">General Feedback</option>
          <option value="3d-performance">3D / WebGL Performance</option>
          <option value="account-future">Account & Squad Sync</option>
          <option value="bug-report">Bug Report</option>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="support-message"
          className="block font-mono text-xs uppercase text-[#9ba69d]"
        >
          Message
        </label>
        <Textarea id="support-message" rows={4} error={errors.message} {...register('message')} />
        {errors.message ? <p className="text-xs text-red-400">{errors.message.message}</p> : null}
      </div>

      <Button type="submit" loading={isSubmitting}>
        Submit Inquiry
      </Button>
    </form>
  );
}
