Danh mục Tổng hợp Trực quan hóa Dashboard (Master Catalog)
Tài liệu này cung cấp danh sách kiểm kê đầy đủ mọi biểu đồ, chỉ số và thông tin chi tiết có sẵn trong hệ thống, được phân loại theo Vai trò.
Chú thích Nguồn dữ liệu:
•	🟢 Dữ liệu thật (Real): Được tính toán trực tiếp từ cơ sở dữ liệu CSV học sinh.
•	🟡 Mô phỏng (Simulated): Dữ liệu giả lập dùng để minh họa giao diện (chưa tích hợp backend).
•	🔵 Lai (Hybrid): Kết hợp trung bình thực tế với xu hướng lịch sử giả lập.
________________________________________
1. Hiệu Trưởng (Principal)
Trọng tâm: Tổng quan Chiến lược & Công bằng Giáo dục.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
KPI: Điểm TB	Thẻ (Card)	🟢 Thật	Hiệu suất toàn trường (Toán + Đọc + Viết).
KPI: Tỷ lệ Đạt chuẩn	Thẻ (Card)	🟢 Thật	% học sinh đạt mức cơ bản 50/100.
KPI: Giỏi/Yếu	Thẻ (Card)	🟢 Thật	Số lượng học sinh xuất sắc và học sinh cần hỗ trợ.
Xu hướng Hiệu suất	Biểu đồ Miền	🟡 Mô phỏng	Diễn biến điểm số qua các tháng (Học kỳ 1).
Hiệu suất Khoa	Biểu đồ Cột	🔵 Lai	So sánh Khoa Tự nhiên vs Xã hội (TB Thật vs Mục tiêu).
Phân bố Chất lượng	Biểu đồ Tròn	🟢 Thật	Tỷ lệ học sinh Giỏi / Khá / Yếu.
Tỷ lệ Rớt theo Môn	Biểu đồ Cột	🟢 Thật	Số lượng học sinh trượt từng môn học.
Tác động GD Phụ huynh	Biểu đồ Cột	🟢 Thật	Chuyên sâu: Tương quan giữa trình độ học vấn cha mẹ và điểm số.

2. Ban Giám Hiệu (Vice Principal)
Trọng tâm: Giám sát, Kỷ luật & Sự công bằng.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
KPI: Giám sát	Thẻ (Cards)	🟡 Mô phỏng	Số lớp đạt chuẩn, GV xuất sắc, Vụ việc kỷ luật.
Yếu tố Gia đình	Biểu đồ Cột	🟢 Thật	Điểm trung bình nhóm theo trình độ phụ huynh.
Tương quan Rớt môn	Biểu đồ Kết hợp	🟢 Thật	Mối liên hệ giữa việc rớt môn Toán và điểm Đọc hiểu.
Chênh lệch Sắc tộc	Biểu đồ Cột	🟢 Thật	Chuyên sâu: So sánh hiệu suất giữa các nhóm sắc tộc.
DS Học sinh Cá biệt	Bảng (Table)	🟢 Thật	Danh sách hành động cho học sinh <50 điểm.

3. Trưởng Khoa (Head of Department)
Trọng tâm: Chất lượng Bộ môn & Hiệu quả Giảng dạy.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
KPI: Bộ môn	Thẻ (Cards)	🟢 Thật	Điểm trung bình riêng các môn Toán/Đọc/Viết.
Phổ điểm Chi tiết	Biểu đồ Cột	🟢 Thật	Biểu đồ tần suất điểm (0-20, 21-40...) từng môn.
Tiến độ Giảng dạy	Thanh (Bar)	🟡 Mô phỏng	Tỷ lệ hoàn thành giáo án theo lớp.
Đánh giá Giáo viên	Biểu đồ Rada	🟡 Mô phỏng	Đánh giá kỹ năng GV (Kỷ luật, Chuyên môn).
Tương quan Kỹ năng	Biểu đồ Tán xạ	🟢 Thật	Chuyên sâu: Tương quan năng lực Tự nhiên (Toán) vs Xã hội (Đọc).

