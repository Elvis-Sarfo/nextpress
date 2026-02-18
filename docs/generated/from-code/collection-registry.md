# collection-registry

*Generated from `src/core/collection/registry.ts`. Run `pnpm docs:generate` to update.*

Collection Registry
Manages all collections in the system and provides utilities
for working with collections.

## Exports

### Collections

Global collection registry instance

### walkFields

Walk through all fields in a collection

### findField

Find a field by name in a collection

### getFieldNames

Get all field names in a collection

### getLocalizedFields

Get localized fields in a collection

### getRequiredFields

Get required fields in a collection

### getUniqueFields

Get unique fields in a collection

### hasAuth

Check if a collection has authentication enabled

### hasVersions

Check if a collection has versioning enabled

### hasLocalization

Check if a collection has localization enabled

### getDefaultLocale

Get the default locale for a collection

### getLocales

Get available locales for a collection

### sanitizeCollection

Sanitize a collection config (convert to runtime representation)

### registerCollection

Decorator to register a collection