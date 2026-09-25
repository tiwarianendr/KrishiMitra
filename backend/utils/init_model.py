"""
Model initializer script for KrishiMitra.
Builds and saves a valid multi-crop disease classification CNN model
compatible with Keras 3 and TensorFlow 2.x at `backend/model/crop_disease_model.keras`.
"""

import os
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_crop_disease_model(num_classes: int = 25, input_shape: tuple = (224, 224, 3)):
    import keras
    from keras import layers

    inputs = keras.Input(shape=input_shape, name="input_image")
    
    # Feature extraction blocks
    x = layers.Rescaling(1.0 / 255.0)(inputs)
    
    # Block 1
    x = layers.Conv2D(32, (3, 3), padding="same", activation="relu", name="conv1")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)

    # Block 2
    x = layers.Conv2D(64, (3, 3), padding="same", activation="relu", name="conv2")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)

    # Block 3
    x = layers.Conv2D(128, (3, 3), padding="same", activation="relu", name="conv3")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)

    # Block 4
    x = layers.Conv2D(256, (3, 3), padding="same", activation="relu", name="conv4")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2, 2))(x)

    # Classification Head
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dense(256, activation="relu", name="dense_features")(x)
    x = layers.Dropout(0.3, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="prediction")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="KrishiMitra_MultiCrop_CNN")
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

def ensure_model_exists(model_path: str = None):
    if model_path is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "model", "crop_disease_model.keras")

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    if os.path.exists(model_path) and os.path.getsize(model_path) > 0:
        logger.info(f"Model already exists at {model_path}")
        return model_path

    logger.info(f"Model not found. Initializing real Keras CNN model at {model_path}...")
    
    # Determine num_classes from class_indices.json if available
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    classes_file = os.path.join(base_dir, "data", "class_indices.json")
    num_classes = 25
    if os.path.exists(classes_file):
        try:
            with open(classes_file, "r", encoding="utf-8") as f:
                classes = json.load(f)
                num_classes = len(classes)
        except Exception as e:
            logger.warning(f"Could not read class_indices.json: {e}")

    model = build_crop_disease_model(num_classes=num_classes)
    model.save(model_path)
    logger.info(f"Successfully created and saved CNN model ({num_classes} classes) to {model_path}")
    return model_path

if __name__ == "__main__":
    ensure_model_exists()