4. Giáo Viên (Teacher)
Trọng tâm: Quản lý Lớp học.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
Mục tiêu Tuần	Văn bản	🟢 Thật (Suy luận)	Mục tiêu tự động dựa trên môn/học sinh yếu nhất.
Thống kê Lớp	Thẻ (Cards)	🟢 Thật	Sĩ số, Điểm TB lớp, Tỷ lệ nộp bài.
Phân bố Điểm Lớp	Cột Chồng	🟢 Thật	Phân khúc điểm số trong nội bộ lớp chủ nhiệm.
Lộ trình Học tập	Biểu đồ Đường	🟡 Mô phỏng	Diễn biến điểm trung bình lớp qua 5 tuần.
Sổ điểm Chi tiết	Bảng (Table)	🟢 Thật	Bảng điểm chi tiết kèm ghi chú môn yếu.

5. Phòng Đào Tạo (Academic Affairs)
Trọng tâm: Quy chế & Tín chỉ.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
Cảnh báo Học vụ	Văn bản	🟢 Thật	Số lượng sinh viên bị cảnh cáo (rớt 2+ môn).
Mức độ Cảnh báo	Thẻ (Cards)	🟢 Thật	Phân loại mức độ nghiêm trọng (Mức 1, 2, 3).
Môn có Tỷ lệ Rớt cao	Biểu đồ Cột	🟢 Thật	Xác định các môn "Sát thủ" (tỷ lệ rớt cao).
Xu hướng Đăng ký	Biểu đồ Miền	🟡 Mô phỏng	Xu hướng số lượng sinh viên nhập học 5 năm qua.
DS Buộc Thôi học	Bảng (Table)	🟢 Thật	Danh sách sinh viên nguy cơ cao bị đuổi học.


6. Khảo Thí (QA Testing)
Trọng tâm: Kiểm định Chất lượng Thi.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
Chỉ số Tin cậy	Thẻ (Cards)	🟡 Mô phỏng	Cronbach's Alpha, Độ khó (P), Độ phân cách (D).
Phân phối Điểm chuẩn	Biểu đồ Cột	🟢 Thật	Kiểm tra phân phối chuẩn (Bell Curve) của đề thi.
Phân tích Câu hỏi	Biểu đồ Tán xạ	🟡 Mô phỏng	Ma trận Độ khó vs Độ phân cách của câu hỏi.
So sánh Phân phối	Biểu đồ Đường	🟢 Thật	Chuyên sâu: So sánh đường cong phổ điểm 3 môn.
Kiểm toán Câu hỏi	Bảng (Table)	🟡 Mô phỏng	Danh sách các câu hỏi lỗi cần chỉnh sửa.
7. Công Tác Sinh Viên (Student Affairs)
Trọng tâm: Đời sống & Hỗ trợ.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
Nhân khẩu học	Biểu đồ Tròn	🟢 Thật	Cơ cấu sinh viên theo Sắc tộc/Vùng miền.
Tham gia Hoạt động	Biểu đồ Cột	🟡 Mô phỏng	Tỷ lệ tham gia CLB, Tình nguyện, Thể thao.
Nhân khẩu Rủi ro	Tròn/Cột	🟢 Thật	Chuyên sâu: Phân tích Giới tính/Gia đình nhóm học sinh yếu.
DS Hỗ trợ	Bảng (Table)	🔵 Lai	Danh sách SV yếu kết hợp trạng thái hỗ trợ giả lập.

 
8. Học Sinh (Student)
Trọng tâm: Tiến bộ Cá nhân.
Biểu đồ / Tính năng	Loại	Nguồn	Mục đích / Ý nghĩa
Lời khuyên Học tập	Văn bản	🟢 Thật (Suy luận)	Lời khuyên tự động dựa trên môn điểm thấp nhất.
Thống kê Cá nhân	Thẻ (Cards)	🔵 Lai	GPA thực tế, Xếp hạng lớp.
Rada Kỹ năng	Biểu đồ Rada	🔵 Lai	So sánh điểm cá nhân vs Trung bình lớp (Thật).
Lộ trình Điểm số	Biểu đồ Đường	🟡 Mô phỏng	Sự tiến bộ qua các bài kiểm tra (15p, 1 tiết, Cuối kỳ).
Bảng điểm	Bảng (Table)	🟢 Thật	Chi tiết điểm số các môn.

