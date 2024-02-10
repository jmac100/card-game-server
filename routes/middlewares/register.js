export const register = async (req, res, next) => {
   const token = req.header('auth-token')
   if (!token)
      return res.status(200).json({
         auth: false,
         msg: 'Invalid API Key'
      })

   try {
      req.auth = token === process.env.API_KEY
      if (!req.auth) {
         return res.status(401).json({
            auth: false,
            msg: 'Invalid API Key'
         })
      }
      next()
   } catch (error) {
      return res.status(401).json({
         auth: false,
         msg: 'Invalid API Key'
      })
   }
}