export type TrainingAccent = 'indigo' | 'emerald' | 'amber' | 'sky';

export interface TrainingExercise {
  id: number;
  name: string;
  muscle: string;
  sets: string;
  hungTarget: string;
  ngaTarget: string;
  breathCue: string;
  coachingNote: string;
  accent?: TrainingAccent;
}

export interface TrainingWeekPlan {
  id: number;
  title: string;
  objective: string;
  mode: string;
  duration: string;
  warmup: string[];
  exercises: TrainingExercise[];
  finisher: string[];
  recovery: string[];
  caution?: string[];
}

export const TRAINING_WEEKS: TrainingWeekPlan[] = [
  {
    id: 1,
    title: 'Week 1 - Foundation Form',
    objective:
      'Làm quen nhịp tập, chuẩn hóa kỹ thuật, ưu tiên biên độ đúng trước khi tăng tạ.',
    mode: 'Full-Body (3 buổi tạ + tối đa 2 buổi cardio nhẹ)',
    duration: '60-75 phút',
    warmup: [
      '5-10 phút máy chạy bộ hoặc xe đạp ở cường độ nhẹ.',
      'Đi bộ tốc độ chậm (4-5), độ dốc nhẹ, giữ nhịp thở đều.',
      'Nguyên tắc thở: nặng thở ra, nhẹ hít vào.',
    ],
    exercises: [
      {
        id: 1,
        name: 'Máy Đạp Đùi (Leg Press)',
        muscle: 'Đùi & Mông',
        sets: '3 hiệp x 10-12 reps',
        hungTarget: 'Theo khả năng, ưu tiên form chuẩn',
        ngaTarget: 'Theo khả năng, ưu tiên trục gối ổn định',
        breathCue: 'Đạp ra: thở ra, thu vào: hít vào.',
        coachingNote: 'Không khóa khớp gối ở điểm cuối.',
        accent: 'indigo',
      },
      {
        id: 2,
        name: 'Máy Kéo Xô (Lat Pulldown)',
        muscle: 'Lưng rộng',
        sets: '3 hiệp x 10-12 reps',
        hungTarget: 'Theo khả năng',
        ngaTarget: 'Theo khả năng',
        breathCue: 'Kéo xuống: thở ra, nhả lên: hít vào.',
        coachingNote: 'Ưỡn ngực nhẹ, tránh giật lưng dưới.',
        accent: 'emerald',
      },
      {
        id: 3,
        name: 'Máy Đẩy Ngực (Seated Chest Press)',
        muscle: 'Ngực & Vai trước',
        sets: '3 hiệp x 10-12 reps',
        hungTarget: 'Theo khả năng',
        ngaTarget: 'Theo khả năng',
        breathCue: 'Đẩy ra: thở ra, thu về: hít vào.',
        coachingNote: 'Giữ vai thấp, không rụt cổ.',
        accent: 'sky',
      },
      {
        id: 4,
        name: 'Máy Chèo Thuyền (Seated Cable Row)',
        muscle: 'Lưng giữa',
        sets: '3 hiệp x 10-12 reps',
        hungTarget: 'Theo khả năng',
        ngaTarget: 'Theo khả năng',
        breathCue: 'Kéo vào bụng: thở ra, nhả ra trước: hít vào.',
        coachingNote: 'Khép bả vai ở cuối biên độ.',
        accent: 'amber',
      },
      {
        id: 5,
        name: 'Core Block (Plank / V-Crunch / Plank gối)',
        muscle: 'Core',
        sets: '3 hiệp',
        hungTarget: 'Plank tĩnh 45 giây',
        ngaTarget: 'V-Crunch hoặc plank gối theo form',
        breathCue: 'Nhịp thở nông, đều, không nín thở.',
        coachingNote: 'Giữ cột sống trung tính.',
        accent: 'indigo',
      },
    ],
    finisher: [
      'Cardio 10-15 phút: Air Bike hoặc xe đạp tựa lưng.',
      'Zone 2: hơi dốc nhẹ nhưng vẫn nói được câu ngắn.',
    ],
    recovery: ['Giãn cơ 5 phút sau tập, tập trung đùi trước/sau và bắp chân.'],
  },
  {
    id: 2,
    title: 'Week 2 - Progressive Overload',
    objective:
      'Hưng tăng tạ có kiểm soát và giảm reps; Nga ổn định form chân để bảo vệ gối, ưu tiên toning tay sau/đùi.',
    mode: 'Full-Body (3 buổi/tuần), cơ chế tập luân phiên (Shared Set)',
    duration: '60-75 phút',
    warmup: [
      '5-10 phút treadmill hoặc xe đạp.',
      'Nga: không chỉnh độ dốc máy chạy bộ.',
      'Vào tạ sau khi mạch tim và nhịp thở ổn định.',
    ],
    exercises: [
      {
        id: 1,
        name: 'Máy Đạp Đùi (Leg Press)',
        muscle: 'Đùi, Mông',
        sets: '3 hiệp',
        hungTarget: '110 kg (8-10 reps)',
        ngaTarget: '5 kg (12 reps)',
        breathCue: 'Đạp ra: thở ra.',
        coachingNote: 'Nga: không khóa gối, mũi chân và hướng gối đồng trục.',
        accent: 'indigo',
      },
      {
        id: 2,
        name: 'Máy Kéo Xô (Lat Pulldown)',
        muscle: 'Lưng rộng',
        sets: '3 hiệp',
        hungTarget: '40 kg (8-10 reps)',
        ngaTarget: '17.5-20 kg (8-10 reps)',
        breathCue: 'Kéo xuống ngực: thở ra.',
        coachingNote: 'Gồng lưng, không dùng đà lưng dưới.',
        accent: 'emerald',
      },
      {
        id: 3,
        name: 'Máy Ép/Đẩy Ngực (Pec Deck / Chest Press)',
        muscle: 'Ngực, Vai',
        sets: '3 hiệp',
        hungTarget: '57.5 kg (8-10 reps)',
        ngaTarget: '10 kg (10-12 reps)',
        breathCue: 'Ép/đẩy về trước: thở ra.',
        coachingNote: 'Mở đủ biên độ trước khi ép lại.',
        accent: 'sky',
      },
      {
        id: 4,
        name: 'Máy Chèo Thuyền (Seated Cable Row)',
        muscle: 'Lưng giữa',
        sets: '3 hiệp',
        hungTarget: '35-40 kg (8-12 reps)',
        ngaTarget: '10-15 kg (10-12 reps)',
        breathCue: 'Kéo vào bụng: thở ra.',
        coachingNote: 'Khép bả vai cuối rep.',
        accent: 'amber',
      },
      {
        id: 5,
        name: 'Kéo Cáp Tay Sau (Triceps Pushdown)',
        muscle: 'Bắp tay sau',
        sets: '3 hiệp',
        hungTarget: 'Tùy sức',
        ngaTarget: '10-11 kg (15-20 reps)',
        breathCue: 'Nhấn cáp xuống: thở ra.',
        coachingNote: 'Giữ cùi chỏ sát thân, chỉ cẳng tay chuyển động.',
        accent: 'indigo',
      },
      {
        id: 6,
        name: 'Core/Glute trên thảm',
        muscle: 'Bụng, Mông',
        sets: '3 hiệp',
        hungTarget: 'Plank 45-60 giây',
        ngaTarget: 'Glute Bridge 15-20 reps',
        breathCue: 'Nâng mông: thở ra, hạ xuống: hít vào.',
        coachingNote: 'Nga ưu tiên kiểm soát hông để bảo vệ gối.',
        accent: 'emerald',
      },
    ],
    finisher: [
      'Cardio 10-15 phút: Air Bike hoặc Elliptical ở Zone 2.',
      'Giữ tốc độ đều, không đạp đến kiệt sức.',
    ],
    recovery: [
      'Giãn cơ 5 phút cuối buổi.',
      'Nga: bắt buộc giãn bắp chân và đùi trước/sau, giữ 20-30 giây mỗi bên.',
    ],
    caution: ['Tuyệt đối không nín thở khi rướn sức.'],
  },
];
