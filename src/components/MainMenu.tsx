import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useGameEngine } from '../hooks/useGameEngine'
import { ipcClient } from '../services/IPCClient'

const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const { initializeGame } = useGameStore()
  const { initializeEngine, startNewGame, continueGame } = useGameEngine()
  const [hasSaveFile, setHasSaveFile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 初始化游戏引擎
  useEffect(() => {
    const init = async () => {
      try {
        await initializeEngine()
        await initializeGame()
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    }

    init()
  }, [initializeEngine, initializeGame])

  // 检查是否有存档文件
  useEffect(() => {
    const checkSaveFile = async () => {
      try {
        // 这里需要实现检查存档文件的逻辑
        // const saveExists = await ipcClient.checkSaveExists();
        // setHasSaveFile(saveExists);
        setHasSaveFile(false) // 临时设置
      } catch (error) {
        console.error('Failed to check save file:', error)
        setHasSaveFile(false)
      }
    }

    checkSaveFile()
  }, [])

  const handleNewGame = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await startNewGame()
      navigate('/game')
    } catch (error) {
      console.error('Failed to start new game:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueGame = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await continueGame()
      navigate('/game')
    } catch (error) {
      console.error('Failed to continue game:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleExit = () => {
    ipcClient.closeWindow()
  }

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 -z-10">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 主要内容 */}
      <div className="text-center z-10">
        {/* 游戏标题 */}
        <div className="mb-8">
          <h1
            className="text-6xl font-bold mb-4 text-white"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              background: 'linear-gradient(45deg, #fff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            乌合之众
          </h1>
          <p className="text-xl text-white/80">The Crowd</p>
        </div>

        {/* 菜单按钮 */}
        <div className="flex flex-col gap-4 items-center">
          <button
            className="w-48 px-8 py-4 text-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleNewGame}
            disabled={isLoading}
          >
            开始游戏
          </button>

          <button
            className={`w-48 px-8 py-4 text-lg border border-white/20 rounded-lg text-white cursor-pointer transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              hasSaveFile ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'
            }`}
            onClick={handleContinueGame}
            disabled={!hasSaveFile || isLoading}
          >
            {isLoading ? '加载中...' : '继续游戏'}
          </button>

          <button
            className="w-48 px-8 py-4 text-lg bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSettings}
            disabled={isLoading}
          >
            设置
          </button>

          <button
            className="w-48 px-8 py-4 text-lg bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleExit}
            disabled={isLoading}
          >
            退出游戏
          </button>
        </div>

        {/* 版本信息 */}
        <div className="mt-8">
          <p className="text-sm text-white/60">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
