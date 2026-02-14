type FieldSchema =
  | ScalarField
  | RelationField
  | EnumField

type ScalarField = {
  kind: 'scalar'
  type: 'string' | 'int' | 'boolean' | 'date' | 'json'
  required?: boolean
  unique?: boolean
  default?: any
}

type RelationField = {
  kind: 'relation'
  target: string
  relation: 'one' | 'many'
  required?: boolean
}

type EnumField = {
  kind: 'enum'
  values: string[]
  default?: string
}

export type IndexSchema = {
  name?: string
  fields: string[]
  unique?: boolean
  type?: 'btree' | 'hash' | 'gin' | 'gist'
}


type ModelSchema = {
  name: string
  tableName?: string
  auth?: AuthSchema
  fields: Record<string, FieldSchema>
  indexes?: IndexSchema[]
}
