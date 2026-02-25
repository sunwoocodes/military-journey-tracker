import { motion } from 'framer-motion';
import { ShoppingBag, Star, Lock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useUserStore, BRANCH_META } from '@/stores/userStore';

interface Skin {
  id: string;
  name: string;
  emoji: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
}

const MOCK_SKINS: Skin[] = [
  { id: '1', name: '기본 열차', emoji: '🚇', price: 0, rarity: 'common', owned: true },
  { id: '2', name: '무궁화호', emoji: '🚂', price: 500, rarity: 'common', owned: false },
  { id: '3', name: 'KTX', emoji: '🚄', price: 1500, rarity: 'rare', owned: false },
  { id: '4', name: '스팀펑크 열차', emoji: '🚃', price: 3000, rarity: 'epic', owned: false },
  { id: '5', name: '황금 열차', emoji: '✨', price: 5000, rarity: 'legendary', owned: false },
  { id: '6', name: '우주 열차', emoji: '🚀', price: 8000, rarity: 'legendary', owned: false },
];

const RARITY_STYLES: Record<string, string> = {
  common: 'border-muted-foreground/30',
  rare: 'border-led-blue glow-border',
  epic: 'border-accent glow-border',
  legendary: 'border-primary glow-border',
};

const RARITY_LABELS: Record<string, string> = {
  common: '일반',
  rare: '레어',
  epic: '에픽',
  legendary: '레전더리',
};

export default function ShopPage() {
  const { currentSkinId, setCurrentSkin } = useUserStore();

  return (
    <AppLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="title-korean text-lg text-foreground">
            <ShoppingBag className="inline mr-1 text-primary" size={20} /> 스킨 상점
          </h2>
          <div className="led-panel px-3 py-1 flex items-center gap-1">
            <Star size={14} className="text-primary" />
            <span className="font-mono text-sm text-primary">2,400</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_SKINS.map((skin, i) => {
            const isEquipped = currentSkinId === skin.id || (!currentSkinId && skin.id === '1');
            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`led-panel border-2 ${RARITY_STYLES[skin.rarity]} overflow-hidden`}
              >
                <div className="p-4 text-center">
                  <div className="text-4xl mb-2">{skin.emoji}</div>
                  <p className="text-sm font-medium text-foreground">{skin.name}</p>
                  <p className={`text-[10px] mt-0.5 ${
                    skin.rarity === 'legendary' ? 'text-primary' :
                    skin.rarity === 'epic' ? 'text-accent' :
                    skin.rarity === 'rare' ? 'text-led-blue' :
                    'text-muted-foreground'
                  }`}>
                    {RARITY_LABELS[skin.rarity]}
                  </p>
                </div>
                <div className="border-t border-border px-3 py-2">
                  {skin.owned ? (
                    <Button
                      size="sm"
                      className="w-full text-xs"
                      variant={isEquipped ? 'secondary' : 'default'}
                      onClick={() => setCurrentSkin(skin.id)}
                    >
                      {isEquipped ? '장착 중' : '장착하기'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Star size={12} className="mr-1" />
                      {skin.price.toLocaleString()}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
