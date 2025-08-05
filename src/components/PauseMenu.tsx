import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { ipcClient } from '../services/IPCClient'

interface PauseMenuProps {
  onResume: () => void
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume }) => {
  const navigate = useNavigate()
  const { saveGame, loadGame } = useGameStore()

  const handleSave = async () => {
    try {
      await saveGame()
      console.log('Game saved successfully')
      onResume()
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handleLoad = async () => {
    try {
      await loadGame()
      console.log('Game loaded successfully')
      onResume()
    } catch (error) {
      console.error('Load failed:', error)
    }
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleMainMenu = () => {
    navigate('/')
  }

  const handleQuit = () => {
    ipcClient.closeWindow()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onResume} />

      {/* 暂停菜单内容 */}
      <div className="z-50 text-center bg-white/10 p-10 rounded-2xl backdrop-blur-2xl border border-white/20">
        <div className="mb-8">
          <h2 className="text-3xl text-white">游戏暂停</h2>
        </div>

        <div className="flex flex-col gap-4 min-w-48">
          <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:-translate-y-0.5"
            onClick={onResume}
          >
            继续游戏
          </button>

          {/* <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:-translate-y-0.5"
            onClick={handleSave}
          >
            保存游戏
          </button> */}

          {/* <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:-translate-y-0.5"
            onClick={handleLoad}
          >
            读取存档
          </button> */}

          {/* <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:-translate-y-0.5"
            onClick={handleSettings}
          >
            游戏设置
          </button> */}

          <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-white/5 text-white border border-white/30 hover:bg-white/20 hover:-translate-y-0.5"
            onClick={handleMainMenu}
          >
            返回主菜单
          </button>

          <button
            className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-red-500 to-orange-600 text-white hover:-translate-y-0.5"
            onClick={handleQuit}
          >
            退出游戏
          </button>
        </div>

        {/* 快捷键提示 */}
        <div className="mt-5 text-sm text-gray-400">
          <p>按 ESC 键继续游戏</p>
        </div>
      </div>
    </div>
  )
}

export default PauseMenu
