import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const formatTime = (date) => {
  if (!date) return ''
  
  if (isToday(date)) {
    return format(date, 'HH:mm')
  } else if (isYesterday(date)) {
    return '昨天'
  } else {
    return format(date, 'MM/dd')
  }
}

export const formatMessageTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
}
