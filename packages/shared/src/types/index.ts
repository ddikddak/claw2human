import { z } from 'zod';

// ============================================================================
// Field Types
// ============================================================================

export const FieldTypeSchema = z.enum([
  'text',
  'textarea', 
  'markdown',
  'select',
  'multiselect',
  'checkbox',
  'date',
  'file',
  'array'
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FieldSchema = z.object({
  id: z.string(),
  type: FieldTypeSchema,
  label: z.string(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(), // For select/multiselect
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional()
  }).optional()
});

export type Field = z.infer<typeof FieldSchema>;

// ============================================================================
// Action Types
// ============================================================================

export const ActionTypeSchema = z.enum([
  'approve',
  'reject', 
  'request_changes',
  'comment',
  'edit',
  'view'
]);

export type ActionType = z.infer<typeof ActionTypeSchema>;

export const ActionSchema = z.object({
  id: z.string(),
  type: ActionTypeSchema,
  label: z.string(),
  description: z.string().optional(),
  requiresComment: z.boolean().default(false),
  allowEdit: z.boolean().default(false),
  color: z.enum(['green', 'red', 'yellow', 'blue', 'gray']).default('blue'),
  webhookEnabled: z.boolean().default(true)
});

export type Action = z.infer<typeof ActionSchema>;

// ============================================================================
// Template
// ============================================================================

export const TemplateStatusSchema = z.enum(['draft', 'active', 'archived']);
export type TemplateStatus = z.infer<typeof TemplateStatusSchema>;

export const TemplateSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  folderId: z.string().nullable(),
  name: z.string(),
  description: z.string().optional(),
  fieldSchema: z.array(FieldSchema),
  actionSchema: z.array(ActionSchema),
  status: TemplateStatusSchema,
  version: z.number().default(1),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Template = z.infer<typeof TemplateSchema>;

// Create/Update schemas
export const CreateTemplateSchema = TemplateSchema.omit({
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateTemplateSchema = CreateTemplateSchema.partial();

// ============================================================================
// Object (Instance)
// ============================================================================

export const ObjectStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'changes_requested',
  'in_progress'
]);

export type ObjectStatus = z.infer<typeof ObjectStatusSchema>;

export const ObjectSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  workspaceId: z.string(),
  folderId: z.string().nullable(),
  status: ObjectStatusSchema,
  version: z.number().default(1),
  data: z.record(z.any()), // Field values
  metadata: z.record(z.any()).default({}),
  createdBy: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type C2HObject = z.infer<typeof ObjectSchema>;

export const CreateObjectSchema = ObjectSchema.omit({
  id: true,
  status: true,
  version: true,
  createdAt: true,
  updatedAt: true
});

// ============================================================================
// Actions & Comments
// ============================================================================

export const ObjectActionSchema = z.object({
  id: z.string(),
  objectId: z.string(),
  actionType: ActionTypeSchema,
  actionData: z.record(z.any()).optional(),
  comment: z.string().optional(),
  performedBy: z.string(),
  performedAt: z.string().datetime(),
  webhookStatus: z.enum(['pending', 'delivered', 'failed']).default('pending')
});

export type ObjectAction = z.infer<typeof ObjectActionSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  objectId: z.string(),
  userId: z.string(),
  content: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Comment = z.infer<typeof CommentSchema>;

// ============================================================================
// Webhook
// ============================================================================

export const WebhookEventSchema = z.enum([
  'object.created',
  'object.approved',
  'object.rejected',
  'object.changes_requested',
  'object.edited',
  'object.commented',
  'template.approved'
]);

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

export const WebhookSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  url: z.string().url(),
  events: z.array(WebhookEventSchema),
  secret: z.string(),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Webhook = z.infer<typeof WebhookSchema>;

export const WebhookPayloadSchema = z.object({
  event: WebhookEventSchema,
  timestamp: z.string().datetime(),
  workspaceId: z.string(),
  data: z.record(z.any())
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

// ============================================================================
// API Response Types
// ============================================================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.any()).optional()
    }).optional(),
    meta: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional()
    }).optional()
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};
