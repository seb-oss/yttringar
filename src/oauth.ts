import { settings } from './config'
import { param } from './deparam'

export const token = { value: null as null | string }

// tslint:disable-next-line:variable-name
export function getLoginUrl(redirect_uri: string) {
  return `${settings.YTTRINGAR_API}authorize?${param({ redirect_uri })}`
}

export async function loadToken(): Promise<string | null> {
  if (token.value) {
    return token.value
  }
  const url = `${settings.YTTRINGAR_API}token`
  const response = await fetch(url, { mode: 'cors', credentials: 'include' })
  if (response.ok) {
    const t = await response.json()
    token.value = t
    return t
  }
  return null
}
