'use client';

/**
 * Collection Edit Form Component
 * 
 * Dynamic form for creating/editing documents in a collection.
 * Similar to Payload CMS edit view.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  MoreHorizontal,
  Eye,
  Trash2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionMeta } from '@/lib/collections-data';

interface CollectionEditProps {
  collection: CollectionMeta;
  documentId?: string;
  initialData?: Record<string, unknown>;
}

type FieldValue = string | number | boolean | unknown[] | Record<string, unknown> | null;

export function CollectionEdit({ collection, documentId, initialData }: CollectionEditProps) {
  const [formData, setFormData] = useState<Record<string, FieldValue>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showAutosave, setShowAutosave] = useState(false);

  // Initialize form with default values or existing data
  useEffect(() => {
    const defaults: Record<string, FieldValue> = {};
    
    for (const field of collection.fields) {
      if (initialData && field.name in initialData) {
        defaults[field.name] = initialData[field.name] as FieldValue;
      } else if ('defaultValue' in field) {
        defaults[field.name] = (field as { defaultValue?: FieldValue }).defaultValue ?? null;
      } else {
        defaults[field.name] = null;
      }
    }
    
    setFormData(defaults);
  }, [collection.fields, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real implementation, this would call the API
      console.log('Saving document:', formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setShowAutosave(true);
      setTimeout(() => setShowAutosave(false), 3000);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (fieldName: string, value: FieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderField = (field: CollectionMeta['fields'][0]) => {
    const value = formData[field.name] ?? null;
    const isRequired = field.required;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={isRequired}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={isRequired}
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            value={(value as number) || ''}
            onChange={(e) => updateField(field.name, e.target.valueAsNumber)}
            required={isRequired}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={isRequired}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={(value as boolean) || false}
              onChange={(e) => updateField(field.name, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor={field.name} className="text-sm text-muted-foreground">
              Yes
            </label>
          </div>
        );

      case 'select': {
        // For select fields, we'd have options defined
        return (
          <select
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={isRequired}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select an option</option>
            {/* Options would be dynamically loaded from field config */}
          </select>
        );
      }

      case 'json':
        return (
          <textarea
            id={field.name}
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : (value as string) || ''}
            onChange={(e) => {
              try {
                updateField(field.name, JSON.parse(e.target.value));
              } catch {
                updateField(field.name, e.target.value);
              }
            }}
            rows={6}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={isRequired}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'group':
      case 'array':
        return (
          <div className="p-4 border-2 border-dashed rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              {field.type === 'group' ? 'Group field' : 'Array field'} - Complex nested structure
            </p>
            <pre className="mt-2 text-xs text-muted-foreground">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.name}
            value={String(value || '')}
            onChange={(e) => updateField(field.name, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        );
    }
  };

  const getFieldLabel = (field: CollectionMeta['fields'][0]) => {
    return field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/${collection.slug}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {documentId ? 'Edit' : 'Create'} {collection.labels.singular}
            </h1>
            <p className="text-muted-foreground mt-1">
              {documentId 
                ? `Editing ${collection.labels.singular.toLowerCase()}`
                : `Creating a new ${collection.labels.singular.toLowerCase()}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showAutosave && (
            <span className="text-sm text-green-600 mr-2">Saved</span>
          )}
          <Button type="button" variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Fields */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {collection.fields
            .filter((f) => f.type !== 'group')
            .map((field) => (
              <div key={field.name} className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {getFieldLabel(field)}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-semibold">Status</h3>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-semibold">Actions</h3>
            <div className="space-y-2">
              <Button type="button" variant="outline" size="sm" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              {documentId && (
                <Button type="button" variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
