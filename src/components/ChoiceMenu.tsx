import React from 'react'
import { useGameStore } from '../store/gameStore'

interface Choice {
  id: string
  text: string
  nextScene?: string
}

interface ChoiceMenuProps {
  choices: Choice[]
  onChoice: (choiceId: string) => void
}

const ChoiceMenu: React.FC<ChoiceMenuProps> = ({ choices, onChoice }) => {
  const { isPlaying } = useGameStore()

  if (!choices || choices.length === 0 || !isPlaying) {
    return null
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* 选择背景 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 选择内容 */}
      <div className="z-50 text-center max-w-2xl w-[90%]">
        <div className="mb-8">
          <h3
            className="text-2xl text-white"
            style={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            }}
          >
            请选择...
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              className="flex items-center px-5 py-4 bg-white/10 border border-white/30 rounded-lg text-white cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:translate-x-2.5 hover:shadow-xl"
              onClick={() => onChoice(choice.id)}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-full mr-4 font-bold">{index + 1}</span>
              <span className="flex-1 text-left text-base">{choice.text}</span>
            </button>
          ))}
        </div>

        {/* 快捷键提示 */}
        <div className="mt-5 text-sm text-gray-400">
          <p>使用数字键 1-{choices.length} 或点击选择</p>
        </div>
      </div>
    </div>
  )
}

export default ChoiceMenu
