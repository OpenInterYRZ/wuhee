import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const DialogueBox: React.FC = () => {
  const { currentDialogue, currentSpeaker, isPlaying } = useGameStore()
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(50)

  // 打字机效果
  useEffect(() => {
    if (!currentDialogue) {
      setDisplayedText('')
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setDisplayedText('')

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < currentDialogue.length) {
        setDisplayedText(currentDialogue.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 100 - typingSpeed)

    return () => clearInterval(interval)
  }, [currentDialogue, typingSpeed])

  // 如果没有对话内容，不显示对话框
  if (!currentDialogue || !isPlaying) {
    return null
  }

  // 获取角色信息
  const getCharacterInfo = (speakerId: string) => {
    // 这里可以从角色配置文件中获取角色信息
    const characterMap: Record<string, { name: string; color: string }> = {
      narrator: { name: '旁白', color: '#ffffff' },
      protagonist: { name: '主角', color: '#4a90e2' },
      mysterious_figure: { name: '神秘人', color: '#8b5a3c' },
      crowd_member_1: { name: '路人甲', color: '#666666' },
      crowd_member_2: { name: '路人乙', color: '#666666' },
    }

    return characterMap[speakerId] || { name: speakerId, color: '#ffffff' }
  }

  const characterInfo = getCharacterInfo(currentSpeaker)

  // 获取头像路径
  const getAvatarPath = (speakerId: string) => {
    // 根据角色ID映射到实际的头像文件
    const avatarMap: Record<string, string> = {
      protagonist: '/avatar/Runze Yang-XJ109340.png',
      mysterious_figure: '/avatar/d429e46eb951964bae7b28c4e7a9906.jpg',
      crowd_member_1: '/avatar/Runze Yang-XJ109340.png',
      crowd_member_2: '/avatar/d429e46eb951964bae7b28c4e7a9906.jpg',
    }

    return avatarMap[speakerId] || '/avatar/Runze Yang-XJ109340.png'
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-48 z-40 flex items-stretch p-0 mb-20">
      {/* 对话框背景 */}
      <div className="absolute inset-0 bg-none" />

      {/* 左侧角色信息区域 */}
      {currentSpeaker !== 'narrator' && (
        <div className="w-168 flex flex-row items-center justify-center gap-7 z-50 p-5 ">
          <div className="w-40 h-40 mb-2.5 border-2 border-white/40 rounded-lg overflow-hidden">
            <img src={getAvatarPath(currentSpeaker)} alt={characterInfo.name} className="w-full h-full object-cover" />
          </div>
          <div
            className="text-4xl font-bold text-yellow-500 text-center"
            style={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            }}
          >
            {characterInfo.name}
          </div>
        </div>
      )}

      {/* 右侧对话内容区域 */}
      <div className="flex-1 z-50 relative flex flex-col  items-center px-8 py-5 mt-20">
        {/* 对话文本框 */}
        <div className=" rounded-lg p-5 mb-2.5">
          <p className={`text-xl  ${currentSpeaker === 'narrator' ? 'italic text-gray-300' : 'text-white'}`}>{displayedText}</p>
        </div>

        {/* 继续提示 */}
        {!isTyping && (
          <div className="absolute bottom-2.5 right-5 text-sm text-gray-400">
            <span className="animate-bounce">▼</span>
          </div>
        )}
      </div>

      {/* 快进按钮 */}
      {isTyping && (
        <button
          className="absolute top-2.5 right-5 px-2.5 py-1 text-xs bg-white/20 border-0 rounded text-white cursor-pointer transition-all duration-300 hover:bg-white/30"
          onClick={() => {
            setDisplayedText(currentDialogue)
            setIsTyping(false)
          }}
        >
          跳过
        </button>
      )}
    </div>
  )
}

export default DialogueBox
