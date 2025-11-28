import faiss
import numpy as np
import pickle
import os
from typing import List, Tuple
from pathlib import Path

class VectorStore:
    def __init__(self, store_path: str = None):
        if store_path is None:
            # Path relative to project root (go up from backend/app/services)
            project_root = Path(__file__).parent.parent.parent.parent
            store_path = str(project_root / "vector_store" / "faiss_index")
        self.store_path = store_path
        self.index = None
        self.metadata = []  # Store (document_id, chunk_index, text) tuples
        self.dimension = None
        self._ensure_directory()
    
    def _ensure_directory(self):
        """Ensure the vector store directory exists."""
        Path(self.store_path).parent.mkdir(parents=True, exist_ok=True)
    
    def initialize(self, dimension: int):
        """Initialize FAISS index with given dimension."""
        self.dimension = dimension
        # Use L2 distance (Euclidean)
        self.index = faiss.IndexFlatL2(dimension)
    
    def add_embeddings(self, embeddings: np.ndarray, metadata: List[Tuple[str, int, str]]):
        """
        Add embeddings to the index.
        
        Args:
            embeddings: numpy array of shape (n, dimension)
            metadata: List of (document_id, chunk_index, text) tuples
        """
        if self.index is None:
            self.initialize(embeddings.shape[1])
        
        self.index.add(embeddings.astype('float32'))
        self.metadata.extend(metadata)
    
    def search(self, query_embedding: np.ndarray, k: int = 5) -> List[dict]:
        """
        Search for similar chunks.
        
        Returns:
            List of dicts with 'text', 'document_id', 'chunk_index', 'distance'
        """
        if self.index is None or self.index.ntotal == 0:
            return []
        
        query_embedding = query_embedding.reshape(1, -1).astype('float32')
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.metadata):
                doc_id, chunk_idx, text = self.metadata[idx]
                results.append({
                    'text': text,
                    'document_id': doc_id,
                    'chunk_index': chunk_idx,
                    'distance': float(distance),
                    'score': 1 / (1 + distance)  # Convert distance to similarity
                })
        
        return results
    
    def save(self):
        """Save index and metadata to disk."""
        if self.index is None:
            return
        
        # Save FAISS index
        faiss.write_index(self.index, f"{self.store_path}.index")
        
        # Save metadata
        with open(f"{self.store_path}.meta", 'wb') as f:
            pickle.dump(self.metadata, f)
    
    def load(self, dimension: int):
        """Load index and metadata from disk."""
        index_path = f"{self.store_path}.index"
        meta_path = f"{self.store_path}.meta"
        
        if os.path.exists(index_path) and os.path.exists(meta_path):
            self.index = faiss.read_index(index_path)
            with open(meta_path, 'rb') as f:
                self.metadata = pickle.load(f)
            self.dimension = dimension
        else:
            self.initialize(dimension)

