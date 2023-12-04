"use client";

const html = document.documentElement;
let audio: HTMLAudioElement

export function AudioPlay(src: string){
  if (!audio) audio = new Audio();
  html.classList.toggle("audio_play");
  audio.src = src;
  audio.play();
  console.log(`♪playing… ${src}`);
}
