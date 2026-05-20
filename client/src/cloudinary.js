const API_BASE = '/api/cloudinary';

const DEFAULT_VALIDATION = {
  images: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  pdf: {
    maxSize: 25 * 1024 * 1024,
    allowedTypes: ['application/pdf']
  }
};

export const getUploadSignature = async (folder = 'uploads', resourceType = 'image', eager = null) => {
  const response = await fetch(`${API_BASE}/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      folder,
      resource_type: resourceType,
      eager
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to get upload signature');
  }

  return response.json();
};

export const validateFile = (file, options = {}) => {
  const config = {
    images: options.images || DEFAULT_VALIDATION.images,
    pdf: options.pdf || DEFAULT_VALIDATION.pdf
  };

  const isImage = config.images.allowedTypes.includes(file.type);
  const isPdf = config.pdf.allowedTypes.includes(file.type);

  if (!isImage && !isPdf) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: image (JPEG, PNG, GIF, WebP) or PDF`
    };
  }

  if (isImage && file.size > config.images.maxSize) {
    return {
      valid: false,
      error: `Image too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${(config.images.maxSize / 1024 / 1024).toFixed(0)}MB`
    };
  }

  if (isPdf && file.size > config.pdf.maxSize) {
    return {
      valid: false,
      error: `PDF too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${(config.pdf.maxSize / 1024 / 1024).toFixed(0)}MB`
    };
  }

  return { valid: true };
};

export const uploadToCloudinary = async (file, folder = 'uploads', resourceType = 'image', onProgress = null) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const eager = resourceType === 'image' ? 'f_auto,q_auto' : null;
  const { signature, timestamp, api_key, cloud_name, format } = await getUploadSignature(folder, resourceType, eager);

  const createFormData = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);
    if (format) {
      formData.append('format', format);
    }
    if (resourceType === 'image') {
      formData.append('eager', eager);
    }
    return formData;
  };

  const maxRetries = 3;
  const baseDelay = 1000;

  const uploadWithRetry = async (attempt = 0) => {
    if (onProgress) {
      onProgress(10);
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
        {
          method: 'POST',
          body: createFormData()
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (onProgress) {
        onProgress(100);
      }
      return data.secure_url;
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (onProgress) {
          onProgress(Math.min(90, 30 + (attempt + 1) * 20));
        }
        return uploadWithRetry(attempt + 1);
      }
      throw new Error(`Upload failed after ${maxRetries + 1} attempts: ${error.message}`);
    }
  };

  return uploadWithRetry(0);
};

export const uploadPdfToStorage = async (file, onProgress = null) => {
  const validation = validateFile(file, {
    images: { maxSize: 0, allowedTypes: [] },
    pdf: {
      maxSize: 20 * 1024 * 1024,
      allowedTypes: ['application/pdf']
    }
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (onProgress) {
    onProgress(10);
  }

  const response = await fetch('/api/storage/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'X-File-Name': encodeURIComponent(file.name)
    },
    credentials: 'include',
    body: file
  });

  if (onProgress) {
    onProgress(90);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Tải PDF thất bại');
  }

  const data = await response.json();

  if (onProgress) {
    onProgress(100);
  }

  return data;
};

export const deletePdfFromStorage = async (storagePath) => {
  const response = await fetch('/api/storage/pdf', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ path: storagePath })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Xóa PDF thất bại');
  }

  return response.json();
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  const response = await fetch(`${API_BASE}/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      public_id: publicId,
      resource_type: resourceType
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete file');
  }

  const data = await response.json();
  return data.result === 'ok';
};

export const uploadToCloudinaryLegacy = (file, folder = 'uploads', onProgress = null) => {
  return uploadToCloudinary(file, folder, 'image', onProgress);
};
