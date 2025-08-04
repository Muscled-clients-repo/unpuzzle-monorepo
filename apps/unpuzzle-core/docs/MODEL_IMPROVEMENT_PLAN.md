# Model Architecture Improvement Plan

## Executive Summary

The current model architecture in Unpuzzle-mcp is functional but suffers from significant code duplication and lacks modern TypeScript patterns. This plan outlines a phased approach to modernize the data layer while maintaining backward compatibility.

## Current Issues

### 1. **Code Duplication** (Critical)
- **19 model files** with nearly identical CRUD implementations
- **~80% duplicated code** across all models
- Maintenance nightmare: changes must be made in 19 places

### 2. **Poor Error Handling**
- Redundant try-catch blocks that add no value
- No custom error types or error codes
- Generic error messages without context

### 3. **Type Safety Issues**
- Implicit return types
- No generic patterns
- Validation not integrated with TypeScript

### 4. **Anti-patterns**
- Console.log statements in production
- Magic numbers in validation
- Inconsistent naming conventions

## Improvement Plan

### Phase 1: Foundation (Week 1)

#### 1.1 Create Base Model Class
```typescript
// models/base/BaseModel.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseValidator } from '../validator/BaseValidator';
import { DatabaseError, ValidationError } from '../../utils/errors';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export abstract class BaseModel<T, CreateDTO, UpdateDTO> {
  protected abstract tableName: string;
  protected abstract validator: BaseValidator;
  protected supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, orderBy = 'created_at', order = 'desc' } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    // Get paginated data
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order(orderBy, { ascending: order === 'asc' })
      .range(from, to);

    if (error) throw new DatabaseError('FETCH_ERROR', error.message);

    return {
      data: data as T[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError('FETCH_ERROR', error.message);
    }

    return data as T;
  }

  async create(dto: CreateDTO): Promise<T> {
    // Validate
    const validation = this.validator.validate(dto, 0);
    if (!validation.isValid) {
      throw new ValidationError(validation.error || 'Validation failed');
    }

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(validation.data)
      .select()
      .single();

    if (error) throw new DatabaseError('CREATE_ERROR', error.message);
    return data as T;
  }

  async update(id: string, dto: UpdateDTO): Promise<T> {
    // Validate with partial schema
    const validation = this.validator.validate(dto, 1);
    if (!validation.isValid) {
      throw new ValidationError(validation.error || 'Validation failed');
    }

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(validation.data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new DatabaseError('UPDATE_ERROR', error.message);
    return data as T;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new DatabaseError('DELETE_ERROR', error.message);
    return true;
  }

  // Protected methods for extension
  protected async findOne(query: Record<string, any>): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .match(query)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new DatabaseError('FETCH_ERROR', error.message);
    }

    return data as T;
  }

  protected async findMany(query: Record<string, any>): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .match(query);

    if (error) throw new DatabaseError('FETCH_ERROR', error.message);
    return data as T[];
  }
}
```

#### 1.2 Create Custom Error Types
```typescript
// utils/errors/database.errors.ts
export class DatabaseError extends AppError {
  constructor(code: string, message: string) {
    super(`Database Error: ${message}`, 500, code);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
  }
}

export class DuplicateError extends AppError {
  constructor(resource: string, field: string) {
    super(`${resource} with this ${field} already exists`, 409, 'DUPLICATE');
  }
}
```

### Phase 2: Migration (Week 2)

#### 2.1 Migrate Models One by One
Start with a simple model as proof of concept:

```typescript
// models/supabase/user.model.ts
import { BaseModel } from '../base/BaseModel';
import UserValidator from '../validator/user.validator';
import supabase from './client';
import { User, CreateUserDTO, UpdateUserDTO } from '../../types/user.type';

class UserModel extends BaseModel<User, CreateUserDTO, UpdateUserDTO> {
  protected tableName = 'users';
  protected validator = UserValidator;

  constructor() {
    super(supabase);
  }

  // Model-specific methods
  async getUserByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return this.findMany({ role });
  }
}

export default new UserModel();
```

