type JsonApiError = { title?: string; detail?: string }
type NormalizedApiError = { status?: number; errors?: JsonApiError[] }

export function toMessage(e: unknown): string {
    if (typeof e === 'object' && e !== null) {
        const err = e as NormalizedApiError
        const first = err.errors?.[0]
        if (first?.detail) return first.detail
        if (first?.title) return first.title
        if (err.status) return `Request failed (HTTP ${err.status}).`
    }
    return e instanceof Error ? e.message : String(e)
}