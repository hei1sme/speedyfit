// src/pages/Guides.tsx
import { useState } from 'react';
import {
  ChefHat,
  Dumbbell,
  BarChart3,
  ShoppingCart,
  Hand,
  Apple,
  Ban,
  PartyPopper,
  Wind,
  Timer,
  Bike,
  Scale,
  Ruler,
  Camera,
  Brain,
  BookOpen,
} from 'lucide-react';

import { useLang } from '../contexts/LangContext';

type TabId = 'nutrition' | 'training' | 'tracking';

/* ─────────── Section wrapper ─────────── */
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={20} className="text-indigo-600 shrink-0" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-gray-700">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-gray-400 shrink-0 mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl glass p-4 ${className}`}>
      {children}
    </div>
  );
}

/* ═══════════════ TAB 1: NUTRITION ═══════════════ */
function NutritionGuide() {
  return (
    <div>
      {/* Overview */}
      <Section title="Tổng Quan CPB Flex 2.0" icon={ChefHat}>
        <InfoCard>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-gray-900">Người phụ trách:</span> Gia Hưng &nbsp;|&nbsp;
            <span className="font-semibold text-gray-900">Đối tượng:</span> Hưng & Nga &nbsp;|&nbsp;
            <span className="font-semibold text-gray-900">Mục tiêu:</span> Thâm hụt 500 kcal/ngày
          </p>
          <p className="text-sm text-gray-700">
            CPB Flex (<strong>Chicken – Potato/Rice – Broccoli</strong>) là phiên bản linh hoạt của chế độ ăn kiêng giới hạn thức ăn.
            Bằng cách lặp lại các nhóm thực phẩm lõi vào ban ngày, chúng ta loại bỏ <em>"sự mệt mỏi khi ra quyết định"</em>,
            kiểm soát triệt để calo và giữ đường huyết ổn định.
          </p>
          <p className="text-sm text-blue-700 font-medium mt-2">
            ⚡ Nấu nướng nhanh gọn, no lâu, và chừa quỹ calo cho các hoạt động buổi tối.
          </p>
        </InfoCard>
      </Section>

      {/* Grocery List */}
      <Section title="Danh Sách Đi Chợ Hàng Tuần" icon={ShoppingCart}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard>
            <h4 className="font-semibold text-indigo-700 mb-2">🥩 Protein (Ưu tiên nạc)</h4>
            <BulletList items={[
              '[Lõi] Ức gà nạc: ~1.5–2 kg/tuần',
              '[Linh hoạt] Trứng gà: 1–2 vỉ/tuần',
              '[Linh hoạt] Sữa chua Hy Lạp (Không đường): 500g',
              '[Linh hoạt] Thăn bò nạc / Cá phi lê: ~500g (đổi bữa)',
            ]} />
          </InfoCard>
          <InfoCard>
            <h4 className="font-semibold text-amber-700 mb-2">🍚 Tinh bột (Carbs)</h4>
            <BulletList items={[
              '[Hưng] Khoai tây: ~1.5–2 kg/tuần (no lâu nhất)',
              '[Nga] Gạo trắng: Mua theo túi tiêu chuẩn (dễ tiêu hóa)',
            ]} />
          </InfoCard>
          <InfoCard>
            <h4 className="font-semibold text-green-700 mb-2">🥦 Chất xơ (Rau củ)</h4>
            <BulletList items={[
              '[Lõi] Bông cải xanh & Cà rốt: ~1.5 kg',
              '[Linh hoạt] Cải thìa, Cải bắp, Bí ngòi: thay đổi theo ngày',
            ]} />
          </InfoCard>
          <InfoCard>
            <h4 className="font-semibold text-yellow-700 mb-2">🫒 Chất béo & Gia vị</h4>
            <BulletList items={[
              'Dầu Ô-liu Extra Virgin: tối đa 1 thìa canh (~15ml)/ngày',
              'Gia vị 0 calo: Muối, tiêu, tỏi, hành khô, ớt bột',
              'Sốt an toàn: Chanh, Sriracha, xì dầu, mù tạt vàng',
            ]} />
          </InfoCard>
        </div>
      </Section>

      {/* Portions */}
      <Section title="Định Lượng Bữa Ăn — Quy Tắc Bàn Tay" icon={Hand}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard className="border-l-4 border-l-indigo-500">
            <h4 className="font-bold text-indigo-700 mb-1">🥩 Đạm</h4>
            <p className="text-sm text-gray-700">~150–200g/bữa</p>
            <p className="text-xs text-gray-500 mt-1">👋 = 1 LÒNG BÀN TAY (cả rộng & dày)</p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-amber-500">
            <h4 className="font-bold text-amber-700 mb-1">🍚 Tinh bột</h4>
            <p className="text-sm text-gray-700">Hưng: ~200g khoai • Nga: ~130g cơm</p>
            <p className="text-xs text-gray-500 mt-1">✊ = 1 NẮM ĐẤM TAY</p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-green-500">
            <h4 className="font-bold text-green-700 mb-1">🥦 Chất xơ</h4>
            <p className="text-sm text-gray-700">~100–150g/bữa (không giới hạn trên)</p>
            <p className="text-xs text-gray-500 mt-1">🤲 = 2 VỐC TAY ĐẦY</p>
          </InfoCard>
        </div>
      </Section>

      {/* Fruit Matrix */}
      <Section title="Ma Trận Trái Cây" icon={Apple}>
        <div className="space-y-3">
          <InfoCard className="border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="bg-green-100 text-green-700">🟢 ĐÈN XANH</Badge>
              <span className="text-sm font-medium text-gray-700">Ăn thoải mái</span>
            </div>
            <p className="text-sm text-gray-600">
              Ổi (Vua giảm cân), Dưa hấu, Thanh long, Bưởi, Táo, Dâu tây
            </p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="bg-yellow-100 text-yellow-700">🟡 ĐÈN VÀNG</Badge>
              <span className="text-sm font-medium text-gray-700">Ăn có chiến thuật</span>
            </div>
            <p className="text-sm text-gray-600">
              Chuối (1 quả trước gym 45 phút) • Xoài, Dứa, Đu đủ (½ nắm tay sau bữa trưa)
            </p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="bg-red-100 text-red-700">🔴 ĐÈN ĐỎ</Badge>
              <span className="text-sm font-medium text-gray-700">Chuyển sang Cheat Meal</span>
            </div>
            <p className="text-sm text-gray-600">
              Sầu riêng, Mít, Vải, Nhãn, Bơ (Avocado)
            </p>
          </InfoCard>
        </div>
      </Section>

      {/* Blacklist */}
      <Section title="Lệnh Cấm Kỵ (6.5 ngày/tuần)" icon={Ban}>
        <InfoCard className="bg-red-50 border-red-200">
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li><strong>Cấm calo dạng lỏng:</strong> Nước ngọt (kể cả Diet), trà sữa, nước ép thêm đường.</li>
            <li><strong>Cấm chiên ngập dầu:</strong> Gà rán, khoai tây chiên, xào đẫm mỡ.</li>
            <li><strong>Cấm sốt béo/ngọt:</strong> Sốt mè rang, Mayonnaise, Ketchup, nước mắm pha đường.</li>
            <li><strong>Cấm đồ ngọt công nghiệp:</strong> Bánh kẹo, kem, snack.</li>
          </ol>
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800 font-medium">
            💧 BẮT BUỘC: Mỗi người uống đủ 2.5–3.0 Lít nước lọc/ngày
          </div>
        </InfoCard>
      </Section>

      {/* Cheat Meal */}
      <Section title="Protocol Chiều Thứ 6: Cheat Meal" icon={PartyPopper}>
        <InfoCard className="border-l-4 border-l-purple-500">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Mục đích:</strong> Giải tỏa tâm lý, nạp lại năng lượng sau 1 tuần.
          </p>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li><strong>Thời gian:</strong> Bữa tối Thứ 6 (Sáng & Trưa vẫn CPB Flex bình thường).</li>
            <li><strong>Tự do:</strong> Được ăn BẤT CỨ MÓN GÌ (Sushi, Lẩu, BBQ, cơm gia đình…).</li>
            <li className="font-semibold text-gray-800">Hàng rào bảo vệ (BẮT BUỘC):</li>
          </ol>
          <ul className="ml-6 mt-1 space-y-1.5 text-sm text-gray-600">
            <li>• <strong>Không kéo dài:</strong> Chỉ đúng 1 bữa, không "ăn cố" sang Thứ 7.</li>
            <li>• <strong>Đồ kho:</strong> KHÔNG chan nước kho vào cơm/khoai. Chỉ gắp thịt, rũ bỏ mỡ.</li>
            <li>• <strong>Nguyên tắc lấp đầy:</strong> Luôn có 1 đĩa rau luộc khổng lồ ăn kèm.</li>
          </ul>
        </InfoCard>
      </Section>
    </div>
  );
}

