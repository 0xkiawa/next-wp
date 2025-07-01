export default function TestPage() {
  return (
    <div>
      <h1>Test Page - {new Date().toLocaleTimeString()}</h1>
      <p>If you see a current timestamp, the server is updating</p>
    </div>
  )
}