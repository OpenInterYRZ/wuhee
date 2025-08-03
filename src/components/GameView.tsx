import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useGameEngine } from '../hooks/useGameEngine'
import { useKeyboard } from '../hooks/useKeyboard'
import { useAudio } from '../hooks/useAudio'
import Stage from './Stage'
import DialogueBox from './DialogueBox'
import GameUI from './GameUI'
import PauseMenu from './PauseMenu'
import ChoiceMenu from './ChoiceMenu'

const GameView: React.FC = () => {
  const navigate = useNavigate()
  const { isPlaying, isPaused, isLoading, currentChoices } = useGameStore()

  const { nextEvent, makeChoice, pauseGame, resumeGame, saveGame } = useGameEngine()
  const { playSfx } = useAudio()

  const [showPauseMenu, setShowPauseMenu] = useState(false)
  const [showClickHint, setShowClickHint] = useState(true)

  // 键盘事件处理
  useKeyboard(
    {
      onEscape: () => {
        if (isPaused) {
          handleResume()
        } else {
          handlePause()
        }
      },
      onSpace: () => {
        if (!isPaused && !currentChoices.length) {
          handleNextEvent()
        }
      },
      onEnter: () => {
        if (!isPaused && !currentChoices.length) {
          handleNextEvent()
        }
      },
      onNumber: (number) => {
        if (currentChoices.length >= number) {
          handleChoice(currentChoices[number - 1].id)
        }
      },
      onCtrlS: () => {
        handleSave()
      },
    },
    isPlaying
  )

  // 点击事件处理
  const handleClick = () => {
    if (!isPlaying || isPaused || currentChoices.length > 0) return

    handleNextEvent()
    setShowClickHint(false)
  }

  const handleNextEvent = async () => {
    try {
      await nextEvent()
      // 播放点击音效
      await playSfx('click.wav')
    } catch (error) {
      console.error('Failed to process next event:', error)
    }
  }

  const handleChoice = async (choiceId: string) => {
    try {
      await makeChoice(choiceId)
      // 播放选择音效
      await playSfx('select.wav')
    } catch (error) {
      console.error('Failed to make choice:', error)
    }
  }

  const handlePause = () => {
    pauseGame()
    setShowPauseMenu(true)
  }

  const handleResume = () => {
    resumeGame()
    setShowPauseMenu(false)
  }

  const handleSave = async () => {
    try {
      await saveGame()
      console.log('Game saved successfully')
      // 播放保存音效
      await playSfx('save.wav')
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  // 返回主菜单
  // const handleBackToMenu = () => {
  //   navigate('/')
  // }

  if (!isPlaying) {
    navigate('/')
    return null
  }

  // 如果游戏正在加载
  if (isLoading) {
    return (
      <div className="w-screen h-screen relative overflow-hidden cursor-pointer flex items-center justify-center bg-black/80">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* 游戏舞台 - 背景和角色 */}
      <Stage />

      {/* 对话框 */}
      <DialogueBox />

      {/* 选择菜单 */}
      {currentChoices.length > 0 && <ChoiceMenu choices={currentChoices} onChoice={handleChoice} />}

      {/* 游戏UI */}
      <GameUI onPause={handlePause} />

      {/* 暂停菜单 */}
      {showPauseMenu && <PauseMenu onResume={handleResume} />}

      {/* 点击提示 */}
      {showClickHint && !currentChoices.length && (
        <div className="absolute bottom-24 right-8 z-50 text-sm text-white/80 bg-black/50 px-3 py-2 rounded-md backdrop-blur-sm animate-pulse">
          <p>点击屏幕或按空格键继续</p>
        </div>
      )}
    </div>
  )
}

export default GameView
