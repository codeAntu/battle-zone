import GameCard from '@/components/gameCard';
import { GameType, getAllGames } from '@/services/game';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
// Import Swiper components
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Route = createFileRoute('/user/tournaments/')({
  component: RouteComponent,
});
function RouteComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tournaments'],
    queryFn: getAllGames,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tournaments.</div>;
  }

  const ludoGame: GameType = {
    id: 999,
    name: 'Ludo',
    description: 'Classic Ludo game - Coming Soon!',
    iconUrl: '/games/LUDO/icon.png',
    image: '/games/LUDO/image.png',
  };

  const images = ['/banner/01.jpg', '/banner/02.jpg', '/banner/03.jpg'];

  const allGames = [...(data?.data ?? []), ludoGame];

  return (
    <div className='space-y-4 p-5'>
      <div>
        <h1 className='text-2xl font-bold'>Tournaments</h1>
        <p className='text-sm text-gray-500'>Select a game to view tournaments</p>
      </div>

      <div className='pb-3 md:hidden'>
        <div className='aspect-auto w-full overflow-hidden rounded-lg'>
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={1}
            className='h-full w-full'
          >
            {images.map((image, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <div className='relative h-full w-full'>
                  <img src={image} alt={`Game slide ${index + 1}`} className='h-full w-full object-cover' />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className='text-2xl font-bold text-white/80 md:hidden'>Games</div>

      <div className='grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {allGames.map((game) => {
          return <GameCard key={game.id} game={game} comingSoon={game.id === 999} />;
        })}
      </div>
    </div>
  );
}
