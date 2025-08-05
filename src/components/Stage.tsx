import React from 'react'
import { useGameStore } from '../store/gameStore'

const Stage: React.FC = () => {
  const { background, backgroundEffects, tanChuang } = useGameStore()
  console.log('🖼️ Stage: 当前背景路径:', background, 'tanChuang', tanChuang)

  // 构建特效类名
  const getEffectClasses = () => {
    let classes = 'w-full h-full relative overflow-hidden'

    if (backgroundEffects) {
      // 抖动特效

      if (backgroundEffects.noEffect) {
        console.log('🖼️ Stage: 无特效')
        return 'w-full h-full relative overflow-hidden'
      }
      if (backgroundEffects.shake) {
        classes += ' animate-shake'
      }
      if (backgroundEffects.fadeout) {
        console.log('🖼️ Stage: 淡出特效')
        classes += ' fadeout'
      }
      if (backgroundEffects.fadein) {
        console.log('🖼️ Stage: 淡入特效')
        classes += ' fadein'
      }
    }

    return classes
  }

  return (
    <div className={getEffectClasses()}>
      {/* 背景图片 */}
      <div className="absolute inset-0 z-10 mt-40 mb-40 flex items-center justify-center">
        {background && (
          <img
            src={background}
            alt="Scene background"
            className={`h-full object-cover transition-opacity duration-500 `}
            onError={(e) => {
              // 如果图片加载失败，显示默认背景
              console.error('🖼️ Stage: 背景图片加载失败:', background)
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        {/* 默认背景渐变 */}
        <div className="absolute inset-0 bg-black -z-10" />
      </div>

      {/* 弹窗 */}
      {tanChuang && (
        <div className="absolute bg-black/80 inset-0 z-40 flex justify-center items-center animate-fadeIn">
          <div className="h-1/2 border-white border-4 animate-scaleIn">
            <img src={tanChuang} alt="Tan Chuang" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* 舞台特效层 */}
      <div className="absolute inset-0 z-30 pointer-events-none">{/* 这里可以添加各种视觉特效 */}</div>
    </div>
  )
}

export default Stage
