const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

export type Report = {
  id: string
  telegram_id: number
  filename: string
  doc_type: string
  overall_risk: 'low' | 'medium' | 'high' | 'critical'
  verdict: 'low_risk' | 'review_recommended' | 'high_risk_seek_advice'
  flags_json: ClauseFlag[]
  page_count: number
  word_count: number
  created_at: string
}

export type ClauseFlag = {
  clause_type: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  page_reference: string
  plain_summary: string
  negotiation_move: string
  original_language: string
}

export type User = {
  telegram_id: number
  username: string
  free_scans_used: number
  subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
  subscription_expires_at: string | null
  total_scans: number
}

export async function getUserReports(telegramId: number): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('telegram_id', telegramId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function getReport(id: string): Promise<Report | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getUser(telegramId: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single()

  if (error) return null
  return data
}
