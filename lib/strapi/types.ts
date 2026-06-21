export type StrapiDocument<T> = T & {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export type StrapiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type StrapiCollectionResponse<T> = {
  data: Array<StrapiDocument<T>>
  meta: {
    pagination: StrapiPagination
  }
}

export type StrapiSingleResponse<T> = {
  data: StrapiDocument<T> | null
  meta: Record<string, unknown>
}
