# Code Change Tracking Log

This file tracks every code modification made during development sessions with unique IDs for easy rollback.

## Session: 2025-01-25

### Change ID: CHG-001
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Schema Update  
**Files Modified**: 
- `types/puzzleReflect.type.ts`
**Description**: Added `timestamp` field to PuzzleReflect interface
**Changes**:
- Added `timestamp?: number | null` field to store video time in seconds
**Rollback Command**: 
```bash
git checkout HEAD~N -- types/puzzleReflect.type.ts
# Or remove the timestamp line from the interface
```

### Change ID: CHG-002
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Validation Update  
**Files Modified**: 
- `models/validator/puzzleReflect.validator.ts`
**Description**: Added validation for timestamp field
**Changes**:
- Added `timestamp: Joi.number().min(0).allow(null).optional()` to schema
**Rollback Command**: 
```bash
# Remove the timestamp validation line from the Joi schema
```

### Change ID: CHG-003
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Controller Update  
**Files Modified**: 
- `protocols/controllers/api/puzzleReflects.controller.ts`
**Description**: Updated all puzzle reflect creation methods to handle timestamp
**Changes**:
- Modified `createAudioReflect`, `createFileReflect`, `createLoomLinkReflect`
- Added timestamp extraction from request body
- Added timestamp to model creation calls
**Rollback Command**: 
```bash
# Remove timestamp destructuring and timestamp field from createPuzzleReflect calls
```

### Change ID: CHG-004
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Schema Update  
**Files Modified**: 
- `types/puzzleHint.type.ts`
**Description**: Added status enum field to PuzzleHint interface
**Changes**:
- Added `export type PuzzleHintStatus = "still confused" | "got it"`
- Added `status?: PuzzleHintStatus | null` to interface
**Rollback Command**: 
```bash
# Remove the PuzzleHintStatus type and status field from interface
```

### Change ID: CHG-005
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Validation Update  
**Files Modified**: 
- `models/validator/puzzleHint.validator.ts`
**Description**: Added validation for status enum field
**Changes**:
- Added `status: Joi.string().valid('still confused', 'got it').allow(null).optional()`
**Rollback Command**: 
```bash
# Remove the status validation line from the Joi schema
```

### Change ID: CHG-006
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Controller Update  
**Files Modified**: 
- `protocols/controllers/api/puzzleHints.controller.ts`
**Description**: Added status handling and new manual creation endpoint
**Changes**:
- Added status handling in existing `getPuzzleHint` method
- Added new `createPuzzleHint` method for manual creation with status
**Rollback Command**: 
```bash
# Remove status handling lines and the entire createPuzzleHint method
```

### Change ID: CHG-007
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Route Update  
**Files Modified**: 
- `protocols/routes/api/puzzleHint.routes.ts`
**Description**: Added new route for manual puzzle hint creation
**Changes**:
- Added `router.post("/create", puzzleHintsController.createPuzzleHint)`
**Rollback Command**: 
```bash
# Remove the /create route line
```

### Change ID: CHG-008
**Timestamp**: 2025-01-25 Initial Session  
**Type**: Documentation  
**Files Modified**: 
- `models/schema/add_timestamp_and_status_fields.sql`
**Description**: Created SQL migration file for schema documentation
**Changes**:
- Added SQL commands for adding timestamp and status fields
**Rollback Command**: 
```bash
rm models/schema/add_timestamp_and_status_fields.sql
```

### Change ID: CHG-009
**Timestamp**: 2025-01-25 Course Pagination Session  
**Type**: Model Update  
**Files Modified**: 
- `models/supabase/course.model.ts`
**Description**: Updated getAllCourses to return pagination format with chapter count
**Changes**:
- Modified query to include `chapters(count)`
- Added data transformation to include `chapter_count`
- Changed return format to `{ data, count, total_page }`
**Rollback Command**: 
```bash
# Revert to previous getAllCourses implementation:
# - Remove chapters(count) from select
# - Remove data transformation
# - Return just data instead of pagination object
```

