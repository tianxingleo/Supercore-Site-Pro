import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdmin() {
    console.log('🔍 Checking admin users...\n')

    try {
        // 1. List all users
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

        if (usersError) {
            console.error('❌ Error listing users:', usersError)
            return
        }

        console.log(`Found ${users.length} users:\n`)

        for (const user of users) {
            console.log(`📧 Email: ${user.email}`)
            console.log(`   ID: ${user.id}`)

            // Check profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.log(`   ⚠️  Profile Error: ${profileError.message}`)
                console.log(`   Creating admin profile...`)

                // Try to create profile
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    })

                if (insertError) {
                    console.log(`   ❌ Failed to create profile: ${insertError.message}`)
                } else {
                    console.log(`   ✅ Admin profile created!`)
                }
            } else {
                console.log(`   Role: ${profile.role || '(not set)'}`)

                // Update to admin if not already
                if (profile.role !== 'admin') {
                    console.log(`   Updating to admin...`)
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ role: 'admin' })
                        .eq('id', user.id)

                    if (updateError) {
                        console.log(`   ❌ Update failed: ${updateError.message}`)
                    } else {
                        console.log(`   ✅ Updated to admin!`)
                    }
                }
            }
            console.log()
        }

        // 2. Show all profiles
        console.log('\n📊 All profiles in database:')
        const { data: allProfiles, error: allError } = await supabase
            .from('profiles')
            .select('*')

        if (allError) {
            console.error('❌ Error fetching profiles:', allError)
        } else {
            console.table(allProfiles)
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }
}

checkAdmin()
