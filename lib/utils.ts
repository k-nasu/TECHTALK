export const getRelativeTimeString = (date: string): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInMilliseconds = now.getTime() - past.getTime()
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`
  } else if (diffInDays < 30) {
    return `${diffInDays}日前`
  } else if (diffInMonths < 12) {
    return `${diffInMonths}ヶ月前`
  } else {
    return `${diffInYears}年前`
  }
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    // Invalid Dateチェック
    if (isNaN(date.getTime())) {
      return dateString
    }

    // UTCで固定の日付文字列を生成
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()

    // 日本語の月表記
    const monthStr = `${month}月`

    return `${year}年${monthStr}${day}日`
  } catch {
    return dateString
  }
}
