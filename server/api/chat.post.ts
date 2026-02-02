// server/api/chat.post.ts
/*
import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { OpenAI } from 'openai'
import { createClient } from '@supabase/supabase-js'
*/

export default defineEventHandler(async (event) => {
  console.log('[DEBUG] Chat API called - NO IMPORTS MODE')

  return {
    ok: true,
    debug: 'If you see this, Imports are the culprit.'
  }
})
