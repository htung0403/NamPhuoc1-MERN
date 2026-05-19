import { uploadToCloudinary, validateFile } from '../../cloudinary';

const imageHandler = function() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const quill = this.quill;
    const range = quill.getSelection(true);

    try {
      const downloadURL = await uploadToCloudinary(file, 'quillImages');
      quill.insertEmbed(range.index, 'image', downloadURL);
    } catch (error) {
      alert('Tải ảnh thất bại. Vui lòng thử lại.');
    }
  };
};

export default imageHandler;