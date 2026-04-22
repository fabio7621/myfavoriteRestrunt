// 驗證中介層：把 model 的驗證函式包成 Express middleware
// 用法：router.post('/', validate(validateRestaurantInput), handler)

export function validate(validateFn) {
  return (req, res, next) => {
    const errors = validateFn(req.body)
    if (errors.length > 0) {
      return res.status(400).json({
        error: errors[0],
        details: errors
      })
    }
    next()
  }
}
