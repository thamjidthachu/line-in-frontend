import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/placeholder.svg'
  
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a relative path starting with /, return as-is
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }
  
  // Otherwise, it's a relative path - prepend the backend base URL
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'
  return `${backendBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}
