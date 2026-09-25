import os
import json
import logging
import threading
from typing import Dict, Any, Optional
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

class ModelService:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super(ModelService, cls).__new__(cls)
        return cls._instance

    def __init__(self, model_path: Optional[str] = None, data_dir: Optional[str] = None):
        # Prevent re-initialization if already loaded
        if hasattr(self, "_initialized") and self._initialized:
            return

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_path = model_path or os.path.join(base_dir, "model", "crop_disease_model.keras")
        self.data_dir = data_dir or os.path.join(base_dir, "data")
        self.diseases_file = os.path.join(self.data_dir, "diseases.json")
        self.classes_file = os.path.join(self.data_dir, "class_indices.json")

        self.model = None
        self.class_indices = []
        self.diseases_info = {}
        self.load_metadata()
        self.load_model()
        self._initialized = True

    def load_metadata(self):
        """Load class labels and detailed disease agronomy database."""
        try:
            if os.path.exists(self.classes_file):
                with open(self.classes_file, "r", encoding="utf-8") as f:
                    self.class_indices = json.load(f)
                logger.info(f"Loaded {len(self.class_indices)} disease classes from index.")
            else:
                logger.warning(f"Class indices file not found at {self.classes_file}")
                self.class_indices = []

            if os.path.exists(self.diseases_file):
                with open(self.diseases_file, "r", encoding="utf-8") as f:
                    self.diseases_info = json.load(f)
                logger.info(f"Loaded disease agronomy knowledge base with {len(self.diseases_info)} conditions.")
            else:
                logger.warning(f"Diseases data file not found at {self.diseases_file}")
                self.diseases_info = {}
        except Exception as e:
            logger.error(f"Error loading disease metadata: {e}")

    def load_model(self):
        """Safely load the Keras model once."""
        if not os.path.exists(self.model_path):
            logger.warning(f"Model file not found at {self.model_path}. Attempting initialization...")
            try:
                from backend.utils.init_model import ensure_model_exists
                ensure_model_exists(self.model_path)
            except Exception as e:
                logger.error(f"Failed to auto-generate baseline model: {e}")
                self.model = None
                return

        try:
            import keras
            logger.info(f"Loading Keras model from {self.model_path}...")
            self.model = keras.models.load_model(self.model_path, compile=False)
            logger.info("Crop disease classification model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Keras model from {self.model_path}: {e}")
            self.model = None

    def preprocess_image(self, image_file_or_path, target_size=(224, 224)) -> np.ndarray:
        """
        Validate and preprocess image for CNN inference.
        Returns numpy array of shape (1, 224, 224, 3) with float values.
        """
        try:
            if isinstance(image_file_or_path, str):
                image = Image.open(image_file_or_path)
            else:
                # File-like object (e.g. from Flask request.files)
                image_file_or_path.seek(0)
                image = Image.open(image_file_or_path)

            # Convert to RGB (handles RGBA, Grayscale, etc.)
            if image.mode != "RGB":
                image = image.convert("RGB")

            # Resize using high quality Lanczos resampling
            image = image.resize(target_size, Image.Resampling.LANCZOS)
            img_array = np.array(image, dtype=np.float32)

            # Add batch dimension: (1, 224, 224, 3)
            img_array = np.expand_dims(img_array, axis=0)
            return img_array
        except Exception as e:
            logger.error(f"Error during image preprocessing: {e}")
            raise ValueError(f"Invalid or corrupted image format: {str(e)}")

    def predict(self, image_file_or_path, crop_hint: Optional[str] = None) -> Dict[str, Any]:
        """
        Perform disease prediction on input image.
        Returns detailed diagnostics, confidence, symptoms, treatment, and prevention.
        """
        if self.model is None:
            # Try reloading once in case it was created asynchronously
            self.load_model()
            if self.model is None:
                raise RuntimeError("ML Model is currently unavailable. Please verify model/crop_disease_model.keras exists.")

        # Preprocess input image
        processed_img = self.preprocess_image(image_file_or_path)

        # Run inference
        try:
            # Model prediction (verbose=0 suppresses stdout noise)
            predictions = self.model.predict(processed_img, verbose=0)[0]
        except Exception as e:
            logger.error(f"Inference execution failed: {e}")
            raise RuntimeError(f"Model prediction failed: {str(e)}")

        num_classes = len(self.class_indices)
        if len(predictions) != num_classes:
            logger.warning(f"Model output dimension ({len(predictions)}) differs from class list ({num_classes})")

        # Optional crop filtering if crop_hint is supplied (e.g. "Tomato", "Potato", etc.)
        candidate_indices = list(range(len(predictions)))
        if crop_hint:
            filtered = [i for i, key in enumerate(self.class_indices) if key.lower().startswith(crop_hint.lower())]
            if filtered:
                candidate_indices = filtered

        # Find top predicted class within candidates
        sub_probs = [predictions[i] for i in candidate_indices]
        best_candidate_idx = np.argmax(sub_probs)
        pred_index = candidate_indices[best_candidate_idx]
        confidence_score = float(predictions[pred_index])

        # Get top 3 predictions for transparency
        top_k_indices = np.argsort(predictions)[::-1][:3]
        top_predictions = []
        for idx in top_k_indices:
            key = self.class_indices[idx] if idx < len(self.class_indices) else f"class_{idx}"
            info = self.diseases_info.get(key, {})
            crop_name = info.get("crop", key.split("_")[0].capitalize())
            disease_name = info.get("disease", key.replace("_", " ").title())
            top_predictions.append({
                "key": key,
                "crop": crop_name,
                "disease": disease_name,
                "confidence": round(float(predictions[idx]) * 100, 2)
            })

        class_key = self.class_indices[pred_index] if pred_index < len(self.class_indices) else f"class_{pred_index}"
        disease_data = self.diseases_info.get(class_key, {})

        crop = disease_data.get("crop", class_key.split("_")[0].capitalize())
        disease_name = disease_data.get("disease", class_key.replace("_", " ").title())
        is_healthy = disease_data.get("is_healthy", "healthy" in class_key.lower())
        severity = disease_data.get("severity", "None" if is_healthy else "Moderate")

        # Format confidence percentage (0 to 100%)
        # In neural networks with softmax, confidence is probabilities * 100
        confidence_pct = round(confidence_score * 100, 2)

        return {
            "disease_key": class_key,
            "crop": crop,
            "crop_hi": disease_data.get("crop_hi", crop),
            "disease": disease_name,
            "disease_hi": disease_data.get("disease_hi", disease_name),
            "confidence": confidence_pct,
            "is_healthy": is_healthy,
            "severity": severity,
            "description": disease_data.get("description", "No detailed description available for this condition."),
            "description_hi": disease_data.get("description_hi", ""),
            "symptoms": disease_data.get("symptoms", []),
            "symptoms_hi": disease_data.get("symptoms_hi", []),
            "treatment": disease_data.get("treatment", {
                "organic": ["Maintain clean cultivation and sanitize pruning equipment."],
                "chemical": ["Consult local agricultural extension for recommended treatment."]
            }),
            "prevention": disease_data.get("prevention", [
                "Practice proper crop rotation and avoid overhead wetting of foliage."
            ]),
            "next_steps": disease_data.get("next_steps", "Isolate suspect plants and inspect field."),
            "top_predictions": top_predictions
        }

# Global singleton accessor
def get_model_service() -> ModelService:
    return ModelService()