/* ═══════════════ TAB 2: TRAINING ═══════════════ */
function TrainingGuide() {
  return (
    <div>
      {/* Overview */}
      <InfoCard className="mb-6">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Chế độ:</span> Full-Body (3 Buổi Tạ + Tối đa 2 Buổi Cardio) &nbsp;|&nbsp;
          <span className="font-semibold text-gray-900">Thời lượng:</span> 60–75 phút &nbsp;|&nbsp;
          <span className="font-semibold text-gray-900">Ưu tiên:</span> Máy tập (Machines)
        </p>
      </InfoCard>

      {/* Breathing */}
      <Section title="Cơ Chế Hít Thở (SỐNG CÒN)" icon={Wind}>
        <InfoCard className="bg-blue-50 border-blue-200">
          <p className="text-base font-bold text-blue-900 mb-2">
            🧘 "Nặng Thở Ra (bằng miệng) — Nhẹ Hít Vào (bằng mũi)"
          </p>
          <p className="text-sm text-red-700 font-medium">
            ⛔ CẤM KỴ: Tuyệt đối không nín thở (gồng nghẽn cổ họng) khi rướn sức — bảo vệ áp lực ổ bụng, tránh hoa mắt chóng mặt.
          </p>
        </InfoCard>
      </Section>

      {/* Warm-up */}
      <Section title="Khởi Động — 5–10 Phút" icon={Timer}>
        <InfoCard>
          <BulletList items={[
            'Thiết bị: Máy chạy bộ (Treadmill) hoặc Xe đạp.',
            'Cách làm: Đi bộ tốc độ chậm (4–5), chỉnh độ dốc nhẹ.',
            'Nhịp thở: Hít thở sâu, đều đặn tự nhiên.',
          ]} />
        </InfoCard>
      </Section>

      {/* Resistance */}
      <Section title="Tập Kháng Lực Toàn Thân — 40–45 Phút" icon={Dumbbell}>
        <p className="text-xs text-gray-500 mb-3 italic">
          Ghi chú: Điền mức tạ (kg) vào buổi sau để biết đường tăng tạ.
        </p>
        <div className="space-y-3">
          {[
            {
              num: 1,
              muscle: 'ĐÙI & MÔNG',
              name: 'Máy Đạp Đùi (Leg Press)',
              breathOut: 'Đạp tung máy ra',
              breathIn: 'Từ từ co chân lại',
              sets: '3 Hiệp × 10–12 Lần',
            },
            {
              num: 2,
              muscle: 'LƯNG RỘNG',
              name: 'Máy Kéo Xô (Lat Pulldown)',
              breathOut: 'Kéo thanh đòn xuống ngực',
              breathIn: 'Nhả thanh đòn đi lên',
              sets: '3 Hiệp × 10–12 Lần',
            },
            {
              num: 3,
              muscle: 'NGỰC & VAI',
              name: 'Máy Đẩy Ngực Ngồi (Seated Chest Press)',
              breathOut: 'Đẩy tay cầm về phía trước',
              breathIn: 'Từ từ thu tay về',
              sets: '3 Hiệp × 10–12 Lần',
            },
            {
              num: 4,
              muscle: 'LƯNG GIỮA',
              name: 'Máy Chèo Thuyền (Seated Cable Row)',
              breathOut: 'Kéo tay cầm sát bụng',
              breathIn: 'Nhả tay cầm dãn về trước',
              sets: '3 Hiệp × 10–12 Lần',
            },
          ].map((ex) => (
            <InfoCard key={ex.num} className="border-l-4 border-l-indigo-400">
              <div className="flex items-baseline gap-2 mb-1">
                <Badge color="bg-indigo-100 text-indigo-700">{ex.num}</Badge>
                <span className="text-xs font-bold text-gray-500 uppercase">{ex.muscle}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{ex.name}</h4>
              <p className="text-xs text-gray-500">{ex.sets}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className="text-red-600">📤 THỞ RA: {ex.breathOut}</span>
                <span className="text-blue-600">📥 HÍT VÀO: {ex.breathIn}</span>
              </div>
            </InfoCard>
          ))}

          {/* Core */}
          <InfoCard className="border-l-4 border-l-amber-400">
            <div className="flex items-baseline gap-2 mb-1">
              <Badge color="bg-amber-100 text-amber-700">5</Badge>
              <span className="text-xs font-bold text-gray-500 uppercase">BÀI TẬP BỤNG (Core)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm">
              <div className="p-2 bg-indigo-50 rounded">
                <p className="font-semibold text-indigo-700">Hưng — Plank tĩnh</p>
                <p className="text-xs text-gray-600">Giữ tư thế, hít thở nông & đều. 3 Hiệp × 45 giây.</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded">
                <p className="font-semibold text-emerald-700">Nga — V-Crunches / Plank gối</p>
                <p className="text-xs text-gray-600">Cuộn người lên thở ra, hạ người hít vào. 3 Hiệp.</p>
              </div>
            </div>
          </InfoCard>
        </div>
      </Section>

      {/* Cardio */}
      <Section title="Cardio Đốt Mỡ — 10–15 Phút" icon={Bike}>
        <InfoCard className="bg-green-50 border-green-200">
          <BulletList items={[
            'Thiết bị: Xe đạp quạt gió (Air Bike / Assault Bike) hoặc Máy đạp xe tựa lưng.',
            'Hai người thay phiên đạp (hoặc 2 máy cạnh nhau).',
            'Nhịp độ: Zone 2 Cardio — hơi thở dốc nhẹ nhưng vẫn nói chuyện thành câu ngắn. KHÔNG đạp đến kiệt sức.',
          ]} />
        </InfoCard>
      </Section>
    </div>
  );
}

