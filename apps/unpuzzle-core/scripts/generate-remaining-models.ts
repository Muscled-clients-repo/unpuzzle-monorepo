/**
 * Script to generate remaining model migrations
 * This creates new versions for all models not yet migrated
 */

import fs from 'fs';
import path from 'path';

interface ModelConfig {
  fileName: string;
  modelName: string;
  tableName: string;
  schemaName: string;
  typeName: string;
  orderField?: string;
  orderAscending?: boolean;
  hasBindMethods?: boolean;
  deleteMessage?: string;
  useSingle?: boolean; // for getById
}

const modelConfigs: ModelConfig[] = [
  {
    fileName: 'agent.model.ts',
    modelName: 'AgentModel',
    tableName: 'agents',
    schemaName: 'AgentSchema',
    typeName: 'Agent'
  },
  {
    fileName: 'creditTrack.model.ts',
    modelName: 'CreditTrackModel',
    tableName: 'credit_tracks',
    schemaName: 'CreditTrackSchema',
    typeName: 'CreditTrack'
  },
  {
    fileName: 'enrollment.model.ts',
    modelName: 'EnrollmentModel',
    tableName: 'enrollments',
    schemaName: 'EnrollmentSchema',
    typeName: 'Enrollment'
  },
  {
    fileName: 'file.model.ts',
    modelName: 'FileModel',
    tableName: 'files',
    schemaName: 'FileSchema',
    typeName: 'File'
  },
  {
    fileName: 'meeting.model.ts',
    modelName: 'MeetingModel',
    tableName: 'meetings',
    schemaName: 'MeetingSchema',
    typeName: 'Meeting'
  },
  {
    fileName: 'orders.model.ts',
    modelName: 'OrdersModel',
    tableName: 'orders',
    schemaName: 'OrdersSchema',
    typeName: 'Order'
  },
  {
    fileName: 'product.model.ts',
    modelName: 'ProductModel',
    tableName: 'products',
    schemaName: 'ProductSchema',
    typeName: 'Product'
  },
  {
    fileName: 'puzzleCheck.model.ts',
    modelName: 'PuzzleCheckModel',
    tableName: 'puzzlechecks',
    schemaName: 'PuzzleCheckSchema',
    typeName: 'PuzzleCheck',
    orderField: 'order_index',
    orderAscending: true
  },
  {
    fileName: 'puzzleHint.model.ts',
    modelName: 'PuzzleHintModel',
    tableName: 'puzzlehints',
    schemaName: 'PuzzleHintSchema',
    typeName: 'PuzzleHint'
  },
  {
    fileName: 'puzzlePath.model.ts',
    modelName: 'PuzzlePathModel',
    tableName: 'puzzlepaths',
    schemaName: 'PuzzlePathSchema',
    typeName: 'PuzzlePath'
  },
  {
    fileName: 'puzzleReflect.model.ts',
    modelName: 'PuzzleReflectModel',
    tableName: 'puzzlereflects',
    schemaName: 'PuzzleReflectSchema',
    typeName: 'PuzzleReflect'
  },
  {
    fileName: 'puzzleRequest.model.ts',
    modelName: 'PuzzleRequestModel',
    tableName: 'puzzlerequests',
    schemaName: 'PuzzleRequestSchema',
    typeName: 'PuzzleRequest'
  },
  {
    fileName: 'relatedVideo.model.ts',
    modelName: 'RelatedVideoModel',
    tableName: 'related_videos',
    schemaName: 'RelatedVideoSchema',
    typeName: 'RelatedVideo'
  }
];

const generateModelTemplate = (config: ModelConfig): string => {
  const entityName = config.modelName.replace('Model', '');
  const pluralEntity = entityName.endsWith('s') ? entityName + 'es' : entityName + 's';
  
  return `import supabase from "./client";
import { ${config.typeName} } from "../../types/${config.typeName.toLowerCase()}.type";
import ${config.schemaName} from "../validator/${config.schemaName.charAt(0).toLowerCase() + config.schemaName.slice(1).replace('Schema', '')}.validator";
import { BaseModel } from "../base/BaseModel";
${config.hasBindMethods ? 'import { BindMethods } from "../../protocols/utility/BindMethods";' : ''}

/**
 * Migrated ${config.modelName} using BaseModel
 * Preserves exact same functionality and method names
 */
class ${config.modelName} extends BaseModel<${config.typeName}> {
  protected tableName = "${config.tableName}";${config.orderField ? `
  protected orderField = "${config.orderField}";
  protected orderAscending = ${config.orderAscending};` : ''}

  constructor() {
    super(supabase);
    const schemaInstance = new ${config.schemaName}();
    this.schema = schemaInstance.schema;
  }

  // Standard CRUD methods with original names
  getAll${pluralEntity} = async (page = 1, limit = 10) => {
    return this.getAll(page, limit);
  }

  get${entityName}ById = async (id: string) => {
    return this.getById(id);
  }

  create${entityName} = async (body: ${config.typeName}) => {
    return this.create(body);
  }

  update${entityName} = async (id: string, body: Partial<${config.typeName}>) => {
    return this.update(id, body);
  }

  delete${entityName} = async (id: string) => {
    return this.delete(id);
  }
}

${config.hasBindMethods ? 
`const binding = new BindMethods(new ${config.modelName}());
export default binding.bindMethods();` : 
`export default new ${config.modelName}();`}`;
};

// Generate all model files
modelConfigs.forEach(config => {
  const outputPath = path.join(__dirname, '../models/supabase', config.fileName.replace('.ts', '.new.ts'));
  const content = generateModelTemplate(config);
  fs.writeFileSync(outputPath, content);
  console.log(`✅ Generated ${config.fileName}`);
});

console.log('\nAll models generated successfully!');