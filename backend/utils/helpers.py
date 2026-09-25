import os
import uuid
from typing import Tuple
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def is_allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file_storage, upload_folder: str) -> Tuple[str, str]:
    """
    Safely saves an uploaded file with a unique UUID prefix.
    Returns (saved_filename, full_file_path).
    """
    os.makedirs(upload_folder, exist_ok=True)
    orig_name = secure_filename(file_storage.filename or "upload.jpg")
    ext = orig_name.rsplit(".", 1)[1].lower() if "." in orig_name else "jpg"
    unique_filename = f"{uuid.uuid4().hex[:16]}_{orig_name}"
    target_path = os.path.join(upload_folder, unique_filename)
    
    file_storage.seek(0)
    file_storage.save(target_path)
    return unique_filename, target_path
