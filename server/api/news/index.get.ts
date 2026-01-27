import { serverSupabaseClient } from '#supabase/server'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return data as Post[]
})
