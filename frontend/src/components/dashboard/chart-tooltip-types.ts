interface TooltipPayload {
  name: string
  value: number
  color: string
}

export interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}