#### 2.2 Migration Strategy
1. Create new base model alongside existing models
2. Migrate one model at a time
3. Update controllers to handle new error types
4. Test thoroughly before moving to next model
5. Remove old model code once migrated

### Phase 3: Enhanced Features (Week 3)

#### 3.1 Add Transaction Support
```typescript
// models/base/BaseModel.ts
async transaction<R>(
  callback: (client: SupabaseClient) => Promise<R>
): Promise<R> {
  // Implement transaction logic
}
```

#### 3.2 Add Caching Layer
```typescript
// models/base/CachedModel.ts
export abstract class CachedModel<T, CreateDTO, UpdateDTO> 
  extends BaseModel<T, CreateDTO, UpdateDTO> {
  
  protected abstract cacheKey: string;
  protected cacheTTL: number = 300; // 5 minutes
  
  async getById(id: string): Promise<T | null> {
    const cached = await cache.get(`${this.cacheKey}:${id}`);
    if (cached) return cached;
    
    const data = await super.getById(id);
    if (data) await cache.set(`${this.cacheKey}:${id}`, data, this.cacheTTL);
    
    return data;
  }
}
```

#### 3.3 Add Query Builder Pattern
```typescript
// models/base/QueryBuilder.ts
export class QueryBuilder<T> {
  private query: any;
  
  where(field: string, value: any): QueryBuilder<T> {
    // Implementation
  }
  
  whereIn(field: string, values: any[]): QueryBuilder<T> {
    // Implementation
  }
  
  orderBy(field: string, direction: 'asc' | 'desc'): QueryBuilder<T> {
    // Implementation
  }
  
  async execute(): Promise<T[]> {
    // Implementation
  }
}
```

### Phase 4: TypeScript Integration (Week 4)

#### 4.1 Replace Joi with Zod
```typescript
// schemas/user.schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  role: z.enum(['admin', 'user', 'instructor']),
  created_at: z.date(),
  updated_at: z.date()
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserDTO = z.infer<typeof UserSchema.omit({ id: true, created_at: true, updated_at: true })>;
export type UpdateUserDTO = Partial<CreateUserDTO>;
```

#### 4.2 Type-safe Queries
```typescript
// models/base/TypedModel.ts
export abstract class TypedModel<T, CreateDTO, UpdateDTO> {
  abstract schema: z.ZodSchema<T>;
  
  async create(dto: CreateDTO): Promise<T> {
    const validated = this.schema.parse(dto);
    // Continue with validated data
  }
}
```

## Implementation Priority

1. **High Priority** (Do First)
   - Create BaseModel class
   - Implement custom error types
   - Remove console.log statements
   - Fix "Deleetd" typo

2. **Medium Priority** (Do Next)
   - Migrate high-traffic models (User, Video, Course)
   - Add transaction support
   - Implement caching for read-heavy models

3. **Low Priority** (Nice to Have)
   - Full Zod migration
   - Query builder pattern
   - Model factories for testing

## Success Metrics

- **Code Reduction**: Target 60% less code overall
- **Type Coverage**: 100% explicit return types
- **Error Handling**: 0 redundant try-catch blocks
- **Performance**: 30% faster queries with caching
- **Maintainability**: Single source of truth for CRUD operations

## Migration Checklist

- [ ] Create base model class
- [ ] Add custom error types
- [ ] Update logger integration
- [ ] Create migration guide
- [ ] Migrate User model (pilot)
- [ ] Update User controller
- [ ] Test User endpoints
- [ ] Document lessons learned
- [ ] Migrate remaining models
- [ ] Remove old code
- [ ] Update all controllers
- [ ] Performance testing
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Deploy to production

## Risks and Mitigation

1. **Risk**: Breaking existing functionality
   - **Mitigation**: Gradual migration, extensive testing

2. **Risk**: Performance regression
   - **Mitigation**: Benchmark before/after, add caching

3. **Risk**: Team learning curve
   - **Mitigation**: Documentation, code examples, pair programming

## Conclusion

This improvement plan will transform the data layer from a maintenance burden into a robust, type-safe, and efficient system. The phased approach ensures minimal disruption while delivering immediate benefits in code quality and developer experience.