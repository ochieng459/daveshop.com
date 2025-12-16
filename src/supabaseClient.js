import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gplepywdzilowlxxnlre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbGVweXdkemlsb3dseHhubHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTA0NjEsImV4cCI6MjA4MDUyNjQ2MX0.J7aXqrTzSCvwMR8ChRu-nKW0w7ke-CVmteucx4n-0vg';
export const supabase = createClient(supabaseUrl, supabaseKey);
