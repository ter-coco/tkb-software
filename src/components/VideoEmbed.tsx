type Props = { youtubeId: string; title: string };

/** ฝังคลิป YouTube แบบ privacy-enhanced (youtube-nocookie) สัดส่วน 16:9 โหลดเมื่อเลื่อนมาถึง */
export function VideoEmbed({ youtubeId, title }: Props) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-lg shadow-slate-900/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="size-full"
      />
    </div>
  );
}
