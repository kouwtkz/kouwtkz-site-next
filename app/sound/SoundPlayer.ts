"use client";

const html = document?.documentElement;
let audio: HTMLAudioElement

export function AudioSync() {
  if (audio.paused) {
    html.classList.remove("audio_play");
  } else {
    html.classList.add("audio_play");
  }

}

export function AudioCheck() {
  if (!audio) {
    audio = new Audio();
    audio.addEventListener('play', () => {
      AudioSync();
    })
    audio.addEventListener('pause', () => {
      AudioSync();
    })
    audio.addEventListener('ended', () => {
      AudioSync();
    })
  }
}

export function AudioPlay(src: string) {
  AudioCheck();
  audio.src = src;
  audio.play();
  console.log(`♪playing… ${src}`);
}

export function AudioStop() {
  AudioCheck();
  audio.pause();
  audio.currentTime = 0;
}

