import { apiRequest } from '../lib/api'

export type MessageType = 'info' | 'success' | 'warning' | 'urgent'

export type Message = {
  id: number
  title: string
  body: string
  type: MessageType
  published_at: string | null
  expires_at: string | null
  created_by: string | null
  is_read: boolean
  read_at: string | null
}

type MessageResponse = {
  data: Message
}

type MessagesResponse = {
  data: Message[]
}

export async function getMessages(): Promise<Message[]> {
  const response = await apiRequest<MessagesResponse>('/messages')
  return response.data
}

export async function getMessage(id: number): Promise<Message> {
  const response = await apiRequest<MessageResponse>(`/messages/${id}`)
  return response.data
}

export async function markMessageRead(id: number): Promise<void> {
  await apiRequest(`/messages/${id}/read`, {
    method: 'PATCH',
  })
}

export async function markMessageUnread(id: number): Promise<void> {
  await apiRequest(`/messages/${id}/unread`, {
    method: 'PATCH',
  })
}
