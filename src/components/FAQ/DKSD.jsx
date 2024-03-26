import { useEffect, useState } from "react";

function DKSD() {
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <>
            <div className="pagetitle">
                <h1>Điều khoản và điều kiện sử dụng</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">Home</a>
                        </li>
                        <li className="breadcrumb-item">F.Q.A</li>
                        <li className="breadcrumb-item active">
                            Điều khoản và điều kiện sử dụng
                        </li>
                    </ol>
                </nav>
            </div>

            <section className="section faq">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card basic">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Đây là các điều khoản và điều kiện áp dụng
                                    cho website này. Truy cập và sử dụng website
                                    tức là bạn đã đồng ý với các quy định này.
                                </h5>
                                <p>
                                    Cảm ơn bạn đã sử dụng. Xin vui lòng đọc các
                                    Điều khoản một cách cẩn thận, và liên hệ với
                                    chúng tôi nếu bạn có bất kỳ câu hỏi. Bằng
                                    việc truy cập hoặc sử dụng website của chúng
                                    tôi, bạn đồng ý bị ràng buộc bởi các Điều
                                    khoản và điều kiện sử dụng cũng như Chính
                                    sách bảo mật của chúng tôi. Nếu không đồng ý
                                    với các quy định này, bạn vui lòng ngưng sử
                                    dụng website.
                                </p>
                                <div>
                                    <a href="#D1">
                                        <h6>
                                            Điều 1: Điều khoản liên quan đến
                                            phần mềm vận hành website
                                        </h6>
                                    </a>
                                </div>

                                <div className="pt-2">
                                    <a href="#D2">
                                        <h6>
                                            Điều 2: Giới hạn cho việc sử dụng
                                            Website và các tài liệu trên website
                                        </h6>
                                    </a>
                                </div>

                                <div className="pt-2">
                                    <a href="#D3">
                                        <h6>Điều 3: Sử dụng thương hiệu</h6>
                                    </a>
                                </div>
                                <div className="pt-2">
                                    <a href="#D4">
                                        <h6>
                                            Điều 4: Các hành vi bị nghiêm cấm
                                        </h6>
                                    </a>
                                </div>
                                <div className="pt-2" id="D2">
                                    <a href="#D5">
                                        <h6>
                                            Điều 5: Các đường liên kết đến các
                                            website khác
                                        </h6>
                                    </a>
                                </div>
                                <div className="pt-2" id="D1">
                                    <a href="#D6">
                                        <h6>Điều 6: Từ chối bảo đảm</h6>
                                    </a>
                                </div>
                                <div className="pt-2">
                                    <a href="#D7">
                                        <h6>
                                            Điều 7: Luật áp dụng và cơ quan giải
                                            quyết tranh chấp
                                        </h6>
                                    </a>
                                </div>
                                <div className="pt-2">
                                    <a href="#D8">
                                        <h6>
                                            Điều 8: Thay đổi điều khoản và điều
                                            kiện sử dụng
                                        </h6>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 1: Điều khoản liên quan đến phần mềm
                                    vận hành website
                                </h5>

                                <div>
                                    - Website của chúng tôi sử dụng hệ thống
                                    NukeViet, là giải pháp về website/ cổng
                                    thông tin nguồn mở được phát hành theo giấy
                                    phép bản quyền phần mềm tự do nguồn mở “GNU
                                    General Public License” (viết tắt là GNU/GPL
                                    hay GPL) và có thể tải về miễn phí tại trang
                                    web www.nukeviet.vn.
                                    <br /> - Website này do chúng tôi sở hữu,
                                    điều hành và duy trì. NukeViet (hiểu ở đây
                                    là “hệ thống NukeViet” (bao gồm nhân hệ
                                    thống NukeViet và các sản phẩm phái sinh như
                                    NukeViet CMS, NukeViet Portal, NukeViet Edu
                                    Gate...), “www.nukeviet.vn”, “tổ chức
                                    NukeViet”, “ban điều hành NukeViet”,{" "}
                                    {`"Ban
                                    Quản Trị NukeViet"`}{" "}
                                    và nói chung là những gì liên quan đến
                                    NukeViet...) không liên quan gì đến việc
                                    chúng tôi điều hành website cũng như quy
                                    định bạn được phép làm và không được phép
                                    làm gì trên website này.
                                    <br id="D3" /> - Hệ thống NukeViet là bộ mã
                                    nguồn được phát triển để xây dựng các
                                    website/ cổng thông tin trên mạng. Chúng tôi
                                    (chủ sở hữu, điều hành và duy trì website
                                    này) không hỗ trợ và khẳng định hay ngụ ý về
                                    việc có liên quan đến NukeViet. Để biết thêm
                                    nhiều thông tin về NukeViet, hãy ghé thăm
                                    website của NukeViet tại địa chỉ:
                                    http://nukeviet.vn.
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 3: Sử dụng thương hiệu
                                </h5>

                                <div>
                                    - VINADES.,JSC, NukeViet và thương hiệu gắn
                                    với NukeViet (ví dụ NukeViet CMS, NukeViet
                                    Portal, NukeViet Edu Gate...), logo công ty
                                    VINADES thuộc sở hữu của Công ty cổ phần
                                    phát triển nguồn mở Việt Nam. <br id="D5" />{" "}
                                    - Những tên sản phẩm, tên dịch vụ khác, logo
                                    và/ hoặc những tên công ty được sử dụng
                                    trong Website này là những tài sản đã được
                                    đăng ký độc quyền và được giữ bản quyền bởi
                                    những người sở hữu và/ hoặc người cấp phép
                                    tương ứng.
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 5: Các đường liên kết đến các website
                                    khác
                                </h5>

                                <div>
                                    - Các website của các bên thứ ba (không phải
                                    các trang do chúng tôi quản lý) được liên
                                    kết đến hoặc từ website này{" "}
                                    {`("Các website
                                    khác")`}{" "}
                                    được điều hành và duy trì hoàn toàn độc lập
                                    bởi các bên thứ ba đó và không nằm trong
                                    quyền điều khiển và/hoặc giám sát của chúng
                                    tôi. Việc truy cập các website khác phải
                                    được tuân thủ theo các điều khoản và điều
                                    kiện quy định bởi ban điều hành của website
                                    đó.
                                    <br id="D6" /> - Chúng tôi không chịu trách
                                    nhiệm cho sự mất mát hoặc thiệt hại do việc
                                    truy cập và sử dụng các website bên ngoài,
                                    và bạn phải chịu mọi rủi ro khi truy cập các
                                    website đó.
                                    <br id="D7" /> - Không có nội dung nào trong
                                    Website này thể hiện như một sự đảm bảo của
                                    chúng tôi về nội dung của các website khác
                                    và các sản phẩm và/ hoặc các dịch vụ xuất
                                    hiện và/ hoặc được cung cấp tại các website
                                    khác.
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 7: Luật áp dụng và cơ quan giải quyết
                                    tranh chấp
                                </h5>

                                <div>
                                    - Các Điều Khoản và Điều Kiện này được điều
                                    chỉnh và giải thích theo luật của Việt Nam
                                    trừ khi có điều khoản khác được cung cấp
                                    thêm. Tất cả tranh chấp phát sinh liên quan
                                    đến website này và các Điều Khoản và Điều
                                    Kiện sử dụng này sẽ được giải quyết tại các
                                    tòa án ở Việt Nam. <br /> - Nếu một phần nào
                                    đó của các Điều Khoản và Điều Kiện bị xem là
                                    không có giá trị, vô hiệu, hoặc không áp
                                    dụng được vì lý do nào đó, phần đó được xem
                                    như là phần riêng biệt và không ảnh hưởng
                                    đến tính hiệu lực của phần còn lại. <br /> -
                                    Trong trường hợp có sự mâu thuẫn giữa bản
                                    Tiếng Anh và bản Tiếng Việt của bản Điều
                                    Khoản và Điều Kiện này, bản Tiếng Việt sẽ
                                    được ưu tiên áp dụng.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card basic" id="D2">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 2: Giới hạn cho việc sử dụng Website và
                                    các tài liệu trên website
                                </h5>
                                <div>
                                    - Tất cả các quyền liên quan đến tất cả tài
                                    liệu và thông tin được hiển thị và/ hoặc
                                    được tạo ra sẵn cho Website này (ví dụ như
                                    những tài liệu được cung cấp để tải về) được
                                    quản lý, sở hữu hoặc được cho phép sử dụng
                                    bởi chúng tôi hoặc chủ sở hữu tương ứng với
                                    giấy phép tương ứng. Việc sử dụng các tài
                                    liệu và thông tin phải được tuân thủ theo
                                    giấy phép tương ứng được áp dụng cho chúng.
                                    <br />
                                    - Ngoại trừ các tài liệu được cấp phép rõ
                                    ràng dưới dạng giấy phép tư liệu mở Creative
                                    Commons (gọi là giấy phép CC) cho phép bạn
                                    khai thác và chia sẻ theo quy định của giấy
                                    phép tư liệu mở, đối với các loại tài liệu
                                    không ghi giấy phép rõ ràng thì bạn không
                                    được phép sử dụng (bao gồm nhưng không giới
                                    hạn việc sao chép, chỉnh sửa toàn bộ hay một
                                    phần, đăng tải, phân phối, cấp phép, bán và
                                    xuất bản) bất cứ tài liệu nào mà không có sự
                                    cho phép trước bằng văn bản của chúng tôi
                                    ngoại trừ việc sử dụng cho mục đích cá nhân,
                                    nội bộ, phi thương mại.
                                    <br /> - Một số tài liệu hoặc thông tin có
                                    những điều khoản và điều kiện áp dụng riêng
                                    cho chúng không phải là giấy phép tư liệu
                                    mở, trong trường hợp như vậy, bạn được yêu
                                    cầu phải chấp nhận các điều khoản và điều
                                    kiện đó khi truy cập vào các tài liệu và
                                    thông tin này.
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 4: Các hành vi bị nghiêm cấm
                                </h5>

                                <div>
                                    Người truy cập website này không được thực
                                    hiện những hành vi dưới đây khi sử dụng
                                    website:
                                    <br /> - Xâm phạm các quyền hợp pháp (bao
                                    gồm nhưng không giới hạn đối với các quyền
                                    riêng tư và chung) của người khác.
                                    <br /> - Gây ra sự thiệt hại hoặc bất lợi
                                    cho người khác.
                                    <br /> - Làm xáo trộn trật tự công cộng.{" "}
                                    <br />- Hành vi liên quan đến tội phạm.{" "}
                                    <br />- Tải lên hoặc phát tán thông tin
                                    riêng tư của tổ chức, cá nhân khác mà không
                                    được sự chấp thuận của họ.
                                    <br /> - Sử dụng Website này vào mục đích
                                    thương mại mà chưa được sự cho phép của
                                    chúng tôi. <br />- Nói xấu, làm nhục, phỉ
                                    báng người khác.
                                    <br /> - Tải lên các tập tin chứa virus hoặc
                                    các tập tin bị hư mà có thể gây thiệt hại
                                    đến sự vận hành của máy tính khác. <br />-
                                    Những hoạt động có khả năng ảnh hưởng đến
                                    hoạt động bình thường của website.
                                    <br /> - Những hoạt động mà chúng tôi cho là
                                    không thích hợp.
                                    <br /> - Những hoạt động bất hợp pháp hoặc
                                    bị cấm bởi pháp luật hiện hành.
                                </div>
                            </div>
                        </div>
                        <div className="card" id="D6">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 6: Từ chối bảo đảm
                                </h5>

                                <div>
                                    NGOẠI TRỪ PHẠM VI BỊ CẤM THEO LUẬT PHÁP HIỆN
                                    HÀNH, CHÚNG TÔI SẼ: <br /> - KHÔNG CHỊU
                                    TRÁCH NHIỆM HAY BẢO ĐẢM, MỘT CÁCH RÕ RÀNG
                                    HAY NGỤ Ý, BAO GỒM SỰ BẢO ĐẢM VỀ TÍNH CHÍNH
                                    XÁC, MỨC ĐỘ TIN CẬY, HOÀN THIỆN, PHÙ HỢP CHO
                                    MỤC ĐÍCH CỤ THỂ, SỰ KHÔNG XÂM PHẠM QUYỀN CỦA
                                    BÊN THỨ 3 VÀ/HOẶC TÍNH AN TOÀN CỦA NỘI DỤNG
                                    WEBSITE NÀY, VÀ NHỮNG TUYÊN BỐ, ĐẢM BẢO CÓ
                                    LIÊN QUAN. <br /> - KHÔNG CHỊU TRÁCH NHIỆM
                                    CHO BẤT KỲ SỰ THIỆT HẠI HAY MẤT MÁT PHÁT
                                    SINH TỪ VIỆC TRUY CẬP VÀ SỬ DỤNG WEBSITE HAY
                                    VIỆC KHÔNG THỂ SỬ DỤNG WEBSITE. <br /> -
                                    CHÚNG TÔI CÓ THỂ THAY ĐỔI VÀ/HOẶC THAY THẾ
                                    NỘI DUNG CỦA WEBSITE NÀY, HOẶC TẠM HOÃN HOẶC
                                    NGƯNG CUNG CẤP CÁC DỊCH VỤ QUA WEBSITE NÀY
                                    VÀO BẤT KỲ THỜI ĐIỂM NÀO MÀ KHÔNG CẦN THÔNG
                                    BÁO TRƯỚC. CHÚNG TÔI SẼ KHÔNG CHỊU TRÁCH
                                    NHIỆM CHO BẤT CỨ THIỆT HẠI NÀO PHÁT SINH DO
                                    SỰ THAY ĐỔI HOẶC THAY THẾ NỘI DUNG CỦA
                                    WEBSITE.
                                </div>
                            </div>
                        </div>
                        <div className="card" id="D8">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Điều 8: Thay đổi điều khoản và điều kiện sử
                                    dụng
                                </h5>

                                <div>
                                    Điều khoản và điều kiện sử dụng có thể thay
                                    đổi theo thời gian. Chúng tôi bảo lưu quyền
                                    thay đổi hoặc sửa đổi bất kỳ điều khoản và
                                    điều kiện cũng như các quy định khác, bất cứ
                                    lúc nào và theo ý mình. Chúng tôi sẽ có
                                    thông báo trên website khi có sự thay đổi.
                                    Tiếp tục sử dụng trang web này sau khi đăng
                                    các thay đổi tức là bạn đã chấp nhận các
                                    thay đổi đó.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showButton && (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={scrollToTop}
                    style={{ position: "fixed", bottom: "20px", right: "20px" }}
                >
                    <i className="bi bi-arrow-up-short"></i>
                </button>
            )}
        </>
    );
}

export default DKSD;