/* ═══════════════ TAB 3: TRACKING ═══════════════ */
function TrackingGuide() {
  return (
    <div>
      {/* Overview */}
      <InfoCard className="mb-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Mục tiêu:</strong> Giám sát tiến độ thực tế, tránh bẫy tâm lý khi cân nặng đứng im do tăng cơ,
          và cung cấp Data sạch cho hệ thống AI Prediction.
        </p>
      </InfoCard>

      {/* Daily Weight */}
      <Section title="Log Cân Nặng Hàng Ngày" icon={Scale}>
        <InfoCard className="border-l-4 border-l-blue-500">
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Tần suất:</strong> Mỗi buổi sáng.</p>
            <p><strong>Quy chuẩn Data sạch:</strong> Cân ngay sau khi thức dậy, sau khi đã đi vệ sinh và chưa ăn uống gì. Mặc quần áo mỏng nhẹ nhất.</p>
            <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-800">
              💡 <strong>Mindset:</strong> Chấp nhận dao động 0.5–1 kg/ngày do tích nước hoặc thức ăn chưa tiêu hóa.
              Chúng ta chỉ quan tâm đến <strong>Đường xu hướng (Trendline)</strong> của cả tuần/tháng.
            </div>
          </div>
        </InfoCard>
      </Section>

      {/* Body Measurements */}
      <Section title="Số Đo Hình Thể (Mỗi 2 Tuần)" icon={Ruler}>
        <InfoCard className="border-l-4 border-l-purple-500">
          <p className="text-sm text-gray-600 mb-3">
            Cơ bắp nặng hơn mỡ cùng thể tích. Khi tập tạ, <strong>quần áo rộng ra</strong> là bằng chứng đanh thép nhất.
          </p>
          <p className="text-xs text-gray-500 mb-3">📅 Nên đo vào sáng Chủ Nhật</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Vòng eo', desc: 'Ngang rốn', highlight: true },
              { label: 'Vòng bụng dưới', desc: 'Dưới rốn ~3cm', highlight: false },
              { label: 'Vòng mông', desc: 'Điểm lớn nhất', highlight: false },
              { label: 'Vòng đùi', desc: 'Đùi trên lớn nhất', highlight: false },
            ].map((m) => (
              <div
                key={m.label}
                className={`p-3 rounded-lg text-center ${
                  m.highlight ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className={`text-sm font-semibold ${m.highlight ? 'text-purple-700' : 'text-gray-800'}`}>{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                {m.highlight && <p className="text-[10px] text-purple-600 mt-1 font-medium">⭐ Quan trọng nhất</p>}
              </div>
            ))}
          </div>
        </InfoCard>
      </Section>

      {/* Progress Pictures */}
      <Section title="Nhật Ký Hình Ảnh (Hàng Tháng)" icon={Camera}>
        <InfoCard className="border-l-4 border-l-teal-500">
          <BulletList items={[
            'Tần suất: 1 tháng / 1 lần.',
            'Quy chuẩn: Cùng vị trí, cùng ánh sáng (VD: trước gương phòng tắm).',
            'Góc chụp: Trực diện (Front) — Ngang (Side) — Sau lưng (Back).',
            'Bảo mật: Lưu trữ local trên hệ thống Homelab cá nhân.',
          ]} />
        </InfoCard>
      </Section>

      {/* Bio-feedback */}
      <Section title="Phản Hồi Sinh Học (Hàng Tuần)" icon={Brain}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard className="border-l-4 border-l-indigo-400">
            <h4 className="font-semibold text-indigo-700 text-sm mb-1">😴 Chất lượng giấc ngủ (1–10)</h4>
            <p className="text-xs text-gray-600">Sáng dậy có tỉnh táo không? Rất quan trọng cho phục hồi cơ và não bộ.</p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-amber-400">
            <h4 className="font-semibold text-amber-700 text-sm mb-1">⚡ Mức năng lượng (1–10)</h4>
            <p className="text-xs text-gray-600">Có bị sập nguồn vào buổi chiều không?</p>
          </InfoCard>
          <InfoCard className="border-l-4 border-l-red-400">
            <h4 className="font-semibold text-red-700 text-sm mb-1">🦴 Tình trạng khớp/Lưng</h4>
            <p className="text-xs text-gray-600">Cột sống thắt lưng phản hồi tốt? Có đau mỏi bất thường?</p>
          </InfoCard>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function Guides() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<TabId>('nutrition');

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'nutrition', label: t('guides.tab1'), icon: ChefHat },
    { id: 'training', label: t('guides.tab2'), icon: Dumbbell },
    { id: 'tracking', label: t('guides.tab3'), icon: BarChart3 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={24} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('guides.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white/80 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'nutrition' && <NutritionGuide />}
      {activeTab === 'training' && <TrainingGuide />}
      {activeTab === 'tracking' && <TrackingGuide />}
    </div>
  );
}
