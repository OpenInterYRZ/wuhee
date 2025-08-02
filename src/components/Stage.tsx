import React from 'react'
import { useGameStore } from '../store/gameStore'

const Stage: React.FC = () => {
  const { background, characters } = useGameStore()

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-10 mt-40 mb-40">
        {background && (
          <img
            src={background}
            alt="Scene background"
            className="w-full h-full object-cover"
            onError={(e) => {
              // 如果图片加载失败，显示默认背景
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        {/* 默认背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 -z-10" />
      </div>

      {/* 角色立绘 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {characters.map((character, index) => (
          <div
            key={`${character}-${index}`}
            className={`absolute bottom-0 transition-all duration-500 ${
              index === 0 ? 'left-[10%]' : index === 1 ? 'left-1/2 -translate-x-1/2' : index === 2 ? 'right-[10%]' : 'left-[10%]'
            }`}
          >
            <img
              src={`/assets/characters/${character}.png`}
              alt={character}
              className="h-[80vh] w-auto object-contain"
              onError={(e) => {
                // 如果角色图片加载失败，隐藏该角色
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        ))}
      </div>

      {/* 舞台特效层 */}
      <div className="absolute inset-0 z-30 pointer-events-none">{/* 这里可以添加各种视觉特效 */}</div>
    </div>
  )
}

export default Stage
