// 全域錯誤處理：統一錯誤回應格式
// 必須放在所有 routes 之後 app.use(errorHandler)

// 未匹配到任何 route 時回 404
export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `找不到路徑 ${req.method} ${req.originalUrl}` })
}

// 捕捉 route handler 裡拋出的錯誤
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message)
  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  })
}
