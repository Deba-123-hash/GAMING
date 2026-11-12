import { getServerSupabaseClient } from '@/lib/supabase/server';

export async function submitSupportInquiry(validatedPayload) {
  const supabase = getServerSupabaseClient();

  if (!supabase) {
    return {
      accepted: true,
      persisted: false,
      mode: 'validation-only-no-db',
      message:
        'Validated by /api/support. Supabase credentials are not configured, so the inquiry was not stored in a database.',
    };
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert([
      {
        name: validatedPayload.name,
        email: validatedPayload.email,
        category: validatedPayload.category,
        message: validatedPayload.message,
      },
    ])
    .select('id')
    .single();

  if (error) {
    return {
      accepted: true,
      persisted: false,
      mode: 'supabase-table-unavailable',
      message:
        'Validated by /api/support, but database table insertion failed. Ensure Phase 19 SQL migrations are applied.',
    };
  }

  return {
    accepted: true,
    persisted: true,
    mode: 'supabase',
    ticketId: data?.id || null,
    message: 'Support inquiry saved.',
  };
}