### Change ID: CHG-010
**Timestamp**: 2025-01-25 Course Pagination Session  
**Type**: Controller Update  
**Files Modified**: 
- `protocols/controllers/api/course.controller.ts`
**Description**: Updated getAllCourse controller to handle pagination response
**Changes**:
- Added explicit pagination structure in response
- Added integer parsing for page/limit parameters
**Rollback Command**: 
```bash
# Revert to: return this.sendSuccess(res, result);
# Remove the explicit pagination structure
```

### Change ID: CHG-011
**Timestamp**: 2025-01-25 Chapter Pagination Session  
**Type**: Model Update  
**Files Modified**: 
- `models/supabase/chapter.model.ts`
**Description**: Updated getAllChapters to return pagination format
**Changes**:
- Added `count` capture from Supabase query
- Changed return format to `{ data, count, total_page }`
**Rollback Command**: 
```bash
# Revert to: return data;
# Remove count capture and pagination object
```

### Change ID: CHG-012
**Timestamp**: 2025-01-25 Chapter Pagination Session  
**Type**: Controller Update  
**Files Modified**: 
- `protocols/controllers/api/chapter.controller.ts`
**Description**: Updated getAllChapters controller to support both paginated and filtered results
**Changes**:
- Added support for both `course_id` filtering and pagination
- Both scenarios return consistent pagination format
- Added integer parsing for parameters
**Rollback Command**: 
```bash
# Revert to simple getChaptersByCourse call:
# const result = await this.model.getChaptersByCourse(course_id);
# return this.sendSuccess(res, result);
```

---

## How to Use This Change Log

1. **Find the Change ID** you want to revert to
2. **Use the Rollback Command** provided for that change
3. **Or ask me to revert**: "Revert to CHG-009" and I'll undo all changes after that point

## Quick Rollback Commands

### Revert All Puzzle Field Changes (CHG-001 to CHG-008)
```bash
git checkout HEAD~N -- types/puzzleReflect.type.ts types/puzzleHint.type.ts
git checkout HEAD~N -- models/validator/puzzleReflect.validator.ts models/validator/puzzleHint.validator.ts
git checkout HEAD~N -- protocols/controllers/api/puzzleReflects.controller.ts protocols/controllers/api/puzzleHints.controller.ts
git checkout HEAD~N -- protocols/routes/api/puzzleHint.routes.ts
rm models/schema/add_timestamp_and_status_fields.sql
```

### Revert All Pagination Changes (CHG-009 to CHG-012)
```bash
git checkout HEAD~N -- models/supabase/course.model.ts models/supabase/chapter.model.ts
git checkout HEAD~N -- protocols/controllers/api/course.controller.ts protocols/controllers/api/chapter.controller.ts
```

### Change ID: CHG-013
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Type Definition  
**Files Modified**: 
- `types/check.type.ts` (NEW FILE)
**Description**: Created Check type for new checks table
**Changes**:
- Added Check interface with id, question, choices, answer, puzzlecheck_id fields
- Added proper typing for the one-to-many relationship
**Rollback Command**: 
```bash
rm types/check.type.ts
```

### Change ID: CHG-014
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Type Definition  
**Files Modified**: 
- `types/puzzleCheck.type.ts`
**Description**: Updated PuzzleCheck type to match new database schema
**Changes**:
- Removed old fields: choices, answer, question
- Added new fields: total_checks, correct_checks_count
- Added relationship fields: checks array, user object
- Updated imports to include Check type
**Rollback Command**: 
```bash
# Revert to old schema with choices, answer, question fields
# Remove total_checks, correct_checks_count, checks, user fields
```

### Change ID: CHG-015
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Validation  
**Files Modified**: 
- `models/validator/check.validator.ts` (NEW FILE)
**Description**: Created validator for Check model
**Changes**:
- Added Joi validation schema for Check type
- Validates question, choices, answer, puzzlecheck_id fields
**Rollback Command**: 
```bash
rm models/validator/check.validator.ts
```

