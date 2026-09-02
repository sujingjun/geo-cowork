export const LOCAL_EXTENSION_API_BASE = 'http://localhost:3000'

declare const __CREATOR_WORKBENCH_LOCAL_TEST__: boolean

function isLocalTestBuild(): boolean {
  return typeof __CREATOR_WORKBENCH_LOCAL_TEST__ !== 'undefined'
    && __CREATOR_WORKBENCH_LOCAL_TEST__
}

export function resolveExtensionApiBase(
  storedValue: unknown,
  useLocalDefault = isLocalTestBuild()
): string {
  if (typeof storedValue === 'string') {
    const normalizedValue = storedValue.trim().replace(/\/+$/, '')
    if (normalizedValue) return normalizedValue
  }
  return useLocalDefault ? LOCAL_EXTENSION_API_BASE : ''
}
