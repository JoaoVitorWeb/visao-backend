export let isTheMonitorRunning: boolean;
export let minutes: number = 30;
export let warningTimeInHours: number = 8;

export function setIsTheMonitorRunning(value: boolean) {
  isTheMonitorRunning = value;
}

export function setMinutes(value: number) {
  minutes = value;
}