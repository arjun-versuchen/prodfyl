type LogLevel = 'info' | 'warn' | 'error'

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const blocked = ['token', 'secret', 'signature', 'password', 'authorization']
  const output: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (blocked.some((part) => key.toLowerCase().includes(part))) continue
    output[key] = value
  }
  return output
}

export function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitize(meta),
  }

  if (level === 'error') {
    console.error(JSON.stringify(payload))
    return
  }
  if (level === 'warn') {
    console.warn(JSON.stringify(payload))
    return
  }
  console.log(JSON.stringify(payload))
}
