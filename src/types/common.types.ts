// JSON:API request documents
export type JsonApiCreateDocument<TType extends string, TAttrs> = {
    data: {
        type: TType
        attributes: TAttrs
    }
}

export type JsonApiUpdateDocument<TType extends string, TAttrs> = {
    data: {
        type: TType
        id: string
        attributes: TAttrs
    }
}