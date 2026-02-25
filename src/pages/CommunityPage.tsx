import { motion } from 'framer-motion';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

const MOCK_POSTS = [
  {
    id: '1', author: '김병장', rank: '병장', category: '자유',
    title: '전역 50일 남았습니다 ㅎㅎ', content: '드디어 50일... 길고 긴 여정이 끝나갑니다.',
    likes: 42, comments: 12, time: '2시간 전',
  },
  {
    id: '2', author: '이상병', rank: '상병', category: '정보',
    title: '휴가 꿀팁 공유', content: '포상 휴가 받는 방법 정리해봤습니다.',
    likes: 87, comments: 34, time: '5시간 전',
  },
  {
    id: '3', author: '박일병', rank: '일병', category: '운동',
    title: '체력검정 1등급 후기', content: '3개월 준비해서 1등급 받았어요. 꿀팁 공유합니다.',
    likes: 156, comments: 67, time: '1일 전',
  },
];

const CATEGORIES = ['전체', '자유', '정보', '운동', '고민'];

export default function CommunityPage() {
  return (
    <AppLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="title-korean text-lg text-foreground">💬 소통</h2>
          <Button size="sm" className="gap-1">
            <Plus size={14} /> 글쓰기
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {MOCK_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="led-panel p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-accent/30 px-1.5 py-0.5 text-[10px] text-accent-foreground">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground">{post.time}</span>
              </div>
              <h3 className="text-sm font-medium text-foreground">{post.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.content}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-[10px] text-muted-foreground">{post.author} {post.rank}</span>
                <div className="flex-1" />
                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                  <Heart size={12} /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle size={12} /> {post.comments}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
