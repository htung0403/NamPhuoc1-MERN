import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'tin-tuc':
        return 'Tin Tức';
      case 'su-kien':
        return 'Sự Kiện';
      case 'phu-huynh':
        return 'Phụ Huynh';
      default:
        return category;
    }
  };
  return (
    <div className='group relative mx-2 w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg transition-all'>
      <Link to={`/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{getCategoryDisplayName(post.category)}</span>
        <Link
          to={`/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-cyan-500 text-slate-700 font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Đọc bài viết
        </Link>
      </div>
    </div>
  );
}