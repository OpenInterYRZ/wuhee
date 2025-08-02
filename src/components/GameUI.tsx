import React from 'react'
import { useGameStore } from '../store/gameStore'
import { ipcClient } from '../services/IPCClient'

interface GameUIProps {
  onPause: () => void
}

const GameUI: React.FC<GameUIProps> = ({ onPause }) => {
  const { saveGame, isPlaying } = useGameStore()

  const handleQuickSave = async () => {
    try {
      await saveGame()
      // 显示保存成功提示
      console.log('Quick save successful')
    } catch (error) {
      console.error('Quick save failed:', error)
    }
  }

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

          <button
            className="w-10 h-10 border-0 rounded-lg bg-black/50 text-white cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-md hover:bg-black/70 hover:scale-110"
            onClick={handleQuickSave}
            title="快速保存 (Ctrl+S)"
          >
            <span className="text-lg">💾</span>
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

      {/* 底部状态栏 */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-between px-5 pointer-events-auto">
        {/* 游戏进度指示器 */}
        <div className="">{/* 这里可以显示章节进度、存档状态等信息 */}</div>

        {/* 快捷键提示 */}
        <div className="flex gap-4 text-xs text-white/70">
          <span className="bg-black/30 px-2 py-1 rounded backdrop-blur-sm">ESC: 暂停</span>
          <span className="bg-black/30 px-2 py-1 rounded backdrop-blur-sm">Ctrl+S: 快存</span>
          <span className="bg-black/30 px-2 py-1 rounded backdrop-blur-sm">Space: 继续</span>
        </div>
      </div>
    </div>
  )
}

export default GameUI