### Change ID: CHG-016
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Validation  
**Files Modified**: 
- `models/validator/puzzleCheck.validator.ts`
**Description**: Updated PuzzleCheck validator to match new schema
**Changes**:
- Removed old validation: choices, answer, question
- Added new validation: total_checks, correct_checks_count
- Added relationship validation for checks array
**Rollback Command**: 
```bash
# Revert to old validation schema
```

### Change ID: CHG-017
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Model Creation  
**Files Modified**: 
- `models/supabase/check.model.ts` (NEW FILE)
**Description**: Created Check model for checks table CRUD operations
**Changes**:
- Added full CRUD operations for checks table
- Added relationship queries (getChecksByPuzzleCheckId)
- Added bulk operations (createMultipleChecks, deleteChecksByPuzzleCheckId)
**Rollback Command**: 
```bash
rm models/supabase/check.model.ts
```

### Change ID: CHG-018
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Model Update  
**Files Modified**: 
- `models/supabase/puzzleCheck.model.ts`
**Description**: Updated PuzzleCheck model with new schema and relationships
**Changes**:
- Added includeChecks parameter to getPuzzleCheckById
- Added createPuzzleCheckWithChecks method
- Added submitAnswers method for answer comparison
- Added updatePuzzleCheckWithChecks method for replacing checks
- Updated queries to work with new schema
**Rollback Command**: 
```bash
# Revert to original model methods
# Remove new relationship methods
```

### Change ID: CHG-019
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Controller Update  
**Files Modified**: 
- `protocols/controllers/api/puzzleChecks.controller.ts`
**Description**: Added new controller methods for CRUD operations
**Changes**:
- Added CheckModel import
- Added createPuzzleCheck method (POST /)
- Added submitAnswers method (PATCH /:id/submit)
- Added getPuzzleCheckById method (GET /:id) with user enrichment
- Added updatePuzzleCheck method (PUT /:id) with checks replacement
- Added proper validation and error handling
**Rollback Command**: 
```bash
# Remove CheckModel import
# Remove new controller methods: createPuzzleCheck, submitAnswers, getPuzzleCheckById, updatePuzzleCheck
```

### Change ID: CHG-020
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Route Update  
**Files Modified**: 
- `protocols/routes/api/puzzleChecks.routes.ts`
**Description**: Added new CRUD routes for puzzle checks
**Changes**:
- Added POST / route for creating puzzle checks
- Added GET /:id route for getting puzzle check by ID
- Added PUT /:id route for updating puzzle checks
- Added PATCH /:id/submit route for submitting answers
**Rollback Command**: 
```bash
# Remove the new route definitions, keep only existing routes
```

---

## Quick Rollback Commands

### Revert Entire PuzzleChecks Schema Refactor (CHG-013 to CHG-020)
```bash
# Remove new files
rm types/check.type.ts
rm models/validator/check.validator.ts
rm models/supabase/check.model.ts

# Revert modified files
git checkout HEAD~N -- types/puzzleCheck.type.ts
git checkout HEAD~N -- models/validator/puzzleCheck.validator.ts
git checkout HEAD~N -- models/supabase/puzzleCheck.model.ts
git checkout HEAD~N -- protocols/controllers/api/puzzleChecks.controller.ts
git checkout HEAD~N -- protocols/routes/api/puzzleChecks.routes.ts
```

### Change ID: CHG-021
**Timestamp**: 2025-01-25 PuzzleChecks Schema Refactor Session  
**Type**: Bug Fix  
**Files Modified**: 
- `protocols/controllers/api/puzzleChecks.controller.ts`
**Description**: Fixed TypeScript errors in puzzle checks controller
**Changes**:
- Fixed ResponseHandler.success parameter order (data, statusCode vs data, message, statusCode)
- Added type assertion for puzzleCheck.user assignment
- Added type annotation for puzzleCheckData object
**Rollback Command**: 
```bash
# Revert the parameter fixes if needed
```