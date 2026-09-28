import { announcement } from '../data/site'

export default function TopBar() {
  return (
    <div className="top-bar">
      <p>{announcement}</p>
    </div>
  )
}
