import React from 'react'
import { useGameStore } from '../store/gameStore'
import { ipcClient } from '../services/IPCClient'

interface GameUIProps {
  onPause: () => void
}

const GameUI: React.FC<GameUIProps> = ({ onPause }) => {
  const { isPlaying } = useGameStore()

  const handleMinimize = () => {
    ipcClient.minimizeWindow()
  }

  const handleClose = () => {
    ipcClient.closeWindow()
  }

  if (!isPlaying) {
    return null
  }

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* 顶部控制栏 */}
      <div className="absolute top-5 left-0 right-0 flex justify-between px-5 pointer-events-auto">
        {/* 左侧游戏控制 */}
        <div className="flex gap-2.5">
          <button
            className="w-10 h-10 border-0 rounded-lg bg-black/50 text-white cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-md hover:bg-black/70 hover:scale-110"
            onClick={onPause}
            title="暂停游戏 (ESC)"
          >
            <span className="text-lg">⏸</span>
          </button>
        </div>

        {/* 右侧窗口控制 */}
        <div className="flex gap-2.5">
          <button
            className="w-10 h-10 border-0 rounded-lg bg-black/50 text-white cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-md hover:bg-black/70 hover:scale-110"
            onClick={handleMinimize}
            title="最小化"
          >
            <span className="text-lg">−</span>
          </button>

          <button
            className="w-10 h-10 border-0 rounded-lg bg-black/50 text-white cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-md hover:bg-red-700/70 hover:scale-110"
            onClick={handleClose}
            title="关闭游戏"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameUI
