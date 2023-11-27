"use client"
import Twemoji from 'react-twemoji';

export default function Home() {
  return (
    <main>
      <Twemoji options={{ className: 'emoji' }}>
        はろはろめぇめぇ！🐏
        ホットだね！
        <a href="gallery">イラスト</a>
      </Twemoji>
    </main>
  )
}
