import { Result } from 'antd'
import { Link } from 'react-router-dom'
const App = () => (
  <Result
    status="404"
    title="404"
    subTitle="Rất tiếc, trang truy cập không tồn tại."
    extra={
      <Link type="primary" to="/">
        <button className="bg-white p-2 border-2 hover:border-sky-200 rounded ">Về trang chủ</button>
      </Link>
    }
  />
)
export default App
