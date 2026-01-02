import crypto from "crypto"

// generate nonce base64 (setara os.urandom + base64)
function generateNonce(length = 12) {
  return crypto.randomBytes(length).toString("base64")
}

export default function handler(req, res) {
  const userInput = req.query.input || ""
  const nonce = generateNonce()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XSS Mitigation Demo</title>
</head>
<body>
  <h1>XSS Mitigation Demo</h1>

  <form action="/api" method="GET">
    <input type="text" name="input" placeholder="Enter text" />
    <button type="submit">Submit</button>
  </form>

  <p>Echo: ${userInput}</p>

  <script nonce="${nonce}" src="/static/script.js"></script>
</body>
</html>
`

  // CSP setara Flask version
  const csp = `default-src 'none'; script-src 'nonce-${nonce}'; img-src *`

  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Content-Security-Policy", csp)
  res.status(200).send(html)
}
