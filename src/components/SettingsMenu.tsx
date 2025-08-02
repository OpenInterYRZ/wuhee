import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { ipcClient } from '../services/IPCClient'

const SettingsMenu: React.FC = () => {
  const navigate = useNavigate()
  const { settings, updateSettings } = useGameStore()
  const [activeTab, setActiveTab] = useState<'audio' | 'display' | 'save'>('audio')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', value: number) => {
    updateSettings({
      volume: {
        ...settings.volume,
        [type]: value / 100,
      },
    })
  }

  const handleDisplayChange = (key: string, value: any) => {
    updateSettings({
      display: {
        ...settings.display,
        [key]: value,
      },
    })
  }

  const handleDeleteSave = async () => {
    try {
      // 这里需要添加删除存档的 IPC 调用
      // await ipcClient.deleteSave();
      setShowDeleteConfirm(false)
      console.log('Save deleted successfully')
    } catch (error) {
      console.error('Failed to delete save:', error)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="w-screen h-screen relative">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 设置内容 */}
      <div className="relative z-10 p-10 h-full flex flex-col">
        {/* 标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-white">游戏设置</h1>
          <button
            className="px-5 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-white/20"
            onClick={handleBack}
          >
            返回
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2.5 mb-8">
          <button
            className={`px-6 py-3 border-0 rounded-t-lg cursor-pointer transition-all duration-300 ${
              activeTab === 'audio' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('audio')}
          >
            音频设置
          </button>
          <button
            className={`px-6 py-3 border-0 rounded-t-lg cursor-pointer transition-all duration-300 ${
              activeTab === 'display' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('display')}
          >
            显示设置
          </button>
          <button
            className={`px-6 py-3 border-0 rounded-t-lg cursor-pointer transition-all duration-300 ${
              activeTab === 'save' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('save')}
          >
            存档管理
          </button>
        </div>

        {/* 设置面板 */}
        <div className="flex-1 bg-white/10 rounded-r-xl rounded-bl-xl p-8 backdrop-blur-md">
          {/* 音频设置 */}
          {activeTab === 'audio' && (
            <div className="audio-settings">
              <div className="mb-6">
                <label className="block text-base font-medium mb-2.5 text-white">主音量</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume.master * 100}
                    onChange={(e) => handleVolumeChange('master', parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full bg-white/20 outline-none cursor-pointer slider"
                  />
                  <span className="min-w-12 text-center font-medium text-white">{Math.round(settings.volume.master * 100)}%</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-base font-medium mb-2.5 text-white">背景音乐</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume.music * 100}
                    onChange={(e) => handleVolumeChange('music', parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full bg-white/20 outline-none cursor-pointer slider"
                  />
                  <span className="min-w-12 text-center font-medium text-white">{Math.round(settings.volume.music * 100)}%</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-base font-medium mb-2.5 text-white">音效</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume.sfx * 100}
                    onChange={(e) => handleVolumeChange('sfx', parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full bg-white/20 outline-none cursor-pointer slider"
                  />
                  <span className="min-w-12 text-center font-medium text-white">{Math.round(settings.volume.sfx * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 显示设置 */}
          {activeTab === 'display' && (
            <div className="display-settings">
              <div className="mb-6">
                <label className="block text-base font-medium mb-2.5 text-white">全屏模式</label>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={settings.display.fullscreen}
                    onChange={(e) => handleDisplayChange('fullscreen', e.target.checked)}
                    className="w-12 h-6 appearance-none bg-white/20 rounded-full relative cursor-pointer transition-all duration-300 checked:bg-indigo-500 toggle"
                  />
                  <span className="font-medium text-white">{settings.display.fullscreen ? '开启' : '关闭'}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-base font-medium mb-2.5 text-white">文本显示速度</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.display.textSpeed}
                    onChange={(e) => handleDisplayChange('textSpeed', parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full bg-white/20 outline-none cursor-pointer slider"
                  />
                  <span className="min-w-12 text-center font-medium text-white">
                    {settings.display.textSpeed < 30 ? '慢' : settings.display.textSpeed < 70 ? '中' : '快'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 存档管理 */}
          {activeTab === 'save' && (
            <div className="save-settings">
              <div className="mb-8">
                <h3 className="text-xl mb-2.5 text-white">存档信息</h3>
                <p className="text-white/80 leading-relaxed">自动存档会在关键剧情点自动保存游戏进度</p>
              </div>

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-0 rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-red-500 to-orange-600 text-white hover:-translate-y-0.5 hover:shadow-xl"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  删除所有存档
                </button>
              </div>

              {/* 删除确认对话框 */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                  <div className="z-50 bg-white/10 p-8 rounded-2xl backdrop-blur-2xl border border-white/20 text-center max-w-sm w-[90%]">
                    <h3 className="text-xl mb-4 text-white">确认删除</h3>
                    <p className="text-white/90 mb-6 leading-relaxed">确定要删除所有存档吗？此操作无法撤销。</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        className="px-5 py-2.5 border-0 rounded-md text-sm cursor-pointer transition-all duration-300 min-w-20 hover:-translate-y-px bg-gradient-to-br from-red-500 to-orange-600 text-white"
                        onClick={handleDeleteSave}
                      >
                        确认删除
                      </button>
                      <button
                        className="px-5 py-2.5 border-0 rounded-md text-sm cursor-pointer transition-all duration-300 min-w-20 hover:-translate-y-px bg-white/10 text-white border border-white/30"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsMenu
