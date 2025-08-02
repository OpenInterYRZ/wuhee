import React, { useEffect } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import MainMenu from './components/MainMenu'
import GameView from './components/GameView'
import SettingsMenu from './components/SettingsMenu'
import './styles/index.css'

function App() {
  const { initializeGame } = useGameStore()

  useEffect(() => {
    // 初始化游戏
    initializeGame()
  }, [initializeGame])

  return (
    <div className="w-full h-full">
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<GameView />} />
          <Route path="/settings" element={<SettingsMenu />} />
        </Routes>
      </MemoryRouter>
    </div>
  )
}

export default App
