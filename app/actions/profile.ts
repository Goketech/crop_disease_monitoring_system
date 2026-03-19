'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setSmsNotifications(enabled: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ sms_notifications_enabled: enabled })
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  revalidatePath('/settings/notifications')
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const fullName = formData.get('fullName') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const smsEnabled = formData.get('smsEnabled') === 'true'

  const updateData: any = {}
  if (fullName) updateData.full_name = fullName
  if (avatarUrl) updateData.avatar_url = avatarUrl
  if (phoneNumber !== null) updateData.phone_number = phoneNumber
  if (formData.has('smsEnabled')) updateData.sms_notifications_enabled = smsEnabled

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function uploadAvatar(file: File) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}-${Math.random()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (error) {
    throw new Error(error.message)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return publicUrl
}
