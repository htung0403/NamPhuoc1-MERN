import background1 from "./images/background_card/IMG_0283.JPG";
import background2 from "./images/background_card/image.png";
import image5 from "./images/slider/DJI_0406.JPG";
import image2 from "./images/slider/IMG_1121-min.JPG";
import image4 from "./images/slider/IMG_7133.JPG";

const image3 =
  "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/z5755048946809_5bfc8efd5f1d41bd998fbb6761b1756c.jpg?alt=media&token=660ed22c-5292-4f42-81ef-401ccdc2c11f";
const image1 =
  "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/z5755048930046_0ba18821abf2c1d4ba478e82479762db.jpg?alt=media&token=27ac0c87-3a43-4259-a5ef-e9d08a08bd3c";

export const defaultHomeImages = {
  heroImages: [
    { src: image1, alt: "Học sinh Trường Tiểu học Nam Phước 1 trong hoạt động tập thể" },
    { src: image2, alt: "Sân trường Tiểu học Nam Phước 1" },
    { src: image3, alt: "Khoảnh khắc học sinh Nam Phước 1 vui đến trường" },
    { src: image4, alt: "Hoạt động ngoài trời của học sinh Nam Phước 1" },
    { src: image5, alt: "Toàn cảnh Trường Tiểu học Nam Phước 1" },
  ],
  highlightCards: [
    {
      title: "Sự kiện",
      subtitle: "Ấn tượng",
      image: background1,
      gradient: "linear-gradient(rgba(245, 166, 35, 0.88), rgba(245, 166, 35, 0.94))",
    },
    {
      title: "Lớp học",
      subtitle: "Năng động",
      image: background2,
      gradient: "linear-gradient(rgba(0, 119, 200, 0.84), rgba(0, 119, 200, 0.94))",
    },
    {
      title: "Giáo viên",
      subtitle: "Tận tâm",
      image: image3,
      gradient: "linear-gradient(rgba(21, 128, 61, 0.78), rgba(21, 128, 61, 0.9))",
    },
  ],
  beliefImage: {
    src: image3,
    alt: "Học sinh Nam Phước 1 tự tin tham gia hoạt động học tập",
  },
  galleryImages: [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/z5782120322596_bfbd9a8fc457d05eca4973b1c5eed106.jpg?alt=media&token=55b8277d-14e6-41cf-8b79-0393127dc728",
      alt: "Học sinh Nam Phước 1 tham gia hoạt động văn nghệ",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/z5755048954237_51401dd8e0501fc984706e288f47ce12.jpg?alt=media&token=47e5f2be-b5f2-4e55-9fdc-40f11689c66d",
      alt: "Hoạt động học tập tại Trường Tiểu học Nam Phước 1",
    },
    { src: image3, alt: "Học sinh vui chơi trong khuôn viên trường" },
    { src: image1, alt: "Tập thể học sinh Nam Phước 1 trong ngày hội trường" },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/z5755048915247_2f388ccf53bb888e47b838c0fe432a32.jpg?alt=media&token=72075a2e-0220-4a2f-8514-75b8e6a47ab1",
      alt: "Khoảnh khắc thân thiện của giáo viên và học sinh",
    },
  ],
};

const mergeImageList = (defaults, updates) =>
  defaults.map((item, index) => ({
    ...item,
    ...(updates?.[index] || {}),
    src: updates?.[index]?.src || item.src,
    alt: updates?.[index]?.alt || item.alt,
  }));

export const mergeHomeImages = (updates = {}) => ({
  heroImages: mergeImageList(defaultHomeImages.heroImages, updates.heroImages),
  highlightCards: defaultHomeImages.highlightCards.map((card, index) => ({
    ...card,
    ...(updates.highlightCards?.[index] || {}),
    image: updates.highlightCards?.[index]?.image || card.image,
  })),
  beliefImage: {
    ...defaultHomeImages.beliefImage,
    ...(updates.beliefImage || {}),
    src: updates.beliefImage?.src || defaultHomeImages.beliefImage.src,
  },
  galleryImages: mergeImageList(defaultHomeImages.galleryImages, updates.galleryImages),
});
