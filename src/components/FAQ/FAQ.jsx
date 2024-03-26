import { useEffect, useState } from 'react'

function FAQ() {
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > 100) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <>
      <section className="section faq">
        <div className="row">
          <div className="col-lg-12">
            <div className="card basic">
              <div className="card-body">
                <h5 className="card-title">Tài liệu này cung cấp cho bạn (người truy cập và sử dụng website) chính sách liên quan đến bảo mật và quyền riêng tư của bạn</h5>
                <div>
                  <a href="#D1">
                    <h6>Điều 1: Thu thập thông tin</h6>
                  </a>
                </div>

                <div className="pt-2">
                  <a href="#D2">
                    <h6>Điều 2: Lưu trữ & Bảo vệ thông tin</h6>
                  </a>
                </div>

                <div className="pt-2">
                  <a href="#D3">
                    <h6>Điều 3: Sử dụng thông tin</h6>
                  </a>
                </div>
                <div className="pt-2">
                  <a href="#D4">
                    <h6>Điều 4: Tiếp nhận thông tin từ các đối tác</h6>
                  </a>
                </div>
                <div className="pt-2" id="D2">
                  <a href="#D5">
                    <h6>Điều 5: Chia sẻ thông tin với bên thứ ba</h6>
                  </a>
                </div>
                <div className="pt-2" id="D1">
                  <a href="#D6">
                    <h6>Điều 6: Thay đổi chính sách bảo mật</h6>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Điều 1: Thu thập thông tin</h5>

                <div className="accordion accordion-flush" id="faq-group-2">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <a className="accordion-button collapsed" data-bs-target="#faqsTwo-1" data-bs-toggle="collapse">
                        1.1. Thu thập tự động:
                      </a>
                    </h2>
                    <div id="faqsTwo-1" className="accordion-collapse collapse" data-bs-parent="#faq-group-2">
                      <div className="accordion-body">
                        Hệ thống này được xây dựng bằng mã nguồn NukeViet. Như mọi website hiện đại khác, chúng tôi sẽ thu thập địa chỉ IP và các thông tin web tiêu chuẩn khác của
                        bạn như: loại trình duyệt, các trang bạn truy cập trong quá trình sử dụng dịch vụ, thông tin về máy tính & thiết bị mạng v.v… cho mục đích phân tích thông
                        tin phục vụ việc bảo mật và giữ an toàn cho hệ thống.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <a className="accordion-button collapsed" data-bs-target="#faqsTwo-2" data-bs-toggle="collapse">
                        1.2. Thu thập từ các khai báo của chính bạn:
                      </a>
                    </h2>
                    <div id="faqsTwo-2" className="accordion-collapse collapse" data-bs-parent="#faq-group-2">
                      <div className="accordion-body">
                        Các thông tin do bạn khai báo cho chúng tôi trong quá trình làm việc như: đăng ký tài khoản, liên hệ với chúng tôi... cũng sẽ được chúng tôi lưu trữ phục vụ
                        công việc chăm sóc khách hàng sau này.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <a className="accordion-button collapsed" data-bs-target="#faqsTwo-3" data-bs-toggle="collapse">
                        1.3. Thu thập thông tin thông qua việc đặt cookies:
                      </a>
                    </h2>
                    <div id="faqsTwo-3" className="accordion-collapse collapse" data-bs-parent="#faq-group-2">
                      <div className="accordion-body">
                        Như mọi website hiện đại khác, khi bạn truy cập website, chúng tôi (hoặc các công cụ theo dõi hoặc thống kê hoạt động của website do các đối tác cung cấp)
                        sẽ đặt một số File dữ liệu gọi là Cookies lên đĩa cứng hoặc bộ nhớ máy tính của bạn. Một trong số những Cookies này có thể tồn tại lâu để thuận tiện cho bạn
                        trong quá trình sử dụng, ví dụ như: lưu Email của bạn trong trang đăng nhập để bạn không phải nhập lại v.v…
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item" id="D3">
                    <h2 className="accordion-header">
                      <a className="accordion-button  collapsed" data-bs-target="#faqsTwo-4" data-bs-toggle="collapse">
                        1.4. Thu thập và lưu trữ thông tin trong quá khứ:
                      </a>
                    </h2>
                    <div id="faqsTwo-4" className="accordion-collapse collapse" data-bs-parent="#faq-group-2">
                      <div className="accordion-body">
                        Bạn có thể thay đổi thông tin cá nhân của mình bất kỳ lúc nào bằng cách sử dụng chức năng tương ứng. Tuy nhiên chúng tôi sẽ lưu lại những thông tin bị thay
                        đổi để chống các hành vi xóa dấu vết gian lận.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Điều 3: Sử dụng thông tin</h5>

                <div>
                  Thông tin thu thập được sẽ được chúng tôi sử dụng để: <br />
                  - Cung cấp các dịch vụ hỗ trợ & chăm sóc khách hàng.
                  <br /> - Thực hiện giao dịch thanh toán & gửi các thông báo trong quá trình giao dịch.
                  <br /> - Xử lý khiếu nại, thu phí & giải quyết sự cố.
                  <br /> - Ngăn chặn các hành vi có nguy cơ rủi ro, bị cấm hoặc bất hợp pháp và đảm bảo tuân thủ đúng chính sách “Thỏa thuận người dùng”.
                  <br /> - Đo đạc, tùy biến & cải tiến dịch vụ, nội dung và hình thức của website.
                  <br /> - Gửi bạn các thông tin về chương trình Marketing, các thông báo & chương trình khuyến mại.
                  <br /> - So sánh độ chính xác của thông tin cá nhân của bạn trong quá trình kiểm tra với bên thứ ba.
                </div>
              </div>
            </div>
            <div className="card" id="D5">
              <div className="card-body">
                <h5 className="card-title">Điều 5: Chia sẻ thông tin với bên thứ ba</h5>

                <div>
                  Chúng tôi sẽ không chia sẻ thông tin cá nhân, thông tin tài chính... của bạn cho các bên thứ 3 trừ khi được sự đồng ý của chính bạn hoặc khi chúng tôi buộc phải
                  tuân thủ theo các quy định pháp luật hoặc khi có yêu cầu từ cơ quan công quyền có thẩm quyền.
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card basic" id="D2">
              <div className="card-body">
                <h5 className="card-title">Điều 2: Lưu trữ & Bảo vệ thông tin</h5>
                <div>
                  Hầu hết các thông tin được thu thập sẽ được lưu trữ tại cơ sở dữ liệu của chúng tôi. Chúng tôi bảo vệ dữ liệu cá nhân của các bạn bằng các hình thức như: mật
                  khẩu, tường lửa, mã hóa cùng các hình thức thích hợp khác và chỉ cấp phép việc truy cập và xử lý dữ liệu cho các đối tượng phù hợp, ví dụ chính bạn hoặc các nhân
                  viên có trách nhiệm xử lý thông tin với bạn thông qua các bước xác định danh tính phù hợp. Mật khẩu của bạn được lưu trữ và bảo vệ bằng phương pháp mã hoá trong
                  cơ sở dữ liệu của hệ thống, vì thế nó rất an toàn. Tuy nhiên, chúng tôi khuyên bạn không nên dùng lại mật khẩu này trên các website khác. Mật khẩu của bạn là cách
                  duy nhất để bạn đăng nhập vào tài khoản thành viên của mình trong website này, vì thế hãy cất giữ nó cẩn thận. Trong mọi trường hợp bạn không nên cung cấp thông
                  tin mật khẩu cho bất kỳ người nào dù là người của chúng tôi, người của NukeViet hay bất kỳ người thứ ba nào khác trừ khi bạn hiểu rõ các rủi ro khi để lộ mật
                  khẩu. Nếu quên mật khẩu, bạn có thể sử dụng chức năng “Quên mật khẩu” trên website. Để thực hiện việc này, bạn cần phải cung cấp cho hệ thống biết tên thành viên
                  hoặc địa chỉ Email đang sử dụng của mình trong tài khoản, sau đó hệ thống sẽ tạo ra cho bạn mật khẩu mới và gửi đến cho bạn để bạn vẫn có thể đăng nhập vào tài
                  khoản thành viên của mình.
                </div>
              </div>
            </div>

            <div className="card" id="D4">
              <div className="card-body">
                <h5 className="card-title">Điều 4: Tiếp nhận thông tin từ các đối tác</h5>

                <div>
                  Khi sử dụng các công cụ giao dịch và thanh toán thông qua internet, chúng tôi có thể tiếp nhận thêm các thông tin về bạn như địa chỉ username, Email, số tài khoản
                  ngân hàng... Chúng tôi kiểm tra những thông tin này với cơ sở dữ liệu người dùng của mình nhằm xác nhận rằng bạn có phải là khách hàng của chúng tôi hay không
                  nhằm giúp việc thực hiện các dịch vụ cho bạn được thuận lợi. <br />
                  <br /> Các thông tin tiếp nhận được sẽ được chúng tôi bảo mật như những thông tin mà chúng tôi thu thập được trực tiếp từ bạn.
                </div>
              </div>
            </div>
            <div className="card" id="D6">
              <div className="card-body">
                <h5 className="card-title">Điều 6: Thay đổi chính sách bảo mật</h5>

                <div>
                  Chính sách Bảo mật này có thể thay đổi theo thời gian. Chúng tôi sẽ không giảm quyền của bạn theo Chính sách Bảo mật này mà không có sự đồng ý rõ ràng của bạn.
                  Chúng tôi sẽ đăng bất kỳ thay đổi Chính sách Bảo mật nào trên trang này và, nếu những thay đổi này quan trọng, chúng tôi sẽ cung cấp thông báo nổi bật hơn (bao
                  gồm, đối với một số dịch vụ nhất định, thông báo bằng email về các thay đổi của Chính sách Bảo mật).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showButton && (
        <button className="btn btn-primary btn-sm" onClick={scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <i className="bi bi-arrow-up-short"></i>
        </button>
      )}
    </>
  )
}

export default FAQ
