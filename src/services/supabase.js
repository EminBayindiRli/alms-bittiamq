import { createClient } from '@supabase/supabase-js';

// Supabase ayarları
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oyzqnkdivklvbolyoziz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95enFua2RpdmtsdmJvbHlveml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODkxMjAsImV4cCI6MjA1NTY2NTEyMH0.R4AayXQ7ubfOqBW2ZW23w_J_Kt9qz2saLSNgreu-Kis';

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 