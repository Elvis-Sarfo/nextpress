import {
  Result, Ok, Err, DomainError, ValidationError, Locale
} from '../core/types';
import type {
  ContentTypeSchema, FieldDefinition, FieldType
} from './types';

/**
 * Validates content data against a schema.
 */
export class SchemaValidator {
  /**
   * Validate a single field value.
   */
  validateField(
    value: unknown,
    field: FieldDefinition,
    locale?: Locale
  ): Result<void> {
    const errors: ValidationError[] = [];
    const fieldPath = locale ? `locales.${locale}.${field.name}` : field.name;

    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: fieldPath,
        message: `${field.displayName || field.name} is required`,
        code: 'REQUIRED',
      });
      return Err(DomainError.validationFailed('Validation failed', errors));
    }

    // Skip further validation if empty and not required
    if (value === undefined || value === null) {
      return Ok(undefined);
    }

    // Type-specific validation
    const typeError = this.validateFieldType(value, field.type, fieldPath);
    if (typeError) {
      errors.push(typeError);
    }

    // Custom validation rules
    for (const rule of field.validation) {
      const ruleError = this.validateRule(value, rule, fieldPath);
      if (ruleError) {
        errors.push(ruleError);
      }
    }

    if (errors.length > 0) {
      return Err(DomainError.validationFailed('Validation failed', errors));
    }

    return Ok(undefined);
  }

  /**
   * Validate content data against full schema.
   */
  validateContent(
    data: Record<string, unknown>,
    schema: ContentTypeSchema,
    locale: Locale
  ): Result<void> {
    const errors: ValidationError[] = [];

    for (const field of schema.fields) {
      let value: unknown;

      if (field.localizable) {
        // Get from locales
        const locales = data.locales as Record<string, Record<string, unknown>> | undefined;
        value = locales?.[locale]?.[field.name];
      } else {
        // Get from root
        value = data[field.name];
      }

      const result = this.validateField(value, field, field.localizable ? locale : undefined);
      if (!result.ok && result.error.details?.errors) {
        errors.push(...(result.error.details.errors as ValidationError[]));
      }
    }

    if (errors.length > 0) {
      return Err(DomainError.validationFailed(`Validation failed with ${errors.length} errors`, errors));
    }

    return Ok(undefined);
  }

  /**
   * Validate for publishing (stricter than draft).
   */
  validateForPublish(
    data: Record<string, unknown>,
    schema: ContentTypeSchema,
    locale: Locale
  ): Result<void> {
    // First run normal validation
    const basicResult = this.validateContent(data, schema, locale);
    if (!basicResult.ok) {
      return basicResult;
    }

    const errors: ValidationError[] = [];

    // Check SEO requirements
    if (schema.seo.metaDescriptionPolicy.required) {
      const locales = data.locales as Record<string, Record<string, unknown>> | undefined;
      const metaDescription = locales?.[locale]?.metaDescription as string | undefined;

      if (!metaDescription || metaDescription.trim() === '') {
        errors.push({
          field: `locales.${locale}.metaDescription`,
          message: 'Meta description is required for publishing',
          code: 'REQUIRED_FOR_PUBLISH',
        });
      } else {
        const { minLength, maxLength } = schema.seo.metaDescriptionPolicy;
        if (metaDescription.length < minLength) {
          errors.push({
            field: `locales.${locale}.metaDescription`,
            message: `Meta description must be at least ${minLength} characters`,
            code: 'MIN_LENGTH',
          });
        }
        if (metaDescription.length > maxLength) {
          errors.push({
            field: `locales.${locale}.metaDescription`,
            message: `Meta description must be at most ${maxLength} characters`,
            code: 'MAX_LENGTH',
          });
        }
      }
    }

    // Check required locales
    if (schema.localization.enabled) {
      for (const requiredLocale of schema.localization.requiredLocales) {
        const result = this.validateContent(data, schema, requiredLocale);
        if (!result.ok && result.error.details?.errors) {
          errors.push(...(result.error.details.errors as ValidationError[]));
        }
      }
    }

    if (errors.length > 0) {
      return Err(DomainError.validationFailed('Content not ready for publishing', errors));
    }

    return Ok(undefined);
  }

  private validateFieldType(
    value: unknown,
    type: FieldType,
    fieldPath: string
  ): ValidationError | null {
    switch (type.kind) {
      case 'text':
        if (typeof value !== 'string') {
          return { field: fieldPath, message: 'Must be a string', code: 'INVALID_TYPE' };
        }
        if (type.maxLength && value.length > type.maxLength) {
          return { field: fieldPath, message: `Must be at most ${type.maxLength} characters`, code: 'MAX_LENGTH' };
        }
        if (type.minLength && value.length < type.minLength) {
          return { field: fieldPath, message: `Must be at least ${type.minLength} characters`, code: 'MIN_LENGTH' };
        }
        if (type.pattern && !new RegExp(type.pattern).test(value)) {
          return { field: fieldPath, message: 'Invalid format', code: 'PATTERN' };
        }
        break;

      case 'richtext':
        if (typeof value !== 'object' || value === null) {
          return { field: fieldPath, message: 'Must be a rich text object', code: 'INVALID_TYPE' };
        }
        break;

      case 'slug':
        if (typeof value !== 'string') {
          return { field: fieldPath, message: 'Must be a string', code: 'INVALID_TYPE' };
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return { field: fieldPath, message: 'Invalid slug format', code: 'INVALID_SLUG' };
        }
        break;

      case 'datetime':
        if (!(value instanceof Date) && typeof value !== 'string') {
          return { field: fieldPath, message: 'Must be a date', code: 'INVALID_TYPE' };
        }
        if (typeof value === 'string' && isNaN(Date.parse(value))) {
          return { field: fieldPath, message: 'Invalid date format', code: 'INVALID_DATE' };
        }
        break;

      case 'reference':
        if (type.cardinality === 'one') {
          if (typeof value !== 'string') {
            return { field: fieldPath, message: 'Must be a reference ID', code: 'INVALID_TYPE' };
          }
        } else {
          if (!Array.isArray(value)) {
            return { field: fieldPath, message: 'Must be an array of reference IDs', code: 'INVALID_TYPE' };
          }
        }
        break;

      case 'media':
        if (typeof value !== 'object' || value === null) {
          return { field: fieldPath, message: 'Must be a media object', code: 'INVALID_TYPE' };
        }
        if (!('url' in value) || typeof (value as { url: unknown }).url !== 'string') {
          return { field: fieldPath, message: 'Media must have a URL', code: 'INVALID_MEDIA' };
        }
        break;

      case 'enum':
        if (typeof value !== 'string' || !type.values.includes(value)) {
          return { field: fieldPath, message: `Must be one of: ${type.values.join(', ')}`, code: 'INVALID_ENUM' };
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          return { field: fieldPath, message: 'Must be a boolean', code: 'INVALID_TYPE' };
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { field: fieldPath, message: 'Must be a number', code: 'INVALID_TYPE' };
        }
        if (type.min !== undefined && value < type.min) {
          return { field: fieldPath, message: `Must be at least ${type.min}`, code: 'MIN_VALUE' };
        }
        if (type.max !== undefined && value > type.max) {
          return { field: fieldPath, message: `Must be at most ${type.max}`, code: 'MAX_VALUE' };
        }
        if (type.integer && !Number.isInteger(value)) {
          return { field: fieldPath, message: 'Must be an integer', code: 'NOT_INTEGER' };
        }
        break;

      case 'json':
        // JSON can be any valid JSON value
        break;
    }

    return null;
  }

  private validateRule(
    value: unknown,
    rule: { type: string; value?: unknown; message: string },
    fieldPath: string
  ): ValidationError | null {
    switch (rule.type) {
      case 'pattern':
        if (typeof value === 'string' && typeof rule.value === 'string') {
          if (!new RegExp(rule.value).test(value)) {
            return { field: fieldPath, message: rule.message, code: 'PATTERN' };
          }
        }
        break;
    }
    return null;
  }
}
