export class MaterialEmbedding {
  constructor({ materialId, titleEmbedding, abstractEmbedding }) {
    this.materialId = materialId;
    this.titleEmbedding = titleEmbedding; 
    this.abstractEmbedding = abstractEmbedding;
  }
  isReadyForSearch() {
    return !!(this.titleEmbedding && this.abstractEmbedding);
  }
}
