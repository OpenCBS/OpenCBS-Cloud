export interface Process {
  title: string,
  status: string,
  progress: number,
  order: number
}

export interface DayClosure {
  leftDays: number,
  processes: Array<Process>,
  status: string
}
