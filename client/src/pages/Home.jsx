import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import giaithuongimg from "../images/badge.png";
import line from "../images/line-min.png";
import PostCard from "../components/PostCard";
import { mergeHomeImages } from "../homeImages";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [homeImages, setHomeImages] = useState(() => mergeHomeImages());

  document.title = "TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://namphuoc1.edu.vn/api"
      : "http://localhost:3005/api";

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/post/gettintucsukien?limit=3`);
        const data = await res.json();
        if (res.ok) setRecentPosts(data.posts || []);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentPosts();
  }, []);

  useEffect(() => {
    const fetchHomeImages = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/home-images`);
        const data = await res.json();
        if (res.ok) setHomeImages(mergeHomeImages(data.value));
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchHomeImages();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <section className="relative">
        <Carousel
          showThumbs={false}
          autoPlay
          interval={5000}
          infiniteLoop
          showStatus={false}
          showArrows
          emulateTouch
        >
          {homeImages.heroImages.map((image) => (
            <div key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                className="h-[360px] w-full object-cover sm:h-[460px] md:h-[680px]"
                loading="lazy"
              />
            </div>
          ))}
        </Carousel>
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-4 text-center">
          <div className="max-w-4xl text-white">
            <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
              Duy Xuyên, Quảng Nam
            </p>
            <h1 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
              Trường Tiểu học Nam Phước 1
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold sm:text-lg md:text-2xl">
              Mỗi ngày đến trường là một ngày vui, an toàn và giàu yêu thương.
            </p>
            <Link to="/gioi-thieu/thu-ngo" className="school-button school-button-accent mt-6 px-5 py-2.5 text-sm sm:mt-8 sm:px-7 sm:py-3 sm:text-base">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      <section className="school-container relative z-10 -mt-7 md:-mt-16">
        <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
          {homeImages.highlightCards.map((card) => (
            <div
              key={card.title}
              className="school-card min-h-[120px] overflow-hidden p-5 text-white sm:min-h-[160px] sm:p-7"
              style={{
                backgroundImage: `${card.gradient}, url(${card.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <p className="font-heading text-xl font-bold uppercase sm:text-2xl">{card.title}</p>
              <b className="font-heading text-3xl uppercase sm:text-4xl">{card.subtitle}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="school-container py-10 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="school-section-title text-2xl sm:text-3xl">Luôn tin ở khả năng của mình</h2>
            <p className="mt-5 text-justify text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg sm:leading-8">
              “Thầy rất vui khi được đứng đây, cùng các con bắt đầu một năm học
              mới đầy hứng khởi. Kiến thức giống như một hạt giống nhỏ cần được
              tưới nước và chăm sóc để lớn lên từng ngày. Hãy luôn giữ vững niềm
              tin vào bản thân, đừng ngại đặt câu hỏi và khám phá những điều mới
              lạ.”
            </p>
            <p className="mt-5 font-heading font-bold text-primary">- Hiệu trưởng Võ Quý</p>
          </div>
          <img
            src={homeImages.beliefImage.src}
            alt={homeImages.beliefImage.alt}
            className="school-card max-h-[300px] w-full object-cover sm:max-h-[430px]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="bg-blue-50/70 py-10 sm:py-14">
        <div className="school-container text-center">
          <h2 className="school-section-title text-2xl sm:text-3xl">Những thành tích nổi bật của học sinh</h2>
          <div className="mx-auto mt-8 max-w-md school-card p-6 sm:mt-10 sm:p-8">
            <img src={giaithuongimg} alt="Biểu tượng giải thưởng học sinh" className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24" />
            <b className="mt-4 block font-heading text-xl text-slate-900 sm:text-2xl">Giải thưởng</b>
            <img src={line} alt="" aria-hidden="true" className="mx-auto mt-3 w-32" />
            <p className="mt-4 text-slate-700">
              Đạt giải Nhất, Nhì, Ba tại các cuộc thi cấp tỉnh, cấp huyện;
              đặc biệt giải Ba tại cuộc thi IOE cấp quốc gia.
            </p>
          </div>
        </div>
      </section>

      <section className="school-container py-10 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="school-section-title text-2xl sm:text-3xl">Tin tức - Sự kiện</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Cập nhật những hoạt động mới nhất của nhà trường, giáo viên và học sinh.
            </p>
          </div>
          <Link to="/tin-tuc" className="font-heading font-extrabold text-primary hover:text-primary-dark">
            Xem tất cả
          </Link>
        </div>
        <div className="news-card-grid mt-8">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      <section className="school-container pb-10 sm:pb-16">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {homeImages.galleryImages.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt}
              className={`school-card h-52 w-full object-cover sm:h-72 ${index === 0 ? "md:row-span-2 md:h-full" : ""}`}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <section className="bg-blue-50/70 py-10 sm:py-16">
        <div className="school-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="school-section-title text-2xl sm:text-3xl">Xem video của trường</h2>
            <p className="mt-5 text-justify text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Trường Nam Phước 1 như một gia đình lớn. Các thầy cô giáo và học
              sinh yêu thương, gắn bó và cùng tiến bước qua những tiết học thú
              vị, những hoạt động hứng khởi nuôi dưỡng các con trưởng thành.
            </p>
          </div>
          <iframe
            width="100%"
            height="354"
            src="https://www.youtube.com/embed/er-Guj8mwsQ"
            title="Video giới thiệu Trường Tiểu học Nam Phước 1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="school-card aspect-video h-auto w-full"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
