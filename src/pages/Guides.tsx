// src/pages/Guides.tsx
import { useState } from 'react';
import {
  ChefHat,
  Dumbbell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
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
import { TRAINING_WEEKS, type TrainingAccent } from '../content/trainingWeeks';

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

const LATEST_TRAINING_WEEK = TRAINING_WEEKS[TRAINING_WEEKS.length - 1].id;
type TrainingWeek = (typeof TRAINING_WEEKS)[number]['id'];

const ACCENT_STYLE: Record<TrainingAccent, {
  border: string;
  badge: string;
  block: string;
}> = {
  indigo: {
    border: 'border-l-indigo-400',
    badge: 'bg-indigo-100 text-indigo-700',
    block: 'bg-indigo-50 text-indigo-800',
  },
  emerald: {
    border: 'border-l-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700',
    block: 'bg-emerald-50 text-emerald-800',
  },
  amber: {
    border: 'border-l-amber-400',
    badge: 'bg-amber-100 text-amber-700',
    block: 'bg-amber-50 text-amber-800',
  },
  sky: {
    border: 'border-l-sky-400',
    badge: 'bg-sky-100 text-sky-700',
    block: 'bg-sky-50 text-sky-800',
  },
};

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
function TrainingGuide({ week }: { week: TrainingWeek }) {
  const plan = TRAINING_WEEKS.find((w) => w.id === week);
  if (!plan) return null;

  return (
    <div className="space-y-6">
      <InfoCard className="border-l-4 border-l-indigo-500">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge color="bg-indigo-100 text-indigo-700">Week {plan.id}</Badge>
          <p className="text-xs font-medium text-gray-500">{plan.mode} · {plan.duration}</p>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.title}</h3>
        <p className="text-sm text-gray-700">{plan.objective}</p>
      </InfoCard>

      {plan.caution && plan.caution.length > 0 && (
        <Section title="Lưu ý kỹ thuật" icon={Wind}>
          <InfoCard className="bg-red-50 border-red-200">
            <BulletList items={plan.caution} />
          </InfoCard>
        </Section>
      )}

      <Section title="Khởi động" icon={Timer}>
        <InfoCard>
          <BulletList items={plan.warmup} />
        </InfoCard>
      </Section>

      <Section title="Bài tập kháng lực" icon={Dumbbell}>
        <div className="space-y-3">
          {plan.exercises.map((ex) => {
            const accent = ACCENT_STYLE[ex.accent ?? 'indigo'];
            return (
              <InfoCard key={ex.id} className={`border-l-4 ${accent.border}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <Badge color={accent.badge}>{ex.id}</Badge>
                  <span className="text-xs font-bold text-gray-500 uppercase">{ex.muscle}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{ex.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-indigo-50 text-indigo-800">
                    <p className="font-semibold">Hưng</p>
                    <p>{ex.hungTarget}</p>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 text-emerald-800">
                    <p className="font-semibold">Nga</p>
                    <p>{ex.ngaTarget}</p>
                  </div>
                  <div className={`p-2 rounded ${accent.block}`}>
                    <p className="font-semibold">Volume</p>
                    <p>{ex.sets}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">{ex.breathCue}</p>
                <p className="text-xs text-gray-500">{ex.coachingNote}</p>
              </InfoCard>
            );
          })}
        </div>
      </Section>

      <Section title="Cardio kết thúc" icon={Bike}>
        <InfoCard className="bg-green-50 border-green-200">
          <BulletList items={plan.finisher} />
        </InfoCard>
      </Section>

      <Section title="Giãn cơ & Recovery" icon={Bike}>
        <InfoCard className="bg-sky-50 border-sky-200">
          <BulletList items={plan.recovery} />
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
  const [trainingWeek, setTrainingWeek] = useState<TrainingWeek>(LATEST_TRAINING_WEEK);
  const minTrainingWeek = TRAINING_WEEKS[0].id;
  const maxTrainingWeek = LATEST_TRAINING_WEEK;

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
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'training') {
                setTrainingWeek(LATEST_TRAINING_WEEK);
              }
            }}
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
      {activeTab === 'training' && (
        <div>
          <div className="glass rounded-2xl p-2 mb-6 flex items-center justify-between gap-2">
            <button
              onClick={() => setTrainingWeek((w) => (w === minTrainingWeek ? minTrainingWeek : (w - 1) as TrainingWeek))}
              disabled={trainingWeek === minTrainingWeek}
              className="min-h-10 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <div className="flex items-center gap-2">
              {TRAINING_WEEKS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setTrainingWeek(doc.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
                    trainingWeek === doc.id ? 'bg-indigo-500/20 text-indigo-700' : 'text-gray-500 hover:bg-white/50'
                  }`}
                >
                  {t('guides.week')} {doc.id}
                </button>
              ))}
              {trainingWeek === LATEST_TRAINING_WEEK && (
                <Badge color="bg-emerald-100 text-emerald-700">{t('guides.latest')}</Badge>
              )}
            </div>

            <button
              onClick={() => setTrainingWeek((w) => (w === maxTrainingWeek ? maxTrainingWeek : (w + 1) as TrainingWeek))}
              disabled={trainingWeek === maxTrainingWeek}
              className="min-h-10 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>

          <TrainingGuide week={trainingWeek} />
        </div>
      )}
      {activeTab === 'tracking' && <TrackingGuide />}
    </div>
  );
}
