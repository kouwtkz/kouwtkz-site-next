"use client";

let audio: HTMLAudioElement

export function AudioPlay(src: string){
  if (!audio) audio = new Audio();
  audio.src = src;
  audio.play();
  console.log(`♪playing… ${src}`);
}
