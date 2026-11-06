import { useSyncExternalStore } from 'react';

const state = { globeReady: false, loaderDone: false };
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markGlobeReady() {
  if (state.globeReady) return;
  state.globeReady = true;
  emit();
}

export function markLoaderDone() {
  if (state.loaderDone) return;
  state.loaderDone = true;
  emit();
}

export function isGlobeReady() {
  return state.globeReady;
}

export function useLoaderDone() {
  return useSyncExternalStore(subscribe, () => state.loaderDone, () => true);
}
