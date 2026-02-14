import { ModelSchema } from './model'
import { EnumSchema } from './enum'

export type CanonicalSchema = {
  models: Record<string, ModelSchema>
  enums?: Record<string, EnumSchema>
  version?: number
}
