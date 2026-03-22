/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home as HomeIcon, 
  ClipboardList, 
  ShieldCheck, 
  User, 
  Search, 
  Bell, 
  MapPin, 
  ChevronRight, 
  Timer, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Hospital, 
  UserSearch,
  Activity,
  Brain,
  Heart,
  Droplets,
  Stethoscope,
  Star,
  Thermometer,
  Pill,
  Wind,
  Plus,
  Edit3,
  Award,
  Wallet,
  Ticket,
  Package,
  History,
  ShoppingCart,
  XCircle,
  Info,
  Headphones,
  Lock,
  QrCode,
  MessageSquare,
  Share2,
  Scale,
  Waves,
  Microscope,
  FileText,
  BookOpen,
  Camera,
  ChevronLeft,
  X,
  Eye,
  PlusCircle,
  Calendar,
  Clock,
  MoreVertical,
  Save,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Helpers ---

const formatDateTimeToCN = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};

// --- Components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: HomeIcon },
    { id: 'records', label: '记录', icon: ClipboardList },
    { id: 'steward', label: '管家', icon: ShieldCheck },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-2 pb-6 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <tab.icon size={24} />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Types ---

type Page = 'home' | 'records' | 'steward' | 'profile' | 'doctor-list' | 'hospital-list' | 'specialty-detail' | 'service-detail' | 'service-order' | 'service-order-detail' | 'doctor-selection' | 'doctor-detail' | 'appointment-registration' | 'distribution-center' | 'withdraw' | 'withdrawal-records' | 'promotion-stats' | 'distribution-orders' | 'promotion-card' | 'bank-card' | 'patient-management' | 'add-member' | 'cart' | 'invoice-list' | 'invoice-form' | 'order-list' | 'feedback' | 'customer-service' | 'account-points' | 'account-coupons' | 'account-services' | 'record-hww' | 'record-blood-sugar' | 'record-blood-pressure' | 'record-blood-pressure-entry' | 'record-blood-oxygen' | 'record-blood-lipid' | 'record-blood-lipid-entry' | 'record-heart-rate' | 'record-diary-edit' | 'record-diary-detail' | 'record-medication-add' | 'payment-confirm' | 'payment-success' | 'payment-failure' | 'all-specialties';

interface PageState {
  id: Page;
  params?: any;
}

interface DiaryItem {
  title: string;
  date: string;
  desc: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface MedicationPlan {
  name: string;
  dosage: string;
  cost: string;
  startDate: string;
  endDate: string;
  images: string[];
  remarks?: string;
}

// --- Components ---

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center">
      {onBack && (
        <button onClick={onBack} className="p-1 -ml-1 text-blue-500 mr-2">
          <ChevronRight size={24} className="rotate-180" />
        </button>
      )}
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
    </div>
    <div className="w-8"></div>
  </header>
);

const DoctorListPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const [selectedDept, setSelectedDept] = useState('全部科室');
  const [sortOrder, setSortOrder] = useState('综合排序');
  const [showDeptFilter, setShowDeptFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const allDoctors = [
    { name: '张医生', title: '主任医师', hospital: '复旦大学附属医院', dept: '心内科', rating: 9.9, appointments: 512, exp: 20, tags: ['中医', '医保', '专家号'], desc: '擅长：各类心血管疾病诊断，尤其是高血压、冠心病及心律失常的中西医结合治疗...' },
    { name: '李医生', title: '副主任医师', hospital: '华山医院', dept: '皮肤科', rating: 9.7, appointments: 256, exp: 8, tags: ['医保'], desc: '擅长：各种常见皮肤病的诊治，对于湿疹、痤疮以及敏感性肌肤的调理有独特见解...' },
    { name: '王医生', title: '主治医师', hospital: '上海第一人民医院', dept: '骨科', rating: 9.8, appointments: 309, exp: 10, tags: ['中医', '医保'], desc: '擅长：骨科常见病多发病的诊治，尤其是脊柱外科及关节外科相关疾病...' },
    { name: '杨医生', title: '主任医师', hospital: '瑞金医院', dept: '肿瘤科', rating: 9.6, appointments: 420, exp: 18, tags: ['专家号'], desc: '擅长：各种恶性肿瘤的早期诊断与综合治疗，尤其在肺癌、胃癌领域有丰富经验...' },
    { name: '赵医生', title: '副主任医师', hospital: '中山医院', dept: '心内科', rating: 9.5, appointments: 180, exp: 12, tags: ['医保'], desc: '擅长：冠心病介入治疗，心力衰竭的规范化管理...' },
  ];

  const depts = ['全部科室', '心内科', '皮肤科', '骨科', '肿瘤科', '神经内科', '消化内科'];
  const sortOptions = ['综合排序', '评分最高', '评分最低'];

  const filteredDoctors = allDoctors
    .filter(doc => selectedDept === '全部科室' || doc.dept === selectedDept)
    .sort((a, b) => {
      if (sortOrder === '评分最高') return b.rating - a.rating;
      if (sortOrder === '评分最低') return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <Header title="选医生" onBack={onBack} />
      
      <div className="sticky top-[56px] z-30 bg-white border-b border-slate-50">
        <div className="flex">
          <button 
            onClick={() => {
              setShowDeptFilter(!showDeptFilter);
              setShowSortFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium border-r border-slate-50 transition-colors ${showDeptFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {selectedDept === '全部科室' ? '筛选科室' : selectedDept} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showDeptFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
          <button 
            onClick={() => {
              setShowSortFilter(!showSortFilter);
              setShowDeptFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium transition-colors ${showSortFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {sortOrder} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showSortFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
        </div>

        {/* Dropdowns */}
        <AnimatePresence>
          {showDeptFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeptFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {depts.map(dept => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept);
                        setShowDeptFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        selectedDept === dept ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {dept}
                      {selectedDept === dept && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {showSortFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSortFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOrder(option);
                        setShowSortFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        sortOrder === option ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {option}
                      {sortOrder === option && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <main className="p-4 space-y-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc, i) => (
          <div 
            key={i} 
            onClick={() => onNavigate('doctor-detail', doc)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-20 h-24 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-lg font-bold text-slate-900 truncate">{doc.name}</h2>
                  <span className="text-xs text-slate-500">{doc.title}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                  <span>{doc.hospital}</span>
                  <span>{doc.dept}</span>
                </div>
                <div className="h-px bg-slate-50 w-full my-2"></div>
                <div className="flex items-center gap-4 text-xs whitespace-nowrap">
                  <div className="flex items-center text-rose-500 font-bold">
                    <Award size={14} className="mr-0.5" />
                    <span>{doc.rating}</span>
                  </div>
                  <div className="text-slate-500">
                    预约量: <span className="text-rose-500 font-medium">{doc.appointments}人</span>
                  </div>
                  <div className="text-slate-500">
                    从业: <span className="text-rose-500 font-medium">{doc.exp}年</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 leading-relaxed line-clamp-2">
              {doc.desc}
            </div>
            <div className="mt-4 flex gap-2">
              {doc.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-md border border-blue-100">{tag}</span>
              ))}
            </div>
          </div>
        ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <UserSearch size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-400">暂无符合条件的医生</p>
          </div>
        )}
      </main>
    </div>
  );
};

const HospitalListPage = ({ onBack }: { onBack: () => void }) => {
  const [selectedDept, setSelectedDept] = useState('全部科室');
  const [sortOrder, setSortOrder] = useState('综合排序');
  const [showDeptFilter, setShowDeptFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const hospitals = [
    { name: '上海市第一人民医院', tags: ['三甲', '医保'], dist: '2.12km', count: 23, rating: 4.8 },
    { name: '上海瑞金医院', tags: ['三甲', '医保'], dist: '3.45km', count: 58, rating: 4.9 },
    { name: '上海中山医院', tags: ['三甲', '医保'], dist: '1.89km', count: 112, rating: 4.7 },
    { name: '上海仁济医院 (东院)', tags: ['三甲', '医保'], dist: '5.20km', count: 45, rating: 4.6 },
  ];

  const depts = ['全部科室', '肿瘤科', '神经内科', '神经外科', '心内科', '血液科', '肾病内科', '内分泌科', '消化内科', '呼吸科', '肝胆科'];
  const sortOptions = ['综合排序', '离我最近', '离我最远'];

  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <Header title="选医院" onBack={onBack} />
      
      <div className="sticky top-[56px] z-30 bg-white border-b border-slate-50">
        <div className="flex">
          <button 
            onClick={() => {
              setShowDeptFilter(!showDeptFilter);
              setShowSortFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium border-r border-slate-50 transition-colors ${showDeptFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {selectedDept === '全部科室' ? '筛选科室' : selectedDept} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showDeptFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
          <button 
            onClick={() => {
              setShowSortFilter(!showSortFilter);
              setShowDeptFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium transition-colors ${showSortFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {sortOrder} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showSortFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
        </div>

        {/* Dropdowns */}
        <AnimatePresence>
          {showDeptFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeptFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {depts.map(dept => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept);
                        setShowDeptFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        selectedDept === dept ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {dept}
                      {selectedDept === dept && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {showSortFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSortFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOrder(option);
                        setShowSortFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        sortOrder === option ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {option}
                      {sortOrder === option && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <main className="p-4 space-y-4">
        {hospitals.map((hosp, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex shadow-sm border border-slate-50 active:bg-slate-50 transition-colors">
            <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <Hospital size={40} className="text-slate-300" />
            </div>
            <div className="ml-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 truncate">{hosp.name}</h2>
                <div className="flex space-x-2 mt-1.5">
                  {hosp.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-bold rounded">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center text-xs text-blue-500">
                  <MapPin size={14} className="mr-0.5" />
                  <span>{hosp.dist}</span>
                </div>
                <div className="text-xs text-slate-400">
                  已约<span className="text-blue-500 font-semibold ml-0.5">{hosp.count}</span>人
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-4 pb-8 text-center text-slate-400 text-xs">没有更多医院了</div>
      </main>
    </div>
  );
};

const SpecialtyDetailPage = ({ specialty, onNavigate, onBack }: { specialty: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const diseases = ['手外科', '创伤骨科', '骨关节科', '矫形骨科', '足踝外科', '运动医学', '骨质疏松'];
  
  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <Header title={specialty.title} onBack={onBack} />
      <main className="px-4 py-4 space-y-6">
        <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm bg-blue-100">
          <img alt="Banner" className="w-full h-full object-cover" src={`https://picsum.photos/seed/${specialty.title}/600/300`} referrerPolicy="no-referrer" />
        </div>

        <section>
          <div className="flex items-center mb-4 relative w-max">
            <h2 className="text-lg font-bold text-slate-800 relative z-10">热门疾病</h2>
            <div className="absolute -right-2 top-0 w-6 h-6 bg-blue-100 rounded-full z-0"></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {diseases.map((d, i) => (
              <span key={i} className={`px-1 py-1.5 text-xs text-center rounded-full border ${
                i === 0 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-600 border-slate-200'
              }`}>
                {d}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-1 h-1 rounded-full bg-slate-200 overflow-hidden w-24">
            <div className="h-full bg-blue-500 w-1/2"></div>
          </div>
        </section>

        <section>
          <div className="flex items-center mb-4 relative w-max">
            <h2 className="text-lg font-bold text-slate-800 relative z-10">推荐医生</h2>
            <div className="absolute -right-2 top-0 w-6 h-6 bg-blue-100 rounded-full z-0"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('doctor-detail')}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-50 active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-end gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-800">医生姓名</h3>
                      <span className="text-rose-500 text-sm mb-[2px]">主治医师</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">上海医院名字 <span className="ml-2">科室</span></p>
                    <div className="border-b border-slate-50 mb-2"></div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center text-rose-500">
                        <Award size={14} className="mr-1" />
                        <span>9.8</span>
                      </div>
                      <div>预约量: <span className="text-rose-500">309人</span></div>
                      <div>从业: <span className="text-rose-500">10年</span></div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400 line-clamp-2">资深专家，从事临床工作多年，具有丰富的临床经验...</p>
                <div className="mt-3 text-sm text-slate-500">
                  <span className="text-rose-500 font-bold">★ 擅长:</span> 针对各类复杂病例提供精准诊疗方案，尤其在微创手术领域有深厚造诣...
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2.5 rounded-full font-medium shadow-md shadow-blue-500/10 active:scale-95 transition-transform">
                  去预约
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const ServiceDetailPage = ({ service, onNavigate, onBack, addToCart }: { service: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void; addToCart: (item: any) => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">{service.title}</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1">
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <div className="relative h-56 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
              <img 
                alt={service.title} 
                className="w-full h-full object-cover" 
                src={service.img || `https://picsum.photos/seed/${service.title}/600/400`} 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-start bg-gradient-to-r from-white/40 to-transparent">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">{service.title}安排协助</h2>
                <div className="inline-flex items-center bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-blue-600 w-fit border border-blue-100">
                  优选医院资源 · 协助{service.title}安排
                </div>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  减少等待时间<br/>提升就医效率
                </p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                <span className="text-xs text-slate-400 mt-1">销量 88</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-rose-500">¥</span>
                <span className="text-3xl font-bold text-rose-500">
                  {service.price === '面议' ? '57970' : service.price.replace('¥', '')}
                </span>
                {service.unit && <span className="text-xs text-slate-400 ml-1">{service.unit}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-bold text-slate-800">商品特色</h3>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">极速安排</h4>
                  <p className="text-sm text-slate-500 mt-1">专属顾问一对一服务，最快24小时内落实床位需求。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Hospital size={20} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">名医资源</h4>
                  <p className="text-sm text-slate-500 mt-1">覆盖全国300+重点三甲医院，优先对接科室主任级专家。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">流程代办</h4>
                  <p className="text-sm text-slate-500 mt-1">协助办理入院手续、病历复印、出院结算等繁琐流程。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-8 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <div className="flex items-center gap-4 pr-2">
            <button 
              onClick={() => onNavigate('customer-service')}
              className="flex flex-col items-center justify-center text-slate-500"
            >
              <Headphones size={22} />
              <span className="text-[10px] mt-0.5">在线客服</span>
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="flex flex-col items-center justify-center text-slate-500"
            >
              <ShoppingCart size={22} />
              <span className="text-[10px] mt-0.5">购物车</span>
            </button>
          </div>
          <div className="flex-1 flex gap-2 h-11">
            <button 
              onClick={() => addToCart(service)}
              className="flex-1 bg-lime-400 text-slate-900 font-bold rounded-full text-sm active:scale-95 transition-transform"
            >
              加入购物车
            </button>
            <button 
              onClick={() => onNavigate('service-order', service)}
              className="flex-1 bg-blue-500 text-white font-bold rounded-full text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
            >
              立即购买
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ServiceOrderPage = ({ service, onNavigate, onBack }: { service: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [selectedHospital, setSelectedHospital] = React.useState('');
  const [showCityPicker, setShowCityPicker] = React.useState(false);
  const [showHospitalPicker, setShowHospitalPicker] = React.useState(false);

  const cities = ['上海', '北京', '广州', '深圳', '杭州', '成都'];
  const hospitals = ['上海肿瘤医院', '瑞金医院', '中山医院', '华山医院', '仁济医院', '龙华医院'];

  const isMandatoryService = ['门诊陪诊', '检查加急', '住院协助', '手术加急'].includes(service.title);
  const isDateRequired = service.title === '门诊陪诊';

  const isFormValid = !isMandatoryService || (
    selectedCity && 
    selectedHospital && 
    (!isDateRequired || selectedDate)
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '请选择';
    const [year, month, day] = dateStr.split('-');
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center px-4 h-14 w-full">
          <button onClick={onBack} className="text-blue-600">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg text-blue-800">订单提交</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-40 space-y-6 max-w-md mx-auto">
        <section className="bg-white rounded-2xl p-5 space-y-5 shadow-sm border border-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            <h2 className="font-bold text-slate-800">请填写{service.title}服务信息</h2>
          </div>
          <div className="space-y-1">
            <div 
              onClick={() => setShowCityPicker(true)}
              className="flex items-center justify-between py-3 active:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
            >
              <label className="text-slate-500 font-medium">
                所在城市{isMandatoryService && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <div className="flex items-center text-slate-800 space-x-1">
                <span className={selectedCity ? 'text-slate-800 font-medium' : 'text-slate-300'}>
                  {selectedCity || '请选择'}
                </span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
            <div 
              onClick={() => setShowHospitalPicker(true)}
              className="flex items-center justify-between py-3 active:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
            >
              <label className="text-slate-500 font-medium">
                选择医院{isMandatoryService && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <div className="flex items-center text-slate-800 space-x-1">
                <span className={selectedHospital ? 'text-slate-800 font-medium' : 'text-slate-300'}>
                  {selectedHospital || '请选择'}
                </span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
            {service.title === '门诊陪诊' && (
              <div 
                className="relative flex items-center justify-between py-3 active:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              >
                <label className="text-slate-500 font-medium">
                  陪诊时间<span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="flex items-center text-slate-800 space-x-1">
                  <span className={selectedDate ? 'text-slate-800 font-medium' : 'text-slate-300'}>
                    {formatDate(selectedDate)}
                  </span>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
                <input 
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={selectedDate}
                />
              </div>
            )}
          </div>
        </section>

        {/* City Picker Modal */}
        <AnimatePresence>
          {showCityPicker && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCityPicker(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">选择城市</h3>
                  <button onClick={() => setShowCityPicker(false)} className="text-slate-400 p-1">
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl border font-medium transition-all flex items-center justify-between ${
                        selectedCity === city 
                          ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 active:bg-slate-100'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <CheckCircle2 size={18} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hospital Picker Modal */}
        <AnimatePresence>
          {showHospitalPicker && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHospitalPicker(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">选择医院</h3>
                  <button onClick={() => setShowHospitalPicker(false)} className="text-slate-400 p-1">
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {hospitals.map(hosp => (
                    <button
                      key={hosp}
                      onClick={() => {
                        setSelectedHospital(hosp);
                        setShowHospitalPicker(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl border font-medium transition-all flex items-center justify-between ${
                        selectedHospital === hosp 
                          ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 active:bg-slate-100'
                      }`}
                    >
                      <span>{hosp}</span>
                      {selectedHospital === hosp && <CheckCircle2 size={18} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <section className="bg-white rounded-2xl p-5 space-y-5 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
              <h2 className="font-bold text-slate-800">就诊人信息</h2>
            </div>
            <button 
              onClick={() => onNavigate('patient-management')}
              className="px-4 py-1.5 bg-slate-100 text-blue-800 rounded-full text-sm font-medium active:scale-95 transition-transform"
            >
              更换
            </button>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">姓名</span>
              <span className="text-slate-800 font-semibold">张*伟</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">联系方式</span>
              <span className="text-slate-800 font-semibold">181****9877</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">居民身份证</span>
              <span className="text-slate-800 font-semibold tracking-wider">419***********7678</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            <h2 className="font-bold text-slate-800">服务须知</h2>
          </div>
          <div className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl">
            <p>1. 请确保所填写的预约信息与就诊人身份信息真实有效。</p>
            <p className="mt-2">2. 服务项目一经确认并完成支付，如需取消请在服务开始前24小时提交申请。</p>
            <p className="mt-2">3. 陪诊服务不包含挂号费、医药费等医疗机构收取的费用。</p>
            <p className="mt-2">4. 如因医院不可抗力导致服务无法进行，我们将全额退还服务费用。</p>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white z-50 shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.08)] border-t border-slate-100 pb-8">
        <div className="flex items-center justify-between px-6 py-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">共1件</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xs text-slate-400">应付金额</span>
              <span className="text-blue-600 font-bold text-sm ml-1">¥</span>
              <span className="text-blue-600 font-extrabold text-2xl">
                {service.price === '面议' ? '9128' : service.price.replace('¥', '')}
              </span>
            </div>
          </div>
          <button 
            disabled={!isFormValid}
            onClick={() => onNavigate('payment-confirm', { ...service, hospital: selectedHospital, date: selectedDate })}
            className={`px-10 py-3.5 rounded-full font-bold shadow-lg transition-all ${
              isFormValid 
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-blue-500/20 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            去支付
          </button>
        </div>
      </footer>
    </div>
  );
};

const PaymentConfirmPage = ({ service, onNavigate, onBack }: { service: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const price = service.price === '面议' ? '9128' : service.price.replace('¥', '');
  
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 h-16 w-full border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95">
            <ChevronLeft size={24} className="text-slate-500" />
          </button>
          <h1 className="font-bold text-lg text-slate-900">支付确认</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 pb-40 px-5 max-w-md mx-auto">
        <section className="text-center mb-8">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">待支付金额</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-blue-600">¥</span>
            <span className="text-5xl font-extrabold tracking-tight text-slate-900">{price}</span>
          </div>
        </section>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="font-bold text-slate-900">订单摘要</h2>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-sm font-medium">服务名称</span>
              <span className="text-slate-800 text-sm font-bold text-right max-w-[180px]">{service.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm font-medium">订单编号</span>
              <span className="text-slate-800 text-sm font-medium">ORD-20260321-998</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm font-medium">下单时间</span>
              <span className="text-slate-800 text-sm font-medium">2026-03-21 15:14:22</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="font-bold text-slate-900">选择支付方式</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border-2 border-blue-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#07C160] shadow-sm">
                  <MessageSquare size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">微信支付</p>
                  <p className="text-[10px] text-slate-400">推荐使用，安全便捷</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md px-6 pt-4 pb-10 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-[32px]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-slate-500 font-bold">合计</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-blue-600">¥</span>
              <span className="text-2xl font-black text-blue-600">{price}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('payment-failure', service)}
              className="flex-1 h-14 bg-slate-100 text-slate-500 font-bold text-lg rounded-full active:scale-[0.98] transition-transform"
            >
              模拟失败
            </button>
            <button 
              onClick={() => onNavigate('payment-success', service)}
              className="flex-[2] h-14 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <span>确认支付</span>
              <Lock size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = ({ service, onNavigate }: { service: any; onNavigate: (id: Page, params?: any) => void }) => {
  const price = service.price === '面议' ? '9128' : service.price.replace('¥', '');

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 h-16 w-full shadow-sm">
        <button onClick={() => onNavigate('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
          <XCircle size={24} />
        </button>
        <h1 className="font-bold text-lg text-blue-700">支付成功</h1>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 pb-32 px-6 flex flex-col items-center max-w-md mx-auto min-h-screen">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 size={48} className="text-emerald-500" fill="currentColor" />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-2">支付成功</h2>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-bold text-xl text-blue-600">¥</span>
            <span className="font-extrabold text-5xl text-blue-600 tracking-tighter">{price}</span>
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-50 space-y-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">订单编号</span>
            <span className="font-bold text-slate-800">ORD-20260321-998</span>
          </div>
          <div className="h-px bg-slate-50 w-full"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">支付时间</span>
            <span className="font-bold text-slate-800">2026-03-21 15:15:12</span>
          </div>
        </div>

        <div className="w-full mt-10 space-y-4">
          <button 
            onClick={() => onNavigate('service-order-detail', service)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-8 rounded-full font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>查看订单详情</span>
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-transparent border-2 border-blue-600/20 text-blue-600 py-4 px-8 rounded-full font-bold hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            返回首页
          </button>
        </div>
      </main>
    </div>
  );
};

const PaymentFailurePage = ({ service, onNavigate }: { service: any; onNavigate: (id: Page, params?: any) => void }) => {
  const price = service.price === '面议' ? '9128' : service.price.replace('¥', '');

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 h-16 w-full shadow-sm">
        <button onClick={() => onNavigate('home')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
          <XCircle size={24} />
        </button>
        <h1 className="font-bold text-lg text-slate-900">支付结果</h1>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 pb-32 px-6 flex flex-col items-center max-w-md mx-auto min-h-screen">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
            <XCircle size={48} className="text-rose-500" fill="currentColor" />
          </div>
          <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight mb-2">支付失败</h1>
          <p className="text-slate-500 text-base font-medium opacity-80 mb-6">您的交易未能完成</p>
          <div className="inline-flex px-6 py-3 rounded-xl bg-slate-100">
            <span className="text-slate-900 text-2xl font-bold leading-none tracking-tight">¥ {price}</span>
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-50 mb-10">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">交易详情</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">订单编号</span>
              <span className="text-slate-800 text-sm font-bold">ORD-20260321-998</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 max-w-sm mx-auto">
          <button 
            onClick={() => onNavigate('payment-confirm', service)}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-base shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
          >
            重新支付
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="w-full py-4 rounded-full bg-slate-100 text-slate-600 font-bold text-base active:scale-[0.98] transition-transform"
          >
            返回首页
          </button>
        </div>
      </main>

      <footer className="mt-auto p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 opacity-40">
          <ShieldCheck size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">医佰岁健康 安全支付</span>
        </div>
      </footer>
    </div>
  );
};

const DoctorSelectionPage = ({ specialty, onNavigate, onBack }: { specialty: string; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const [selectedDept, setSelectedDept] = useState(specialty);
  const [sortOrder, setSortOrder] = useState('综合排序');
  const [showDeptFilter, setShowDeptFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const allDoctors = [
    {
      name: '王伟华',
      title: '主治医师',
      hospital: '上海市第一人民医院',
      dept: '呼吸科',
      rating: 9.8,
      appointments: 309,
      experience: 10,
      tags: ['中医', '医保', '专家号'],
      desc: '擅长：治疗呼吸系统常见病、多发病及疑难杂症，尤其是在慢性咳嗽、哮喘、慢阻肺等方面有丰富经验...',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqT2uMrVgJWFJcnjsDQncFshPW0tfaaAM3Uvw-NArmOjNQ898m77YIr2Pdswit8fiXxSAA48XqAfROVp1Res32Ihgccs9A_qWNpQp3Poxw-Kz4LSXsaDAtyFqEOa9jaPLQ3BcwwEKqTWIUNoqlJoMN_51E6CzJKZBp_QhNtxcD9lghzvLuR7yrjqjr7LMqVxDxA2stnmdd1cYm5IsWQJewQT3K1LyuhlH2bad2NmtV7oOipG8J3ZKCC3OUu1eugJhw26TrIjRwMDom'
    },
    {
      name: '李向东',
      title: '主任医师',
      hospital: '上海交通大学医学院附属瑞金医院',
      dept: '消化内科',
      rating: 9.9,
      appointments: 512,
      experience: 22,
      tags: ['医保', '名医推荐'],
      desc: '擅长：胃癌、结直肠癌等消化道肿瘤的综合诊治，尤其在腹腔镜微创手术方面有深厚造诣...',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVjwc4BMRiirY7crWz6-isppSyOcKGLrLezca9frBB641kv2J7Aaauqj6r3yTJQKq66nEfMebEqOtrtwYH3Tu51JvScOSEo8gUwlmZYPwzrxulH-Y7G7BzgimafY5f00EFOCUhiKL6AYNvgI4sH9ELir_AT2q5g8Ikk4XZFCnn3jwPVA6fW1ym8DDcjr7omXw-lJMBWGths6hBN3gtWXCRYttgLMYJ7TK-9U3-KiVLY4sEj0h1vf86N1wEyWkPa67l9lMkWTGPBLpp'
    },
    {
      name: '赵晓彤',
      title: '副主任医师',
      hospital: '复旦大学附属肿瘤医院',
      dept: '肿瘤科',
      rating: 9.7,
      appointments: 188,
      experience: 15,
      tags: ['医保'],
      desc: '擅长：肺癌、乳腺癌的靶向治疗与免疫治疗，专注于中晚期肿瘤的个体化精准治疗方案...',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8C7kLzpnnb_DJ0fTUwQ0rBC9CaQC9Y_FlhiCz2wYAaYylye041lOPZb6JbO5KqZrw5C2BmJbOO4WHDaeCtTTQMaSlR790wIT6c73kjvT47AfNhF2Qh4F3BosUPzRryVpwu9Gm6WY9qTSJxhZybLozbwW--U43U_Ig0beEadgpCMhAXbpLp3D_7TBPjDnVW5n2Ndz12tL08QvKNoo1_Bm-2OwsuoYBg2d7B9biDcZFr91VrTM6fe3s5QVwYEjlVuucB4NujYQVT5H5'
    },
    {
      name: '张医生',
      title: '主任医师',
      hospital: '复旦大学附属医院',
      dept: '心内科',
      rating: 9.9,
      appointments: 512,
      experience: 20,
      tags: ['中医', '医保', '专家号'],
      desc: '擅长：各类心血管疾病诊断，尤其是高血压、冠心病及心律失常的中西医结合治疗...',
      img: 'https://picsum.photos/seed/doc1/200/200'
    },
    {
      name: '刘主任',
      title: '主任医师',
      hospital: '华山医院',
      dept: '神经外科',
      rating: 9.8,
      appointments: 450,
      experience: 25,
      tags: ['名医', '专家号'],
      desc: '擅长：颅脑肿瘤、脑血管病的显微外科治疗，对神经外科疑难杂症有丰富诊治经验...',
      img: 'https://picsum.photos/seed/doc2/200/200'
    }
  ];

  const depts = ['全部科室', '肿瘤科', '神经内科', '神经外科', '心内科', '血液科', '肾病内科', '内分泌科', '消化内科', '呼吸科', '肝胆科'];
  const sortOptions = ['综合排序', '评分最高', '评分最低'];

  const filteredDoctors = allDoctors
    .filter(doc => selectedDept === '全部科室' || doc.dept === selectedDept)
    .sort((a, b) => {
      if (sortOrder === '评分最高') return b.rating - a.rating;
      if (sortOrder === '评分最低') return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">{selectedDept}</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="flex border-t border-slate-50">
          <button 
            onClick={() => {
              setShowDeptFilter(!showDeptFilter);
              setShowSortFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium border-r border-slate-50 transition-colors ${showDeptFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {selectedDept === '全部科室' ? '筛选科室' : selectedDept} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showDeptFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
          <button 
            onClick={() => {
              setShowSortFilter(!showSortFilter);
              setShowDeptFilter(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm font-medium transition-colors ${showSortFilter ? 'text-blue-600' : 'text-slate-600'}`}
          >
            {sortOrder} 
            <ChevronRight size={14} className={`transition-transform duration-200 ${showSortFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
        </div>

        {/* Dropdowns */}
        <AnimatePresence>
          {showDeptFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeptFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {depts.map(dept => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept);
                        setShowDeptFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        selectedDept === dept ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {dept}
                      {selectedDept === dept && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {showSortFilter && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSortFilter(false)}
                className="fixed inset-0 bg-black/20 z-10"
              />
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white z-20 overflow-hidden shadow-xl rounded-b-2xl"
              >
                <div className="flex flex-col">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOrder(option);
                        setShowSortFilter(false);
                      }}
                      className={`py-4 px-6 text-left text-sm border-b border-slate-50 last:border-none transition-colors flex justify-between items-center ${
                        sortOrder === option ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600 active:bg-slate-50'
                      }`}
                    >
                      {option}
                      {sortOrder === option && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="p-4 space-y-4 pb-10">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc, i) => (
            <section 
              key={i} 
              onClick={() => onNavigate('doctor-detail', doc)}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-50 flex gap-4 active:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <img alt={doc.name} className="w-full h-full object-cover" src={doc.img} referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-bold text-slate-800 inline-block mr-2">{doc.name}</h2>
                    <span className="text-xs text-slate-400">{doc.title}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{doc.hospital} {doc.dept}</p>
                <div className="flex items-center mt-2 space-x-4 text-[11px]">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star size={12} className="fill-current mr-0.5" />
                    {doc.rating}
                  </div>
                  <div className="text-slate-400">预约量: <span className="text-rose-500">{doc.appointments}人</span></div>
                  <div className="text-slate-400">从业: <span className="text-rose-500">{doc.experience}年</span></div>
                </div>
                <div className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.desc}
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="flex flex-wrap gap-2 mr-2">
                    {doc.tags.map((tag, j) => (
                      <span key={j} className={`px-2 py-0.5 text-[10px] rounded border ${
                        tag === '中医' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tag === '医保' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="flex-shrink-0 whitespace-nowrap bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full font-medium shadow-sm active:opacity-80 transition-opacity">
                    立即挂号
                  </button>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <UserSearch size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-400">暂无符合条件的医生</p>
          </div>
        )}
      </main>
    </div>
  );
};

const DoctorDetailPage = ({ doctor, onNavigate, onBack }: { doctor: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  // Mock data based on the screenshot
  const doc = doctor || {
    name: '杨维华',
    dept: '儿科',
    title: '主任医师',
    rating: '98%',
    appointments: 184,
    followers: 249,
    bio: '杨维华，女，科主任医师，原湖南任医师，教授、博士，二海徐浦中医医院儿科主任，曾任附属医院儿科主学本科毕业后从事儿科临床工作多年。',
    specialty: '发热、咽炎、扁桃体炎、淋巴结炎、咳嗽、肺炎、小儿多动症、小儿自闭症、汗症、癫痫、厌食、疳积、佝偻病、腹泻、肾炎等中医儿科疾病的治疗。',
  };

  const schedule = [
    { date: '03.04', day: '周四', am: '预约', pm: '预约' },
    { date: '03.05', day: '周五', am: '无号', pm: '无号' },
    { date: '03.06', day: '周六', am: '无号', pm: '预约' },
    { date: '03.07', day: '周日', am: '预约', pm: '无号' },
    { date: '03.08', day: '周一', am: '预约', pm: '预约' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 px-4 h-14 flex items-center justify-between border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">详情</h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-md mx-auto px-5 py-6 space-y-8">
        <section className="flex items-center gap-6">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
            {doc.img ? (
              <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={48} className="text-slate-400" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{doc.name}</h2>
              <span className="text-slate-500 text-sm">{doc.dept}</span>
            </div>
            <p className="text-slate-600 font-medium">{doc.title}</p>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4 border-y border-slate-100 py-6">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{doc.rating.toString().includes('%') ? doc.rating : doc.rating + '%'}</p>
            <p className="text-xs text-slate-500 mt-1">好评率</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-xl font-bold text-slate-900">{doc.appointments}</p>
            <p className="text-xs text-slate-500 mt-1">预约量</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{doc.followers || 249}</p>
            <p className="text-xs text-slate-500 mt-1">关注量</p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="leading-relaxed">
              <span className="text-blue-500 font-bold mr-2">简介:</span>
              <span className="text-slate-600">{doc.bio || doc.desc}</span>
            </p>
          </div>
          <div>
            <p className="leading-relaxed">
              <span className="text-blue-500 font-bold mr-2">擅长:</span>
              <span className="text-slate-600">{doc.specialty || doc.desc}</span>
            </p>
          </div>
        </section>

        <div className="space-y-10">
          <AppointmentSection 
            title="专家门诊预约协助" 
            priceRange="30-60元" 
            location="上海复旦肿瘤医院" 
            schedule={schedule}
            onNavigate={onNavigate}
            doctor={doc}
          />
          <AppointmentSection 
            title="特需门诊预约协助" 
            priceRange="300-800元" 
            location="上海复旦肿瘤医院" 
            schedule={schedule}
            onNavigate={onNavigate}
            doctor={doc}
          />
        </div>
      </main>
    </div>
  );
};

const AppointmentSection = ({ title, priceRange, location, schedule, onNavigate, doctor }: any) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-blue-500/20 rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-1 rounded">医院费用参考：{priceRange}</span>
    </div>
    <div className="flex items-center gap-3 mb-6 text-sm">
      <span className="text-slate-500">出诊地点:</span>
      <span className="font-medium text-slate-700">{location}</span>
      <div className="flex gap-1.5 ml-auto">
        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">可预约</span>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100">医保</span>
      </div>
    </div>
    
    <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-2 text-center mb-6 overflow-x-auto pb-2">
      <div className="h-10"></div>
      {schedule.map((s: any, i: number) => (
        <div key={i} className="text-slate-400 text-[10px] leading-tight">
          {s.date}<br/>{s.day}
        </div>
      ))}
      
      <div className="text-left font-medium text-slate-700 text-sm flex items-center">上午</div>
      {schedule.map((s: any, i: number) => (
        <div key={i} className="flex justify-center">
          <StatusBadge status={s.am} onClick={() => onNavigate('appointment-registration', { doctor, date: s.date, day: s.day, time: '上午', service: title })} />
        </div>
      ))}
      
      <div className="text-left font-medium text-slate-700 text-sm flex items-center">下午</div>
      {schedule.map((s: any, i: number) => (
        <div key={i} className="flex justify-center">
          <StatusBadge status={s.pm} onClick={() => onNavigate('appointment-registration', { doctor, date: s.date, day: s.day, time: '下午', service: title })} />
        </div>
      ))}
    </div>
    <div className="h-px bg-slate-100"></div>
  </section>
);

const StatusBadge = ({ status, onClick }: { status: string; onClick?: () => void }) => {
  if (status === '预约') {
    return (
      <button 
        onClick={onClick}
        className="w-11 h-11 rounded-full bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-90 transition-transform flex items-center justify-center"
      >
        预约
      </button>
    );
  }
  return (
    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 text-xs font-medium flex items-center justify-center">
      无号
    </div>
  );
};

const AppointmentRegistrationPage = ({ params, onNavigate, onBack }: { params: any; onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const { doctor, date, day, time, service, selectedPatient: paramPatient } = params || {};
  const [selectedPatient, setSelectedPatient] = useState<any>(paramPatient || null);

  useEffect(() => {
    if (paramPatient) {
      setSelectedPatient(paramPatient);
    }
  }, [paramPatient]);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title="预约挂号" onBack={onBack} />
      
      <main className="p-4 space-y-4">
        {/* Doctor Info Section */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-slate-900">{doctor?.name || '医生名字'}</h2>
            <span className="text-sm font-medium text-slate-500">{doctor?.title || '主任医师'}</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-slate-400 w-16">出诊科室:</span>
              <span className="text-slate-700">{doctor?.dept || '肿瘤科'}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-slate-400 w-16">出诊医院:</span>
              <span className="text-slate-700">{doctor?.hospital || '上海复旦大学附属肿瘤医院'}</span>
            </p>
          </div>
        </section>

        {/* Service Selection Section */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="relative inline-block">
            <h3 className="text-lg font-bold text-slate-900 relative z-10">{service || '专家门诊协助'}</h3>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-100 rounded-full -z-10"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-slate-700">单次协调服务费：</span>
              </div>
              <span className="text-orange-500 font-bold">￥999</span>
            </div>
            
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                <span className="text-slate-700">抵扣套餐积分：</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-orange-500 font-medium">- 1</span>
                <span className="text-orange-500 text-sm">分</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-xl">
            <p className="text-xs text-blue-500 leading-relaxed">
              请携带有效证件按提示时间前往医院门诊。本平台提供就医协调与流程协助支持，服务费用将由平台统一收取。
            </p>
          </div>

          <div className="text-sm leading-relaxed">
            <span className="text-rose-500 font-bold mr-1">★ 擅长：</span>
            <span className="text-slate-500">
              {doctor?.specialty || '使用什么治疗什么，尤其是就是觉得好的环境大家记得记看到科技惊险刺激大咖很回去好好回家后哦i佛hi'}
            </span>
          </div>

          <div className="h-px bg-slate-50"></div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">医院地址</h4>
              <p className="text-xs text-slate-400 mt-1">上海浦东新区上南路4091号</p>
            </div>
            <button className="bg-blue-400 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm active:opacity-80 transition-opacity">
              <MapPin size={14} />
              <span>导航</span>
            </button>
          </div>
        </section>

        {/* Information Entry Section */}
        <section className="space-y-4">
          <div className="relative inline-block">
            <h3 className="text-lg font-bold text-slate-900 relative z-10">信息填写</h3>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-100 rounded-full -z-10"></div>
          </div>

          <div className="bg-slate-100 p-4 rounded-full flex items-center gap-4">
            <span className="text-slate-500 font-medium min-w-[70px]">就诊时间</span>
            <div className="w-px h-4 bg-slate-300"></div>
            <span className="text-slate-800 font-bold">2026-{date || '03-07'} {time || '上午'}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <div className="relative inline-block">
                <h3 className="text-lg font-bold text-slate-900 relative z-10">就诊人信息</h3>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-100 rounded-full -z-10"></div>
              </div>
              <span className="text-rose-500 font-bold">*</span>
            </div>
            
            {selectedPatient ? (
              <div 
                onClick={() => onNavigate('patient-management', { mode: 'selection', prevParams: params })}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selectedPatient.name}</p>
                    <p className="text-xs text-slate-400">{selectedPatient.relation} · {selectedPatient.phone}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('patient-management', { mode: 'selection', prevParams: params })}
                className="w-full bg-white border border-dashed border-slate-300 py-10 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 active:bg-slate-50 transition-colors"
              >
                <Plus size={24} className="text-slate-200" />
                <span className="font-medium">选择就诊人</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="relative inline-block">
              <h3 className="text-lg font-bold text-slate-900 relative z-10">疾病描述</h3>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-100 rounded-full -z-10"></div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 focus-within:border-blue-500/30 transition-all">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[120px] placeholder-slate-300 resize-none" 
                placeholder="请描述就诊人的疾病/病症..."
              />
              <div className="mt-4">
                <button className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 active:scale-95 transition-transform">
                  <Camera size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-slate-400 leading-relaxed px-1">
          温馨提示:请上传您以往的病例诊断报告或检查报告等信息，有助于医生全面了解您的病情。
        </p>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <button 
          onClick={() => onNavigate('payment-confirm', { type: 'appointment', doctor, service })}
          className="w-full bg-blue-600 text-white font-bold h-14 rounded-full shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          确认
        </button>
      </footer>
    </div>
  );
};

const HeightWeightWaistPage = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'height' | 'waist'>('weight');
  
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="身高体重腰围" onBack={onBack} />
      
      <main className="p-4 space-y-6">
        <nav className="flex p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'weight', label: '体重' },
            { id: 'height', label: '身高' },
            { id: 'waist', label: '腰围' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">记录列表</span>
            <span className="text-xs text-blue-600 font-bold">查看趋势</span>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800">90.0</span>
                <span className="text-sm font-medium text-slate-400">{activeTab === 'weight' ? 'kg' : activeTab === 'height' ? 'cm' : 'cm'}</span>
              </div>
              <div className="flex items-center gap-3">
                <time className="text-xs text-slate-400">2026-03-09 09:46:21</time>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-300">89.5</span>
                <span className="text-sm font-medium text-slate-300">{activeTab === 'weight' ? 'kg' : activeTab === 'height' ? 'cm' : 'cm'}</span>
              </div>
              <div className="flex items-center gap-3">
                <time className="text-xs text-slate-300">2026-03-08 10:20:15</time>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Plus size={20} />
            <span>添加{activeTab === 'weight' ? '体重' : activeTab === 'height' ? '身高' : '腰围'}记录</span>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <Info size={20} className="text-blue-500 shrink-0" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <p className="font-bold mb-1">小贴士</p>
            建议每天在相同的时间段（如清晨空腹）进行测量，以获得更准确的身体成分趋势。
          </div>
        </div>
      </main>
    </div>
  );
};

const EmptyRecordPage = ({ title, onBack }: { title: string; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300 flex flex-col">
      <Header title={title} onBack={onBack} />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 text-slate-200">
          <XCircle size={100} strokeWidth={1} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">你还未记录</h2>
        <p className="text-slate-400 mb-10">快去记录吧~</p>
        <button className="w-full max-w-xs py-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-bold active:scale-95 transition-transform">
          添加记录
        </button>
      </main>
    </div>
  );
};

const BloodPressureListPage = ({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="血压记录" onBack={onBack} />
      
      <main className="p-4 space-y-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">记录列表</span>
            <span className="text-xs text-blue-600 font-bold">查看趋势</span>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-800">120/80</span>
                  <span className="text-sm font-medium text-slate-400">mmHg</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold mt-1">正常</span>
              </div>
              <div className="flex items-center gap-3">
                <time className="text-xs text-slate-400">2026-03-09 09:46:21</time>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-300">135/85</span>
                  <span className="text-sm font-medium text-slate-300">mmHg</span>
                </div>
                <span className="text-[10px] text-amber-500 font-bold mt-1">偏高</span>
              </div>
              <div className="flex items-center gap-3">
                <time className="text-xs text-slate-300">2026-03-08 10:20:15</time>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button 
            onClick={onAdd}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={20} />
            <span>添加血压记录</span>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <Info size={20} className="text-blue-500 shrink-0" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <p className="font-bold mb-1">小贴士</p>
            建议在静息状态下测量血压，连续测量两次取平均值更准确。
          </div>
        </div>
      </main>
    </div>
  );
};

const BloodLipidListPage = ({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="血脂记录" onBack={onBack} />
      
      <main className="p-4 space-y-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">记录列表</span>
            <span className="text-xs text-blue-600 font-bold">查看趋势</span>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center text-lime-500">
                    <Microscope size={18} />
                  </div>
                  <time className="text-xs text-slate-400 font-bold">2026-03-09 09:46:21</time>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">总胆固醇</span>
                  <span className="text-lg font-bold text-slate-700">4.52 <span className="text-[10px] font-normal">mmol/L</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">甘油三酯</span>
                  <span className="text-lg font-bold text-slate-700">1.28 <span className="text-[10px] font-normal">mmol/L</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">高密度脂蛋白</span>
                  <span className="text-lg font-bold text-slate-700">1.15 <span className="text-[10px] font-normal">mmol/L</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">低密度脂蛋白</span>
                  <span className="text-lg font-bold text-slate-700">2.84 <span className="text-[10px] font-normal">mmol/L</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button 
            onClick={onAdd}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={20} />
            <span>添加血脂记录</span>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
          <Info size={20} className="text-blue-500 shrink-0" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <p className="font-bold mb-1">小贴士</p>
            血脂检查前应空腹12小时以上，检查前三天避免高脂饮食和饮酒。
          </div>
        </div>
      </main>
    </div>
  );
};

const BloodPressureEntryPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="血压数据录入" onBack={onBack} />
      
      <main className="p-4 space-y-6 pb-32">
        <section className="space-y-4">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50">
            <span className="font-bold text-slate-700">收缩压(高压)</span>
            <div className="flex items-center gap-2">
              <input 
                className="w-24 text-right bg-transparent border-none focus:ring-0 font-bold text-blue-600 p-0 placeholder:text-slate-200" 
                placeholder="请录入" 
                type="number"
              />
              <span className="text-slate-400 text-sm">mmHg</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50">
            <span className="font-bold text-slate-700">舒张压(低压)</span>
            <div className="flex items-center gap-2">
              <input 
                className="w-24 text-right bg-transparent border-none focus:ring-0 font-bold text-blue-600 p-0 placeholder:text-slate-200" 
                placeholder="请录入" 
                type="number"
              />
              <span className="text-slate-400 text-sm">mmHg</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50 active:bg-slate-50 transition-colors">
          <span className="font-bold text-slate-700">测量时间</span>
          <div className="flex items-center text-slate-400">
            <span className="text-sm mr-1">2026-03-09 11:09</span>
            <ChevronRight size={16} />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-xs text-slate-400 px-1 uppercase tracking-wider">参考范围</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-4 rounded-2xl space-y-1 relative overflow-hidden group border border-emerald-100">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <Heart size={40} className="text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold text-emerald-700/70 uppercase">收缩压(高压)</p>
              <p className="text-2xl font-bold text-emerald-700">90-140</p>
              <p className="text-[10px] font-bold text-emerald-600">mmHg</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl space-y-1 relative overflow-hidden group border border-blue-100">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <Activity size={40} className="text-blue-600" />
              </div>
              <p className="text-[10px] font-bold text-blue-700/70 uppercase">舒张压(低压)</p>
              <p className="text-2xl font-bold text-blue-700">60-90</p>
              <p className="text-[10px] font-bold text-blue-600">mmHg</p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button className="w-full h-14 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center">
          确认录入
        </button>
      </div>
    </div>
  );
};

const BloodLipidEntryPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="血脂数据录入" onBack={onBack} />
      
      <main className="p-4 space-y-4 pb-32">
        {[
          { label: '总胆固醇', unit: 'mmol/L' },
          { label: '甘油三酯', unit: 'mmol/L' },
          { label: '高密度脂蛋白', unit: 'mmol/L' },
          { label: '低密度脂蛋白', unit: 'mmol/L' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50">
            <span className="font-bold text-slate-700">{item.label}</span>
            <div className="flex items-center gap-2">
              <input 
                className="w-24 text-right bg-transparent border-none focus:ring-0 font-bold text-blue-600 p-0 placeholder:text-slate-200" 
                placeholder="请录入" 
                type="number"
              />
              <span className="text-slate-400 text-sm">{item.unit}</span>
            </div>
          </div>
        ))}

        <section className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50 active:bg-slate-50 transition-colors mt-2">
          <span className="font-bold text-slate-700">测量时间</span>
          <div className="flex items-center text-slate-400">
            <span className="text-sm mr-1">2026-03-09 11:09</span>
            <ChevronRight size={16} />
          </div>
        </section>

        <section className="space-y-3 pt-2">
          <h3 className="font-bold text-xs text-slate-400 px-1 uppercase tracking-wider">参考范围</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-4 rounded-2xl space-y-1 relative overflow-hidden group border border-emerald-100">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <Heart size={40} className="text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold text-emerald-700/70 uppercase">收缩压(高压)</p>
              <p className="text-2xl font-bold text-emerald-700">90-140</p>
              <p className="text-[10px] font-bold text-emerald-600">mmHg</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl space-y-1 relative overflow-hidden group border border-blue-100">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <Activity size={40} className="text-blue-600" />
              </div>
              <p className="text-[10px] font-bold text-blue-700/70 uppercase">舒张压(低压)</p>
              <p className="text-2xl font-bold text-blue-700">60-90</p>
              <p className="text-[10px] font-bold text-blue-600">mmHg</p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button className="w-full h-14 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center">
          确认录入
        </button>
      </div>
    </div>
  );
};
const ServiceOrderDetailPage = ({ service, onBack }: { service: any; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-white/80 backdrop-blur-[20px] fixed top-0 w-full z-50 border-b border-slate-100">
        <div className="flex items-center justify-center px-6 h-16 w-full relative">
          <button onClick={onBack} className="absolute left-6 text-blue-600">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <h1 className="font-bold text-lg tracking-tight text-slate-800">预约详情</h1>
        </div>
      </header>

      <main className="pt-16">
        <section className="bg-blue-600 px-6 py-8 text-white">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{service.type || service.title}</h2>
            </div>
            <p className="text-blue-100 text-sm opacity-90">您已预约成功，请合理安排以免过期哦</p>
          </div>
        </section>

        <div className="px-4 -mt-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-50">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm font-medium">就诊医院</span>
                <span className="text-slate-800 font-semibold text-right max-w-[60%]">{service.hospital || '上海肿瘤医院'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">服务项目</span>
                <span className="text-slate-800 font-semibold">{service.type || service.title}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-medium">就诊日期</span>
                  {service.type === '陪诊订单' ? (
                    <span className="text-slate-800 font-bold">{service.date || '2026-03-22'}</span>
                  ) : (
                    <span className="text-rose-500 font-bold">待确认</span>
                  )}
                </div>
                {service.type !== '陪诊订单' && (
                  <p className="text-[10px] text-rose-400 text-right leading-tight">由后台人员确认时间后自动更改</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <ShieldCheck size={20} className="text-blue-500 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-blue-800 text-xs leading-relaxed font-medium">
                温馨提示：请您携带有效证件按提示时间前往医院门诊。本平台提供就医协助与流程协助支持，服务费用将有平台统一收取。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-bold text-slate-800">就诊人信息</h3>
              <button className="text-blue-500 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform">
                更换 <ChevronRight size={14} />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-center">
                  <p className="text-base text-slate-800 font-medium">张*伟</p>
                </div>
                <div className="flex justify-between gap-x-6">
                  <p className="text-sm text-slate-500">联系电话</p>
                  <p className="text-sm text-slate-800 text-right">138****1234</p>
                </div>
                <div className="flex justify-between gap-x-6">
                  <p className="text-sm text-slate-500">身份证号</p>
                  <p className="text-sm text-slate-800 text-right">310104********1234</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 px-2 pb-10">
            <h3 className="font-bold text-slate-800 mb-3">订单信息</h3>
            <div className="bg-slate-50 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">订单编号</span>
                <span className="text-slate-600 text-xs font-medium">ORD-20260321-998</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">付款时间</span>
                <span className="text-slate-600 text-xs font-medium">2026-03-21 15:14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">完成时间</span>
                <span className="text-slate-600 text-xs font-medium">--</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">取消时间</span>
                <span className="text-slate-600 text-xs font-medium">--</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DistributionCenterPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-16 px-6 text-white relative">
        <button onClick={onBack} className="absolute top-12 left-4 p-1">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-center text-lg font-bold mb-8">分销中心</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 overflow-hidden">
            <img alt="Avatar" src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h2 className="text-xl font-bold">普通用户</h2>
            <p className="text-blue-100 text-sm">*******7838</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 -mt-10 space-y-4">
        <section className="bg-white rounded-2xl p-6 shadow-sm text-center border border-slate-50">
          <h3 className="text-slate-400 text-sm mb-2">您当前可提现金额 (元)</h3>
          <div className="text-4xl font-bold text-blue-500 mb-6">0.00</div>
          <button 
            onClick={() => onNavigate('withdraw')}
            className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            立即提现
          </button>
        </section>

        <section className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50 border border-slate-50">
          {[
            { id: 'promotion-card', title: '推广名片', desc: '推广赚佣金，共同创造收益', icon: QrCode, color: 'bg-blue-50 text-blue-500' },
            { id: 'bank-card', title: '我的银行卡', desc: '管理提现银行卡信息', icon: Wallet, color: 'bg-amber-50 text-amber-500' },
            { id: 'withdrawal-records', title: '提现记录', desc: '查看我的提现历史明细', icon: History, color: 'bg-rose-50 text-rose-500' },
            { id: 'promotion-stats', title: '推广统计', desc: '查看我的团队成员及转化', icon: Activity, color: 'bg-teal-50 text-teal-500' },
            { id: 'distribution-orders', title: '分销订单', desc: '我的分销收益订单明细', icon: ClipboardList, color: 'bg-indigo-50 text-indigo-500' },
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => onNavigate(item.id as Page)}
              className="flex items-center px-5 py-4 active:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mr-4`}>
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

const WithdrawPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-4 px-4 text-white">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">提现</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="space-y-4">
        <div 
          onClick={() => onNavigate('bank-card')}
          className="bg-white px-4 py-5 flex items-center justify-between border-b border-slate-50 active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-md flex items-center justify-center">
              <Hospital size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800">招商银行</span>
              <p className="text-xs text-slate-400">尾号 8888</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </div>
        
        <div className="px-4 text-right">
          <p className="text-xs text-slate-400">当前可支持提现到银行卡</p>
        </div>

        <div className="bg-white px-4 py-6 border-y border-slate-50">
          <h2 className="text-lg font-bold mb-4 text-slate-800">账号信息</h2>
          <div className="flex items-center justify-between py-2 border-b border-slate-50 mb-4">
            <span className="text-slate-400">真实姓名</span>
            <span className="text-slate-800 font-medium">张伟</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">银行卡号</span>
            <span className="text-slate-800 font-medium">**** **** **** 8888</span>
          </div>
        </div>

        <div className="bg-white px-4 py-6 border-y border-slate-50">
          <h2 className="text-lg font-bold mb-6 text-slate-800">提现金额</h2>
          <div className="flex items-baseline border-b border-slate-100 pb-2 mb-4">
            <span className="text-2xl font-bold mr-2 text-slate-800">¥</span>
            <input 
              type="number" 
              placeholder="0.00" 
              className="w-full border-none p-0 focus:ring-0 text-3xl font-bold text-slate-800 placeholder:text-slate-200"
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <p>当前可提现金额为：<span className="text-slate-800 font-bold">¥ 0.00</span></p>
            <p>冻结中：<span className="text-slate-800 font-bold">¥ 0.00</span></p>
          </div>
        </div>

        <div className="bg-white px-4 py-6 border-y border-slate-50">
          <h2 className="text-lg font-bold mb-4 text-slate-800">备注</h2>
          <input 
            type="text" 
            placeholder="请输入备注" 
            className="w-full border-none p-0 focus:ring-0 text-base placeholder-slate-300 text-slate-800"
          />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
        <button className="w-full py-4 bg-blue-500 text-white text-lg font-bold rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
          确认提现
        </button>
      </div>
    </div>
  );
};

const BankCardPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="我的银行卡" onBack={onBack} />
      <main className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Hospital size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">招商银行</p>
                  <p className="text-xs opacity-80">储蓄卡</p>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">默认卡</span>
            </div>
            <p className="text-2xl font-mono tracking-widest mb-2">**** **** **** 8888</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>

        <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 active:bg-slate-100 transition-colors">
          <Plus size={20} />
          <span className="font-medium">添加银行卡</span>
        </button>

        <div className="pt-10 px-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">温馨提示</h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li>请确保填写的银行卡信息真实有效，以免影响提现；</li>
            <li>提现申请提交后，预计1-3个工作日到账；</li>
            <li>如有疑问，请联系在线客服咨询。</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

const WithdrawalRecordsPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-12 px-4 text-white text-center relative">
        <button onClick={onBack} className="absolute top-12 left-4 p-1">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold mb-8">提现记录</h1>
        <p className="text-sm opacity-90 mb-2">您当前已累计提现（元）</p>
        <h2 className="text-5xl font-bold">0</h2>
      </header>

      <main className="relative z-10 px-4 -mt-6">
        <div className="bg-white rounded-t-[32px] p-6 shadow-sm min-h-[calc(100vh-220px)] border border-slate-50 flex flex-col items-center justify-center">
          <div className="opacity-40 flex flex-col items-center justify-center">
            <div className="w-24 h-24 border-2 border-slate-300 rounded-full flex items-center justify-center mb-4">
              <div className="text-slate-300 flex flex-col items-center">
                <div className="flex gap-2 mb-1">
                  <div className="w-2 h-1 bg-slate-300 rounded-full"></div>
                  <div className="w-2 h-1 bg-slate-300 rounded-full"></div>
                </div>
                <div className="w-8 h-4 border-t-2 border-slate-300 rounded-[50%_50%_0_0] rotate-180"></div>
              </div>
            </div>
            <p className="text-slate-400">没有更多了</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const PromotionStatsPage = ({ onBack }: { onBack: () => void }) => {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-12 px-4 text-white text-center relative">
        <button onClick={onBack} className="absolute top-12 left-4 p-1">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold mb-8">推广统计</h1>
        <p className="text-sm opacity-90 mb-2">您当前的推广人数</p>
        <h2 className="text-5xl font-bold">0</h2>
      </header>

      <main className="relative z-10 px-4 -mt-6">
        <div className="bg-white rounded-t-[32px] p-6 shadow-sm min-h-[calc(100vh-220px)] border border-slate-50">
          <div className="flex items-center justify-between gap-3 mb-6">
            <button className="flex-1 border border-slate-200 rounded-full py-2.5 text-slate-400 text-sm">开始日期</button>
            <div className="w-4 h-[1px] bg-slate-200"></div>
            <button className="flex-1 border border-slate-200 rounded-full py-2.5 text-slate-400 text-sm">结束日期</button>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="会员名称" 
                className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-blue-500/10">搜索</button>
          </div>

          <div className="flex rounded-full overflow-hidden h-11 mb-12">
            <button 
              onClick={() => setTab(0)}
              className={`flex-1 flex items-center justify-center text-sm font-bold transition-colors ${tab === 0 ? 'bg-[#98d348] text-white' : 'bg-[#95c1f5] text-white'}`}
            >
              一级 (0)
            </button>
            <button 
              onClick={() => setTab(1)}
              className={`flex-1 flex items-center justify-center text-sm font-bold transition-colors ${tab === 1 ? 'bg-[#98d348] text-white' : 'bg-[#95c1f5] text-white'}`}
            >
              二级 (0)
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <div className="w-20 h-20 border-2 border-slate-200 rounded-full flex items-center justify-center mb-4">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-1">
                  <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
                  <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
                </div>
                <div className="w-8 h-4 border-t-2 border-slate-200 rounded-[50%_50%_0_0] rotate-180"></div>
              </div>
            </div>
            <p className="text-slate-400">没有更多了</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const DistributionOrdersPage = ({ onBack }: { onBack: () => void }) => {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-12 px-4 text-white text-center relative">
        <button onClick={onBack} className="absolute top-12 left-4 p-1">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold mb-8">分销订单</h1>
        <p className="text-sm opacity-90 mb-2">您还没有订单记录呢,赶快加油哦!</p>
        <h2 className="text-5xl font-bold">0</h2>
      </header>

      <main className="relative z-10 px-4 -mt-6">
        <div className="bg-white rounded-t-[32px] p-6 shadow-sm min-h-[calc(100vh-220px)] border border-slate-50">
          <div className="flex items-center justify-between gap-3 mb-6">
            <button className="flex-1 bg-slate-100 rounded-full py-2.5 text-slate-400 text-sm">开始日期</button>
            <div className="w-4 h-[1px] bg-slate-300"></div>
            <button className="flex-1 bg-slate-100 rounded-full py-2.5 text-slate-400 text-sm">结束日期</button>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="订单号" 
                className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-blue-500/10">搜索</button>
          </div>

          <div className="flex rounded-full overflow-hidden h-11 mb-12">
            <button 
              onClick={() => setTab(0)}
              className={`flex-1 flex items-center justify-center text-sm font-bold transition-colors ${tab === 0 ? 'bg-[#9fe25d] text-white' : 'bg-[#9dc4f8] text-white'}`}
            >
              一级 (0)
            </button>
            <button 
              onClick={() => setTab(1)}
              className={`flex-1 flex items-center justify-center text-sm font-bold transition-colors ${tab === 1 ? 'bg-[#9fe25d] text-white' : 'bg-[#9dc4f8] text-white'}`}
            >
              二级 (0)
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <div className="w-20 h-20 border-2 border-slate-200 rounded-full flex items-center justify-center mb-4">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-1">
                  <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
                  <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
                </div>
                <div className="w-8 h-4 border-t-2 border-slate-200 rounded-[50%_50%_0_0] rotate-180"></div>
              </div>
            </div>
            <p className="text-slate-400">没有更多了</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const PromotionCardPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right duration-300">
      <header className="bg-blue-500 pt-12 pb-4 px-4 text-white text-center relative">
        <button onClick={onBack} className="absolute top-12 left-4 p-1">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">推广名片</h1>
      </header>

      <main className="mt-8 px-4 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-50">
          <div className="relative aspect-[4/3] w-full bg-[#ffedd5] flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={48} className="text-amber-500/50" />
              </div>
              <h3 className="text-amber-900 font-bold text-xl">医护助手 推广大使</h3>
              <p className="text-amber-700 text-sm mt-2">分享健康，传递关爱</p>
            </div>
          </div>
          <div className="p-8 flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-slate-100">
              <QrCode size={40} className="text-slate-300 mb-1" />
              <span className="text-[10px] text-slate-400 font-bold">二维码</span>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-slate-800 font-bold">********2342邀请您加入</p>
              <p className="text-slate-600 text-sm">邀请您加入商城</p>
            </div>
          </div>
          <div className="pb-8 text-center">
            <p className="text-slate-300 text-xs">--长按识别或扫描二维码进入--</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
        <button className="w-full h-12 bg-blue-500 text-white text-lg font-bold rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
          保存到相册
        </button>
      </div>
    </div>
  );
};

// --- Pages ---

const PatientManagementPage = ({ params, onNavigate, onBack }: { params?: any, onNavigate: (id: Page, params?: any) => void, onBack: () => void }) => {
  const isSelectionMode = params?.mode === 'selection';
  const patients = [
    { name: '张伟', relation: '本人', gender: '男', age: 24, phone: '135****8888', isSelf: true },
    { name: '李梅梅', relation: '母亲', gender: '女', age: 52, phone: '138****6666', isSelf: false },
    { name: '王小明', relation: '配偶', gender: '男', age: 30, phone: '150****1234', isSelf: false },
  ];

  const handleSelect = (p: any) => {
    if (isSelectionMode) {
      onNavigate('appointment-registration', { ...params.prevParams, selectedPatient: p });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title={isSelectionMode ? "选择就诊人" : "就诊人管理"} onBack={onBack} />
      <main className="p-6 space-y-6">
        <header className="mb-2">
          <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">我的健康联系人</p>
          <h2 className="text-2xl font-bold mt-1 text-slate-800">共 {patients.length} 位就诊人</h2>
        </header>

        <div className="space-y-4">
          {patients.map((p, i) => (
            <div 
              key={i} 
              onClick={() => handleSelect(p)}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start justify-between transition-all ${
                isSelectionMode ? 'active:scale-[0.98] cursor-pointer hover:border-blue-200' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                    p.isSelf ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.relation}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-slate-500 text-sm gap-2">
                    <User size={14} />
                    <span>{p.gender} · {p.age}岁</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm gap-2">
                    <Headphones size={14} />
                    <span className="font-mono">{p.phone}</span>
                  </div>
                </div>
              </div>
              {!isSelectionMode && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('add-member', { from: 'patient-management', patient: p });
                  }}
                  className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
                >
                  <Edit3 size={20} />
                </button>
              )}
              {isSelectionMode && (
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50">
        <button 
          onClick={() => onNavigate('add-member', { from: 'patient-management' })}
          className="w-full bg-blue-600 text-white font-bold h-14 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          <Plus size={20} />
          <span>添加就诊人</span>
        </button>
      </footer>
    </div>
  );
};

const CartPage = ({ items, setItems, onBack }: { items: any[]; setItems: React.Dispatch<React.SetStateAction<any[]>>; onBack: () => void }) => {
  const toggleSelect = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const updateCount = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = Math.max(1, item.count + delta);
        return { ...item, count: newCount };
      }
      return item;
    }));
  };

  const totalPrice = items.reduce((sum, item) => {
    if (!item.selected) return sum;
    const price = typeof item.price === 'string' ? parseInt(item.price.replace('¥', '')) || 579 : item.price;
    return sum + price * item.count;
  }, 0);

  const allSelected = items.length > 0 && items.every(i => i.selected);

  const toggleAll = () => {
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title="购物车" onBack={onBack} />
      <main className="p-4 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4">
              <div className="flex-shrink-0">
                <div 
                  onClick={() => toggleSelect(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    item.selected ? 'bg-blue-500 border-blue-500' : 'border-slate-200'
                  }`}
                >
                  {item.selected && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.img || `https://picsum.photos/seed/${item.title}/200/200`} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-20">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 leading-tight line-clamp-1">{item.title}</h2>
                  <p className="text-[10px] text-slate-400 mt-1">医疗协助服务</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-rose-500 font-bold text-base">
                    ¥ {typeof item.price === 'string' ? item.price.replace('¥', '') : item.price}
                  </span>
                  <div className="flex items-center border border-slate-100 rounded-lg overflow-hidden h-7">
                    <button 
                      onClick={() => updateCount(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 border-r border-slate-100 hover:bg-slate-50"
                    >
                      <Plus size={12} className="rotate-45" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.count}</span>
                    <button 
                      onClick={() => updateCount(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 border-l border-slate-100 hover:bg-slate-50"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <ShoppingCart size={64} strokeWidth={1} />
            <p className="mt-4 text-slate-400 text-sm">购物车空空如也</p>
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 pb-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-2" onClick={toggleAll}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
            allSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-200'
          }`}>
            {allSelected && <CheckCircle2 size={14} className="text-white" />}
          </div>
          <span className="text-sm font-medium text-slate-600">全选</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-600">合计:</span>
            <span className="ml-1 text-rose-500 font-bold text-lg">¥ {totalPrice}</span>
          </div>
          <button 
            disabled={items.filter(i => i.selected).length === 0}
            onClick={() => alert('订单已提交')}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${
              items.filter(i => i.selected).length > 0 
                ? 'bg-blue-600 text-white shadow-blue-500/20' 
                : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
            }`}
          >
            提交订单
          </button>
        </div>
      </footer>
    </div>
  );
};

const InvoiceListPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const orders = [
    { id: 'ORD-20230824-001', title: '在线图文问诊', category: '电子发票', price: 65.00, date: '2023-08-24 14:20', selected: true },
    { id: 'ORD-20230825-042', title: '常规体检报告解读', category: '电子发票', price: 85.00, date: '2023-08-25 09:15', selected: true },
    { id: 'ORD-20230826-015', title: '复诊开药', category: '电子发票', price: 29.00, date: '2023-08-26 16:45', selected: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title="订单发票" onBack={onBack} />
      <div className="flex bg-white border-b border-slate-100">
        <div className="flex-1 text-center py-3 border-b-2 border-blue-500 text-blue-500 font-medium">待开发票</div>
        <div className="flex-1 text-center py-3 border-b-2 border-transparent text-slate-400">已开发票</div>
      </div>
      <main className="p-4 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start space-x-4 ${!order.selected && 'opacity-70'}`}>
            <div className="flex-shrink-0 w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center text-xs text-slate-300 text-center px-2">
              产品图片
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-bold truncate text-slate-800">{order.title}</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  order.selected ? 'bg-blue-500 border-blue-500' : 'border-slate-200'
                }`}>
                  {order.selected && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">类别: {order.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-rose-500">¥ {order.price.toFixed(2)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-50 space-y-1">
                <p className="text-[10px] text-slate-400">订单编号: {order.id}</p>
                <p className="text-[10px] text-slate-400">支付日期: {order.date}</p>
              </div>
            </div>
          </div>
        ))}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 pb-8 flex items-center justify-between z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">已选 2 个订单</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-medium text-slate-600">合计:</span>
            <span className="text-xl font-bold text-rose-500">¥ 150.00</span>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('invoice-form')}
          className="bg-blue-600 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
        >
          下一步
        </button>
      </footer>
    </div>
  );
};

const InvoiceFormPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title="发票信息" onBack={onBack} />
      <main className="p-6 space-y-8">
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="block text-slate-800 font-bold text-sm">发票类型:</label>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 rounded-full bg-blue-600 text-white text-sm font-bold shadow-md">全电普票</button>
              <button className="flex-1 py-3 px-4 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">全电专票</button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-slate-800 font-bold text-sm">发票抬头:</label>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">个人</button>
              <button className="flex-1 py-3 px-4 rounded-full bg-blue-600 text-white text-sm font-bold shadow-md">公司</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <label className="w-24 text-slate-800 text-sm font-bold shrink-0">抬头内容<span className="text-rose-500 ml-1">*</span>:</label>
              <input className="flex-1 border-none focus:ring-0 text-sm placeholder:text-slate-300 p-0" placeholder="请填写公司名称" type="text" />
            </div>
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <label className="w-24 text-slate-800 text-sm font-bold shrink-0">税号<span className="text-rose-500 ml-1">*</span>:</label>
              <input className="flex-1 border-none focus:ring-0 text-sm placeholder:text-slate-300 p-0" placeholder="请填写纳税人识别号" type="text" />
            </div>
            <div className="p-5 flex items-center gap-4 border-b border-slate-50">
              <label className="w-24 text-slate-800 text-sm font-bold shrink-0">邮箱<span className="text-rose-500 ml-1">*</span>:</label>
              <input className="flex-1 border-none focus:ring-0 text-sm placeholder:text-slate-300 p-0" placeholder="请填写接收电子发票的邮箱" type="email" />
            </div>
            <div className="p-5 flex items-center gap-4">
              <label className="w-24 text-slate-800 text-sm font-bold shrink-0">发票内容:</label>
              <div className="flex-1 text-slate-600 text-sm">商品明细</div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-slate-800 font-bold text-sm">发票须知:</h2>
          <div className="text-slate-400 text-xs leading-relaxed space-y-3">
            <p>1. 请确保您的发票抬头信息真实有效。如因信息填写错误导致无法正常开票，平台概不负责。</p>
            <p>2. 发票内容默认为“商品明细”，暂不支持修改。</p>
            <p>3. 全电发票将在确认收货后的3-5个工作日内发送至您的指定邮箱，请注意查收。</p>
            <p>4. 如需开具专票，请确保您的公司具有增值税一般纳税人资格，并准确填写税号等相关资料。</p>
            <p>5. 若您有任何疑问，请联系在线客服咨询。</p>
          </div>
        </section>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50">
        <button 
          onClick={() => onBack()}
          className="w-full bg-blue-600 text-white rounded-full py-4 shadow-lg shadow-blue-500/20 font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>确认</span>
          <CheckCircle2 size={20} />
        </button>
      </footer>
    </div>
  );
};

const OrderListPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('全部');
  
  const allOrders = [
    { type: '预约挂号订单', hospital: '上海复旦大学附属第六医院', doctor: '杨卫华', dept: '肿瘤科', date: '2026-03-07 上午', status: '进行中' },
    { type: '陪诊订单', hospital: '上海交通大学医学院附属瑞金医院', doctor: '李向东', dept: '消化内科', date: '2026-03-08 下午', status: '进行中' },
    { type: '检查加急订单', hospital: '复旦大学附属肿瘤医院', doctor: '赵晓彤', dept: '肿瘤科', date: '2026-03-09 上午', status: '已完成' },
    { type: '住院协助订单', hospital: '上海市第一人民医院', doctor: '王伟华', dept: '呼吸科', date: '2026-03-10 全天', status: '已取消' },
    { type: '手术加急订单', hospital: '华山医院', doctor: '刘主任', dept: '神经外科', date: '2026-03-11 全天', status: '进行中' },
  ];

  const filteredOrders = activeTab === '全部' 
    ? allOrders 
    : allOrders.filter(order => order.status === activeTab);

  const tabs = ['全部', '进行中', '已完成', '已取消'];

  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-in slide-in-from-right duration-300">
      <Header title="订单列表" onBack={onBack} />
      <div className="flex justify-around items-center bg-white pt-3 pb-2 border-b border-slate-50">
        {tabs.map((tab) => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-2 cursor-pointer transition-colors ${
              activeTab === tab ? 'text-slate-800 font-bold text-base' : 'text-slate-400 text-sm'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full"
              />
            )}
          </div>
        ))}
      </div>
      <main className="p-4 pt-6 space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{order.type}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-6">{order.hospital}</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 text-sm">医生姓名</span>
                  <span className="text-slate-700 font-medium">{order.doctor}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 text-sm">医生科室</span>
                  <span className="text-slate-700 font-medium">{order.dept}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 text-sm">预约日期</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {order.type === '陪诊订单' ? (
                        <span className="text-slate-700 font-medium">{order.date}</span>
                      ) : (
                        <span className="text-xs text-rose-500 font-bold">待确认</span>
                      )}
                    </div>
                    {order.type !== '陪诊订单' && (
                      <p className="text-[10px] text-rose-400 leading-tight">由后台工作人员确定后自行更改时间</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 text-sm">订单状态</span>
                  <span className={`font-bold ${
                    order.status === '进行中' ? 'text-blue-500' : 
                    order.status === '已完成' ? 'text-emerald-500' : 
                    'text-slate-400'
                  }`}>{order.status}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => onNavigate('service-order-detail', order)}
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Package size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-400">暂无相关订单</p>
          </div>
        )}
      </main>
    </div>
  );
};

const FeedbackPage = ({ onBack }: { onBack: () => void }) => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">提交成功</h2>
        <p className="text-slate-500 text-center mb-10">感谢您的反馈，我们会尽快处理您的问题。</p>
        <button 
          onClick={onBack}
          className="w-full max-w-xs bg-blue-600 text-white font-bold h-14 rounded-full shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      <Header title="意见反馈" onBack={onBack} />
      <main className="p-6 max-w-screen-md mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">我们重视您的声音</h2>
          <p className="text-slate-500 text-sm font-medium">请描述您遇到的问题或您的建议，我们将竭诚改进。</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <label className="block text-slate-800 font-bold text-sm mb-4">反馈内容 <span className="text-rose-500">*</span></label>
          <textarea 
            className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-xl p-4 text-slate-800 placeholder:text-slate-300 transition-all resize-none min-h-[240px]" 
            placeholder="请输入您要反馈的问题（5-500字以内）"
          />
          <div className="flex justify-end mt-3">
            <span className="text-xs text-slate-400">0 / 500</span>
          </div>
        </div>
        <div className="mt-8 flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
            <FileText size={16} />
          </div>
          <div className="text-sm text-slate-600 leading-relaxed">
            <p className="font-bold mb-1 text-slate-800">反馈规则</p>
            <p className="text-xs opacity-80">您的反馈将在 1-3 个工作日内得到答复。请确保内容详实，以便我们更快速地定位问题。</p>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <button 
          onClick={() => setSubmitted(true)}
          className="w-full bg-blue-600 text-white font-bold h-14 rounded-full shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          提交反馈
        </button>
      </footer>
    </div>
  );
};

const CustomerServicePage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="在线客服" onBack={onBack} />
      <main className="p-6 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-slate-50 p-8 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-50 overflow-hidden">
                <div className="text-blue-500 flex flex-col items-center">
                  <User size={48} />
                  <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">医佰岁健康管家</h2>
          <p className="text-sm text-slate-500 text-center mb-10 leading-relaxed">
            我是您的专属助理，<br/>添加我的企业微信与我联系吧！
          </p>
          <div className="w-full bg-slate-50 rounded-[28px] p-8 flex flex-col items-center">
            <p className="text-slate-500 text-sm font-medium mb-1">长按识别二维码</p>
            <p className="text-slate-400 text-xs mb-8">添加我的企业微信</p>
            <div className="w-full aspect-square max-w-[240px] bg-white p-5 rounded-3xl shadow-lg flex items-center justify-center border border-slate-100 relative">
              <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center text-blue-200">
                <QrCode size={120} />
              </div>
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-200 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-200 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-200 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-200 rounded-br-lg"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center px-8">
          <p className="text-xs text-slate-400 leading-loose">
            温馨提示：在线客服服务时间为 9:00 - 21:00，我们将尽快为您解答疑问。
          </p>
        </div>
      </main>
    </div>
  );
};

const AccountPage = ({ initialTab, onBack }: { initialTab: 'points' | 'coupons' | 'services', onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <Header title="我的账户" onBack={onBack} />
      <div className="flex bg-white border-b border-slate-100">
        {[
          { id: 'points', label: '积分(0)' },
          { id: 'services', label: '剩余陪诊(3)' },
          { id: 'coupons', label: '优惠券(1)' },
        ].map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-center py-4 text-sm font-bold relative cursor-pointer transition-colors ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <main className="p-6">
        {activeTab === 'points' && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-6">
            <div className="text-slate-200">
              <XCircle size={100} strokeWidth={1} />
            </div>
            <p className="text-slate-500 text-lg font-medium">剩余积分: 0分</p>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">可用优惠券</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex items-stretch h-32 border border-slate-100">
              <div className="w-28 bg-orange-100 flex flex-col items-center justify-center relative">
                <div className="text-rose-500">
                  <span className="text-xs font-bold">¥</span>
                  <span className="text-4xl font-black">50</span>
                </div>
                <span className="text-[10px] text-rose-400 mt-1">满900可用</span>
                <div className="absolute -right-1 top-0 bottom-0 flex flex-col justify-around py-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-slate-50"></div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 leading-tight">专享-50元代金券（满900可用）</h3>
                  <p className="text-[10px] text-slate-400 mt-2">有效期：2026-01-02至2027-01-02</p>
                </div>
                <div className="flex justify-end">
                  <span className="bg-orange-50 text-rose-500 text-[10px] font-bold px-3 py-1 rounded-full">未使用</span>
                </div>
              </div>
            </div>

            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8">历史记录</h2>
            <div className="bg-white rounded-2xl overflow-hidden flex items-stretch h-32 border border-slate-100 opacity-60 grayscale">
              <div className="w-28 bg-slate-100 flex flex-col items-center justify-center relative">
                <div className="text-slate-400">
                  <span className="text-xs font-bold">¥</span>
                  <span className="text-4xl font-black">50</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">满900可用</span>
                <div className="absolute -right-1 top-0 bottom-0 flex flex-col justify-around py-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-slate-50"></div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-400 leading-tight">专享-50元代金券（满900可用）</h3>
                  <p className="text-[10px] text-slate-400 mt-2">有效期：2026-01-02至2027-01-02</p>
                </div>
                <div className="flex justify-end">
                  <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full">已使用</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-10 text-center opacity-40">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Ticket size={32} className="text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-500">没有更多优惠券了</p>
              <p className="text-xs text-slate-400 mt-1">前往商城兑换更多惊喜</p>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">门诊陪诊服务</h3>
                <span className="text-blue-600 font-bold">3次</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                包含专家挂号协助、诊前提醒、到院衔接、陪同就诊、协助缴费取药等全流程服务。
              </p>
              <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/20">
                立即使用
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AddMemberPage = ({ params, onBack }: { params?: any; onBack: () => void }) => {
  const patient = params?.patient;
  const [relation, setRelation] = useState(patient?.relation || '本人');
  const [gender, setGender] = useState(patient?.gender || '男');
  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [idType, setIdType] = useState(patient?.idType || '居民身份证');
  const [birthday, setBirthday] = useState(patient?.birthday || (patient ? '1990-01-01' : ''));
  const [showIdPicker, setShowIdPicker] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 1500);
  };

  const relations = ['本人', '配偶', '父亲', '母亲', '子女', '爷爷', '奶奶', '亲戚', '其他'];
  const idTypes = ['居民身份证', '护照', '港澳居民来往内地通行证', '台湾居民来往大陆通行证', '其他'];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right duration-300">
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <p className="text-lg font-bold text-slate-800">{patient ? '修改成功' : '添加成功'}</p>
          </div>
        </div>
      )}

      {showIdPicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">选择证件类型</h3>
              <button onClick={() => setShowIdPicker(false)} className="text-slate-400">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto no-scrollbar">
              {idTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setIdType(type);
                    setShowIdPicker(false);
                  }}
                  className={`w-full py-4 text-center rounded-2xl transition-colors ${
                    idType === type ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 active:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center h-12 px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-start text-blue-500">
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-slate-800">{patient ? '修改就诊人' : '新增成员'}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-base font-bold mb-4 text-slate-800">与您的关系</h3>
          <div className="relative overflow-hidden -mx-5 px-5">
            <motion.div 
              drag="x"
              dragConstraints={{ left: -150, right: 0 }}
              dragElastic={0.1}
              className="flex gap-2 cursor-grab active:cursor-grabbing pb-2 w-max pr-5"
            >
              {relations.map((r) => (
                <button
                  key={r}
                  onClick={() => setRelation(r)}
                  className={`flex-shrink-0 flex items-center justify-center px-6 h-10 rounded-full transition-colors ${
                    relation === r
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-medium">{r}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-base font-bold mb-6 text-slate-800">基本信息</h3>
          <div className="space-y-1">
            <div className="flex items-center py-4 border-b border-slate-50">
              <label className="w-24 text-slate-600">
                姓名<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                className="flex-1 text-right bg-transparent border-none focus:ring-0 placeholder-slate-300 text-slate-800"
                placeholder="请输入真实姓名"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div 
              onClick={() => setShowIdPicker(true)}
              className="flex items-center py-4 border-b border-slate-50 cursor-pointer active:bg-slate-50 transition-colors"
            >
              <label className="w-24 text-slate-600">
                证件类型<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex-1 flex items-center justify-end text-slate-800">
                <span>{idType}</span>
                <ChevronRight size={18} className="text-slate-300 ml-1" />
              </div>
            </div>
            <div className="flex items-center py-4 border-b border-slate-50">
              <label className="w-24 text-slate-600">
                证件号码<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                className="flex-1 text-right bg-transparent border-none focus:ring-0 placeholder-slate-300 text-slate-800"
                placeholder="请输入"
                type="text"
                defaultValue={patient ? '310115**********1X' : ''}
              />
            </div>
            <div className="flex items-center py-4 border-b border-slate-50 relative">
              <label className="w-24 text-slate-600">
                出生日期<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex-1 flex items-center justify-end text-slate-800 relative">
                <input 
                  type="date" 
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
                <span>{birthday || '请选择'}</span>
                <ChevronRight size={18} className="text-slate-300 ml-1" />
              </div>
            </div>
            <div className="flex items-center py-4 border-b border-slate-50">
              <label className="w-24 text-slate-600">
                性别<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex-1 flex items-center justify-end space-x-6">
                <label
                  className={`flex items-center space-x-2 cursor-pointer transition-opacity ${
                    gender === '男' ? 'opacity-100' : 'opacity-40'
                  }`}
                  onClick={() => setGender('男')}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <User size={18} />
                  </div>
                  <span className="text-slate-800">男</span>
                </label>
                <label
                  className={`flex items-center space-x-2 cursor-pointer transition-opacity ${
                    gender === '女' ? 'opacity-100' : 'opacity-40'
                  }`}
                  onClick={() => setGender('女')}
                >
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                    <User size={18} />
                  </div>
                  <span className="text-slate-800">女</span>
                </label>
              </div>
            </div>
            <div className="flex items-center py-4 border-b border-slate-50">
              <label className="w-24 text-slate-600">
                手机号<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                className="flex-1 text-right bg-transparent border-none focus:ring-0 placeholder-slate-300 text-slate-800"
                placeholder="请输入"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex items-center py-4">
              <label className="w-24 text-slate-600">医保卡号</label>
              <input
                className="flex-1 text-right bg-transparent border-none focus:ring-0 placeholder-slate-300 text-slate-800"
                placeholder="请输入"
                type="text"
              />
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md pb-8">
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 active:scale-[0.98] transition-all"
        >
          {patient ? '保存修改' : '确认'}
        </button>
      </div>
    </div>
  );
};

const HomePage = ({ onNavigate }: { onNavigate: (id: Page, params?: any) => void }) => {
  const [specialtyPage, setSpecialtyPage] = useState(0);

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">上海</span>
          <ChevronRight size={12} className="text-slate-400 rotate-90" />
        </div>
      </header>

      <main className="px-4 space-y-6 mt-2">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-1">三甲主任级专家加速通道</h1>
            <p className="text-blue-100 text-sm opacity-90 mb-4">专注复杂病例 · 精准路径规划 · 高效就医协助</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] flex items-center">
                <Timer size={12} className="mr-1" /> 时效Top
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] flex items-center">
                <Zap size={12} className="mr-1" /> 急速预约
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] flex items-center">
                <CheckCircle2 size={12} className="mr-1" /> T+1成功
              </span>
            </div>
            <button 
              onClick={() => onNavigate('patient-management')}
              className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform shadow-xl"
            >
              <span>提交需求 协助评估</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <ShieldCheck size={140} className="absolute -right-4 -top-4 opacity-10 text-white" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate('hospital-list')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-800">选医院</h3>
              <p className="text-xs text-slate-400">覆盖知名优质医院</p>
            </div>
            <Hospital size={36} className="text-blue-400" />
          </div>
          <div 
            onClick={() => onNavigate('doctor-list')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-800">选医生</h3>
              <p className="text-xs text-slate-400">科室千余位医生</p>
            </div>
            <UserSearch size={36} className="text-blue-400" />
          </div>
        </div>

        {/* Expert Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-800">专家优选</h2>
              <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">一站式专家就医</span>
            </div>
            <button 
              onClick={() => onNavigate('all-specialties')}
              className="text-sm text-blue-500 flex items-center"
            >
              全部科室 <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div 
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50;
                if (info.offset.x < -threshold && specialtyPage < 2) {
                  setSpecialtyPage(prev => prev + 1);
                } else if (info.offset.x > threshold && specialtyPage > 0) {
                  setSpecialtyPage(prev => prev - 1);
                }
              }}
              animate={{ x: `-${specialtyPage * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex cursor-grab active:cursor-grabbing"
            >
              {[
                // Page 1
                [
                  { label: '肿瘤科', icon: Microscope, color: 'bg-rose-50 text-rose-500' },
                  { label: '神经内科', icon: Brain, color: 'bg-indigo-50 text-indigo-500' },
                  { label: '神经外科', icon: Stethoscope, color: 'bg-cyan-50 text-cyan-500' },
                  { label: '心内科', icon: Heart, color: 'bg-red-50 text-red-500' },
                  { label: '血液科', icon: Droplets, color: 'bg-blue-50 text-blue-500' },
                  { label: '肾病内科', icon: Activity, color: 'bg-emerald-50 text-emerald-500' },
                  { label: '内分泌科', icon: Pill, color: 'bg-amber-50 text-amber-500' },
                  { label: '消化内科', icon: Thermometer, color: 'bg-sky-50 text-sky-500' },
                  { label: '呼吸科', icon: Wind, color: 'bg-blue-50 text-blue-500' },
                  { label: '肝胆科', icon: Activity, color: 'bg-green-50 text-green-500' },
                ],
                // Page 2
                [
                  { label: '骨科', icon: Activity, color: 'bg-orange-50 text-orange-500' },
                  { label: '皮肤科', icon: User, color: 'bg-pink-50 text-pink-500' },
                  { label: '妇产科', icon: Heart, color: 'bg-rose-50 text-rose-500' },
                  { label: '儿科', icon: User, color: 'bg-yellow-50 text-yellow-500' },
                  { label: '眼科', icon: Search, color: 'bg-blue-50 text-blue-500' },
                  { label: '耳鼻喉科', icon: Headphones, color: 'bg-indigo-50 text-indigo-500' },
                  { label: '口腔科', icon: ShieldCheck, color: 'bg-cyan-50 text-cyan-500' },
                  { label: '康复科', icon: Activity, color: 'bg-emerald-50 text-emerald-500' },
                  { label: '精神科', icon: Brain, color: 'bg-purple-50 text-purple-500' },
                  { label: '老年科', icon: User, color: 'bg-slate-50 text-slate-500' },
                ],
                // Page 3
                [
                  { label: '泌尿外科', icon: Droplets, color: 'bg-blue-50 text-blue-500' },
                  { label: '胸外科', icon: Wind, color: 'bg-sky-50 text-sky-500' },
                  { label: '普外科', icon: Stethoscope, color: 'bg-slate-50 text-slate-500' },
                  { label: '血管外科', icon: Activity, color: 'bg-red-50 text-red-500' },
                  { label: '烧伤科', icon: Thermometer, color: 'bg-orange-50 text-orange-500' },
                  { label: '感染科', icon: ShieldCheck, color: 'bg-green-50 text-green-500' },
                  { label: '风湿免疫', icon: Activity, color: 'bg-indigo-50 text-indigo-500' },
                  { label: '变态反应', icon: Wind, color: 'bg-amber-50 text-amber-500' },
                  { label: '疼痛科', icon: Zap, color: 'bg-rose-50 text-rose-500' },
                  { label: '急诊科', icon: Bell, color: 'bg-red-50 text-red-500' },
                ]
              ].map((page, pageIdx) => (
                <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-5 gap-y-6 text-center px-1">
                  {page.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        onClick={() => onNavigate('doctor-selection', item.label)}
                        className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-2 cursor-pointer active:scale-95 transition-transform`}
                      >
                        <item.icon size={20} />
                      </div>
                      <span className="text-xs text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center mt-6 space-x-1">
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  specialtyPage === i ? 'w-4 bg-blue-500' : 'w-1 bg-slate-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Key Departments */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-800">重点科室专区</h2>
            <span className="text-xs text-slate-400">教授级/院长级 专家就医协助</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: '肿瘤专区', desc: '多学科诊疗支持\n专家方向就医建议', icon: Award, iconColor: 'text-amber-500', bgColor: 'bg-blue-50/50' },
              { title: '骨科外科专区', desc: '关节/脊柱/创伤\n骨科手术与康复评估', icon: Activity, iconColor: 'text-blue-400', bgColor: 'bg-slate-50/50' },
              { title: '心脑血管专区', desc: '心内/心外/介入\n冠心病与血管评估', icon: Heart, iconColor: 'text-red-400', bgColor: 'bg-slate-50/50' },
              { title: '神经系统专区', desc: '脑血管/神经外科\n神经系统疾病评估', icon: Brain, iconColor: 'text-purple-400', bgColor: 'bg-slate-50/50' },
              { title: '肾病内科专区', desc: '慢性肾病管理\n透析治疗建议', icon: Stethoscope, iconColor: 'text-emerald-400', bgColor: 'bg-slate-50/50' },
              { title: '内分泌专区', desc: '糖尿病/甲状腺\n代谢性疾病诊疗', icon: Pill, iconColor: 'text-amber-400', bgColor: 'bg-slate-50/50' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('specialty-detail', item)}
                className={`${item.bgColor} p-4 rounded-xl border border-slate-100 active:bg-slate-100 transition-colors cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                  <item.icon size={18} className={item.iconColor} />
                </div>
                <p className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 text-slate-800">全流程就医协助</h2>
          <div className="relative flex justify-between items-start">
            <div className="absolute top-5 left-6 right-6 h-[1px] bg-slate-100 -z-0"></div>
            {[
              { label: '需求评估', sub: '判断专家方向\n精准匹配科室', icon: ClipboardList },
              { label: '专家挂号', sub: '协调就诊时间\n资源优先匹配', icon: CheckCircle2 },
              { label: '到院衔接', sub: '陪诊与检查安排\n关键节点协助', icon: MapPin },
              { label: '住院/手术', sub: '协调住院资源\n手术安排支持', icon: Hospital },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 w-1/4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                  <step.icon size={20} />
                </div>
                <span className="text-[11px] font-medium mb-1 text-slate-700">{step.label}</span>
                <div className="h-4 w-[1px] bg-slate-200 mb-1"></div>
                <p className="text-[9px] text-slate-400 text-center leading-tight whitespace-pre-line">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-800">就医协助服务</h2>
            <span className="text-xs text-slate-400">陪诊 检查 住院 手术等关键节点</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: '门诊陪诊', desc: '省时省力', price: '¥579', unit: '/次', img: 'https://picsum.photos/seed/doc1/400/300' },
              { title: '检查加急', desc: '3-7个工作日内', price: '¥400', unit: '/项', img: 'https://picsum.photos/seed/doc2/400/300' },
              { title: '住院协助', desc: '异地就医协助', price: '面议', unit: '', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlup1Tls7bkb8VzkvW_heI4xhHwWx7bY7J6K39pH9yq6e3Ca19AJI-J2vuhuKBJa6pRFjzng7bStMcajI-6P7ZgeT09RPvlpjC1qXX5Szh8qTnLof99-rTR4VC8zy1iWGrI_Npz1ezLmFk-FN8XvVH_tkNAQQOyyj_8RIFZ16ZnzD9_QXDIXOoGxBTk6Ecu21sQYI45H-RfJFqxYUUycC9V85roM5miY8nBeaD_8ayHjES-9UDEu81G-2k24llxm1PZ2KKf82XiRRA' },
              { title: '手术加急', desc: '根据手术情况', price: '面议', unit: '', img: 'https://picsum.photos/seed/doc4/400/300' },
            ].map((service, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('service-detail', service)}
                className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden group border border-slate-50 active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="relative z-10">
                  <h4 className="font-bold text-slate-800">{service.title}</h4>
                  <p className="text-[10px] text-slate-400 mb-3">{service.desc}</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-rose-500 font-bold text-lg">{service.price}</span>
                    <span className="text-[10px] text-slate-400">{service.unit}</span>
                  </div>
                </div>
                <img 
                  alt="Doctor" 
                  className="absolute -right-2 -bottom-2 w-20 h-20 object-cover rounded-tl-3xl opacity-20 group-hover:opacity-40 transition-opacity" 
                  src={service.img}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const MedicationPlanAddPage = ({ onBack, onSave }: { onBack: () => void, onSave: (plan: MedicationPlan) => void }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startFocused, setStartFocused] = useState(false);
  const [endFocused, setEndFocused] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (photos.length >= 3) {
        alert('最多只能上传3张照片');
        return;
      }
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入药品名称');
      return;
    }
    if (!startDate) {
      alert('请选择开始时间');
      return;
    }
    if (!endDate) {
      alert('请选择结束时间');
      return;
    }
    onSave({
      name,
      dosage,
      cost,
      startDate,
      endDate,
      images: photos,
      remarks
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <ArrowLeft size={24} className="text-slate-900" />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">新增用药方案</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-24 px-5 max-w-2xl mx-auto space-y-6">
        {/* Form Section */}
        <section className="space-y-6">
          {/* Primary Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="space-y-5">
              {/* Medication Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">药品名称</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all" 
                    type="text" 
                    placeholder="请输入药品名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Pill size={20} />
                  </span>
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">费用</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all" 
                    type="text" 
                    placeholder="请输入费用"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Wallet size={20} />
                  </span>
                </div>
              </div>
              
              {/* Dosage */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">服用用量</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all" 
                    type="text" 
                    placeholder="请输入服用用量"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Clock size={20} />
                  </span>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">开始日期</label>
                  <div className="relative">
                    <input 
                      ref={startInputRef}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="请选择开始时间" 
                      type={startFocused ? "datetime-local" : "text"}
                      step="1"
                      value={startFocused ? startDate : (startDate ? formatDateTimeToCN(startDate) : '')}
                      onFocus={() => {
                        setStartFocused(true);
                        if (startInputRef.current && 'showPicker' in startInputRef.current) {
                          try { (startInputRef.current as any).showPicker(); } catch (e) {}
                        }
                      }}
                      onBlur={() => setStartFocused(false)}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                      <Calendar size={20} />
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">结束日期</label>
                  <div className="relative">
                    <input 
                      ref={endInputRef}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="请选择结束时间"
                      type={endFocused ? "datetime-local" : "text"}
                      step="1"
                      value={endFocused ? endDate : (endDate ? formatDateTimeToCN(endDate) : '')}
                      onFocus={() => {
                        setEndFocused(true);
                        if (endInputRef.current && 'showPicker' in endInputRef.current) {
                          try { (endInputRef.current as any).showPicker(); } catch (e) {}
                        }
                      }}
                      onBlur={() => setEndFocused(false)}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                      <Calendar size={20} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">附件照片</label>
            <div className="flex flex-wrap gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-1 cursor-pointer hover:bg-slate-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-active:scale-90">
                  <Camera size={20} />
                </div>
                <p className="text-slate-400 text-[10px] font-medium text-center px-2">上传照片</p>
              </div>

              {photos.map((photo, index) => (
                <div key={index} className="relative w-24 h-24 rounded-3xl overflow-hidden group shadow-sm border border-slate-100">
                  <img alt={`Med ${index}`} className="w-full h-full object-cover" src={photo} referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 px-1">最多上传3张照片</p>
          </div>

          {/* Remarks Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">备注信息</label>
            <textarea 
              className="w-full bg-white border border-slate-100 rounded-3xl p-5 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300" 
              placeholder="请填写病情描述等备注信息" 
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md px-6 py-6 flex justify-center z-50">
        <button 
          onClick={handleSubmit}
          className="w-full max-w-lg h-14 bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all hover:bg-blue-600"
        >
          提交
        </button>
      </footer>
    </div>
  );
};

const RecordsPage = ({ onNavigate, diaryItems, medicationPlans, initialCategory }: { onNavigate: (id: Page, params?: any) => void, diaryItems: DiaryItem[], medicationPlans: MedicationPlan[], initialCategory?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCategory, setActiveCategory] = useState(initialCategory || '健康检测');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const categories = [
    { label: '健康检测', icon: Activity },
    { label: '体检报告', icon: FileText },
    { label: '病历本', icon: History },
    { label: '看病日记', icon: BookOpen },
    { label: '用药方案', icon: Pill },
  ];

  const recordItems = [
    { label: '身高/体重/腰围', icon: Scale, color: 'bg-teal-50 text-teal-400', page: 'record-hww' },
    { label: '血糖信息', icon: Droplets, color: 'bg-pink-50 text-pink-400', page: 'record-blood-sugar' },
    { label: '血压信息', icon: Waves, color: 'bg-indigo-50 text-indigo-400', page: 'record-blood-pressure' },
    { label: '血氧数据', icon: Wind, color: 'bg-blue-50 text-blue-400', page: 'record-blood-oxygen' },
    { label: '心率数据', icon: Heart, color: 'bg-red-50 text-red-400', page: 'record-heart-rate' },
    { label: '血脂数据', icon: Microscope, color: 'bg-lime-50 text-lime-400', page: 'record-blood-lipid' },
  ];

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-500 relative min-h-screen">
      <header className="text-center py-6 bg-white sticky top-0 z-40 border-b border-slate-50">
        <h1 className="text-xl font-bold text-slate-800">{activeCategory}</h1>
      </header>
      
      <div className="px-4 mt-6">
        {/* User Selection */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img alt="User" className="w-full h-full object-cover" src="https://picsum.photos/seed/user1/100/100" referrerPolicy="no-referrer" />
              </div>
              <span className="mt-2 text-sm font-medium text-slate-700">张伟</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="w-14 h-14 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                <Plus size={24} />
              </button>
              <span className="mt-2 text-sm text-slate-500">添加</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset="123.1" className="text-blue-500" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">30%</div>
            </div>
            <span className="mt-2 text-[10px] text-slate-500 whitespace-nowrap">档案完整度</span>
          </div>
        </div>

        {/* Categories */}
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`overflow-x-auto no-scrollbar -mx-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <div className="flex gap-3 px-4 pb-4 min-w-max pointer-events-none">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => setActiveCategory(cat.label)}
                className={`flex-shrink-0 w-[100px] h-[80px] rounded-xl flex flex-col items-center justify-center shadow-sm border pointer-events-auto active:scale-95 transition-all cursor-pointer ${
                  activeCategory === cat.label ? 'bg-blue-500 text-white border-blue-500 shadow-blue-200' : 'bg-white text-slate-700 border-slate-100'
                }`}
              >
                <cat.icon size={24} className={activeCategory === cat.label ? 'text-white' : 'text-blue-500'} />
                <span className="text-xs font-medium mt-1">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data List */}
        <div className={`space-y-4 mt-4 ${activeCategory === '看病日记' || activeCategory === '用药方案' ? 'pb-32' : ''}`}>
          {activeCategory === '看病日记' ? (
            diaryItems.map((item, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('record-diary-detail', item)}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-50 active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center`}>
                  <item.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 truncate">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-1">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            ))
          ) : activeCategory === '用药方案' ? (
            <div className="space-y-4">
              {medicationPlans.map((plan, i) => (
                <article key={i} className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <span className="text-slate-500 text-sm">药品名称：</span>
                        <span className="font-bold text-lg text-slate-800">{plan.name}</span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-slate-500">服用用量：</span>
                      <span className="font-medium text-slate-700">{plan.dosage}</span>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-slate-500">费用：</span>
                      <span className="font-medium text-slate-700">{plan.cost ? `¥${plan.cost}` : '未填写'}</span>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-slate-500">开始日期：</span>
                        <span className="font-medium text-slate-700">{formatDateTimeToCN(plan.startDate)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500">结束日期：</span>
                        <span className="font-medium text-slate-700">{formatDateTimeToCN(plan.endDate)}</span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="space-y-3">
                      <span className="text-slate-500 text-sm block">药品图片：</span>
                      <div className="flex gap-3">
                        {plan.images.map((img, j) => (
                          <div key={j} className="relative w-16 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                            <img alt="Med" className="w-full h-full object-cover" src={img} referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              <div className="py-6">
                <button 
                  onClick={() => onNavigate('record-medication-add')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  添加用药方案
                </button>
              </div>
            </div>
          ) : (
            recordItems.map((item, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate(item.page as Page)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm active:opacity-70 transition-opacity border border-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-lg font-medium text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button for Diary */}
      {activeCategory === '看病日记' && (
        <div className="fixed bottom-24 left-0 right-0 px-4 flex justify-center z-40">
          <button 
            onClick={() => onNavigate('record-diary-edit')}
            className="flex items-center justify-center gap-2 w-full max-w-[280px] h-[52px] bg-blue-500 text-white rounded-full shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            <PlusCircle size={24} />
            <span className="text-lg font-bold">写日记</span>
          </button>
        </div>
      )}
    </div>
  );
};

const DiaryEditPage = ({ onBack, onSave }: { onBack: () => void, onSave: (item: DiaryItem) => void }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2023-11-24');
  const [time, setTime] = useState('14:30');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入日记标题');
      return;
    }
    
    const newItem: DiaryItem = {
      title,
      date,
      desc: content || '无描述内容',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    };
    
    onSave(newItem);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-right duration-300">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <ArrowLeft size={24} className="text-slate-900" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">写日记</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <MoreVertical size={24} className="text-blue-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-3xl mx-auto">
        {/* Date Header Section */}
        <section className="mb-10">
          <span className="text-sm font-bold text-blue-500 uppercase tracking-widest block mb-2">New Entry</span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">记录您的健康状况</h2>
          <p className="mt-3 text-slate-500 leading-relaxed max-w-md">详细记录您的就诊信息和身体感受，帮助医生更好地了解您的康复过程。</p>
        </section>

        {/* Diary Title Field */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">日记标题</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Edit3 size={20} className="ml-4 text-slate-400" />
            <input 
              className="bg-transparent border-none w-full py-4 px-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0" 
              placeholder="输入日记标题" 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Form Canvas */}
        <div className="space-y-6">
          {/* Quick Date/Time Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">就诊日期</label>
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-blue-500" />
                <input 
                  className="bg-transparent border-none p-0 text-lg font-bold text-slate-800 focus:ring-0 w-full" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">具体时间</label>
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-blue-500" />
                <input 
                  className="bg-transparent border-none p-0 text-lg font-bold text-slate-800 focus:ring-0 w-full" 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Medical Entity Fields */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="relative group">
              <label className="text-xs font-bold text-slate-400 mb-1 ml-1 block">医院 / 诊所 (选填)</label>
              <div className="flex items-center bg-slate-50 rounded-xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <Hospital size={20} className="ml-4 text-slate-400" />
                <input 
                  className="bg-transparent border-none w-full py-4 px-4 text-slate-700 placeholder:text-slate-300 focus:ring-0" 
                  placeholder="输入医疗机构名称" 
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
            </div>
            <div className="relative group">
              <label className="text-xs font-bold text-slate-400 mb-1 ml-1 block">主治医生 (选填)</label>
              <div className="flex items-center bg-slate-50 rounded-xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <User size={20} className="ml-4 text-slate-400" />
                <input 
                  className="bg-transparent border-none w-full py-4 px-4 text-slate-700 placeholder:text-slate-300 focus:ring-0" 
                  placeholder="输入医生姓名" 
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="text-xs font-bold text-slate-400 mb-3 ml-1 block uppercase tracking-wider">症状与感受</label>
            <textarea 
              className="bg-slate-50 border-none w-full rounded-xl p-4 text-slate-700 leading-relaxed placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" 
              placeholder="描述您的症状、身体反应或任何异常情况..." 
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            {/* Photos/Attachments */}
            <div className="mt-8">
              <label className="text-xs font-bold text-slate-400 mb-4 ml-1 block uppercase tracking-wider">附件 (处方或报告)</label>
              <div className="flex flex-wrap gap-4">
                {/* Upload Slot */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all group active:scale-95"
                >
                  <Camera size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">拍摄/上传</span>
                </button>
                
                {/* Photo Previews */}
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden group shadow-sm border border-slate-100">
                    <img alt={`Upload ${index}`} className="w-full h-full object-cover" src={photo} referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent z-40">
          <div className="max-w-3xl mx-auto">
            <button onClick={handleSave} className="w-full py-4 bg-blue-500 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-white font-bold text-lg active:scale-95 transition-transform">
              <Save size={20} />
              保存日记
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const DiaryDetailPage = ({ item, onBack }: { item: DiaryItem, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <ArrowLeft size={24} className="text-slate-900" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">日记详情</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <Share2 size={24} className="text-blue-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full">
              <MoreVertical size={24} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 pb-12 max-w-3xl mx-auto">
        {/* Header Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center`}>
              <item.icon size={20} />
            </div>
            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Medical Diary</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{item.title}</h2>
          <div className="flex items-center gap-4 mt-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span className="text-sm font-medium">{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span className="text-sm font-medium">14:30</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <Hospital size={18} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">就诊机构</span>
            </div>
            <p className="text-slate-800 font-bold">市中心医院</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">主治医生</span>
            </div>
            <p className="text-slate-800 font-bold">张医生</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800">症状与感受</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {item.desc}
          </p>
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={20} className="text-slate-400" />
              <h4 className="font-bold text-slate-800">相关附件</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img alt="Report 1" className="w-full h-full object-cover" src="https://picsum.photos/seed/report1/400/400" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img alt="Report 2" className="w-full h-full object-cover" src="https://picsum.photos/seed/report2/400/400" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 active:scale-95 transition-transform">
            编辑记录
          </button>
          <button className="flex-1 py-4 bg-blue-500 rounded-2xl font-bold text-white shadow-lg shadow-blue-100 active:scale-95 transition-transform">
            导出报告
          </button>
        </div>
      </main>
    </div>
  );
};

const StewardPage = () => {
  return (
    <div className="pb-24 animate-in slide-in-from-right duration-500">
      <header className="text-center py-6 bg-white sticky top-0 z-40 border-b border-slate-50">
        <h1 className="text-xl font-bold text-slate-800">健康管家</h1>
      </header>
      
      <main className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">您的专属健康管家</h2>
            <p className="text-blue-100 text-sm opacity-90 mb-8">为您提供全方位的就医协助与健康管理服务</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <ShieldCheck className="mb-2 text-blue-200" size={24} />
                <p className="font-bold">绿色通道</p>
                <p className="text-[10px] text-blue-100">优先预约专家资源</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <Headphones className="mb-2 text-blue-200" size={24} />
                <p className="font-bold">专属顾问</p>
                <p className="text-[10px] text-blue-100">一对一贴心服务</p>
              </div>
            </div>
            <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform">
              立即开启管家服务
            </button>
          </div>
          <ShieldCheck size={200} className="absolute -right-10 -bottom-10 opacity-10 text-white" />
        </div>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">服务特权</h3>
          <div className="space-y-3">
            {[
              { title: '专家预约挂号', desc: '覆盖全国知名三甲医院主任级专家', icon: UserSearch },
              { title: '全程陪诊服务', desc: '专业陪诊员到院衔接，省心省力', icon: ClipboardList },
              { title: '住院手术协调', desc: '关键时刻协调医疗资源，加速救治', icon: Hospital },
              { title: '健康档案管理', desc: '系统化管理全家健康数据，随时查阅', icon: FileText },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-50 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const ProfilePage = ({ onNavigate }: { onNavigate: (id: Page, params?: any) => void }) => {
  return (
    <div className="pb-24 animate-in slide-in-from-left duration-500">
      {/* User Header */}
      <div className="px-5 pt-8 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <img alt="Avatar" className="w-full h-full object-cover" src="https://picsum.photos/seed/me/100/100" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-800">昵称111</span>
              <Edit3 size={14} className="text-slate-400" />
            </div>
            <div className="inline-flex items-center gap-1 bg-amber-400 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              <Award size={12} /> 会员用户
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400">
          <Share2 size={20} />
        </button>
      </div>

      <div className="px-4 mt-8 space-y-4">
        {/* Account Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
          <h3 className="font-bold text-lg mb-4 text-slate-800">我的账户</h3>
          <div className="flex items-center">
            <div 
              onClick={() => onNavigate('account-points')}
              className="flex-1 text-center border-r border-slate-100 cursor-pointer active:opacity-70 transition-opacity"
            >
              <p className="text-xs text-slate-500 mb-1">剩余积分</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-800">0</span>
                <span className="text-xs text-slate-400">分</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Wallet size={16} />
                </div>
              </div>
            </div>
            <div 
              onClick={() => onNavigate('account-services')}
              className="flex-1 text-center border-r border-slate-100 cursor-pointer active:opacity-70 transition-opacity"
            >
              <p className="text-xs text-slate-500 mb-1">剩余陪诊</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-800">3</span>
                <span className="text-xs text-slate-400">次</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Stethoscope size={16} />
                </div>
              </div>
            </div>
            <div 
              onClick={() => onNavigate('account-coupons')}
              className="flex-1 text-center cursor-pointer active:opacity-70 transition-opacity"
            >
              <p className="text-xs text-slate-500 mb-1">优惠券</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-800">1</span>
                <div className="w-10 h-7 bg-orange-50 rounded flex items-center justify-center text-orange-400">
                  <Ticket size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Banner */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-4 flex justify-between items-center">
          <div className="text-amber-900">
            <span className="font-bold">家庭健康管家 |</span>
            <span className="text-xs ml-1">帮您省钱</span>
          </div>
          <button className="bg-amber-700 text-white text-xs px-4 py-2 rounded-full flex items-center gap-1">
            开通管家 <ChevronRight size={12} />
          </button>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
          <h3 className="font-bold text-lg mb-6 text-slate-800">我的订单</h3>
          <div className="grid grid-cols-5 gap-4 text-center">
            {[
              { label: '全部', icon: Package, id: 'order-list' },
              { label: '进行中', icon: Timer, id: 'order-list' },
              { label: '已完成', icon: CheckCircle2, id: 'order-list' },
              { label: '已取消', icon: XCircle, id: 'order-list' },
              { label: '购物车', icon: ShoppingCart, id: 'cart' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => item.id && onNavigate(item.id as Page)}
                className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl text-blue-500">
                  <item.icon size={20} />
                </div>
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Family Members */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-slate-800">家庭成员</h3>
            <button 
              onClick={() => onNavigate('patient-management')}
              className="text-xs text-slate-500 flex items-center active:text-blue-500 transition-colors"
            >
              成员管理 <ChevronRight size={14} />
            </button>
          </div>
          <div className="relative overflow-hidden -mx-5 px-5">
            <motion.div 
              drag="x"
              dragConstraints={{ left: -650, right: 0 }}
              dragElastic={0.1}
              className="flex gap-3 cursor-grab active:cursor-grabbing pb-2 w-max pr-5"
            >
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '张伟', relation: '本人', gender: '男' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-blue-50 p-3 relative overflow-hidden border border-blue-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-blue-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-blue-600">本人</div>
                <p className="font-bold text-sm text-blue-800">张伟</p>
                <p className="text-[10px] text-blue-400 mt-1">24岁 男</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '张丽丽', relation: '母亲', gender: '女' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-rose-50 p-3 relative overflow-hidden border border-rose-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-rose-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-rose-600">母亲</div>
                <p className="font-bold text-sm text-rose-800">张丽丽</p>
                <p className="text-[10px] text-rose-400 mt-1">53岁 女</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '张建国', relation: '父亲', gender: '男' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-indigo-50 p-3 relative overflow-hidden border border-indigo-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-indigo-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-indigo-600">父亲</div>
                <p className="font-bold text-sm text-indigo-800">张建国</p>
                <p className="text-[10px] text-indigo-400 mt-1">55岁 男</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '王小红', relation: '配偶', gender: '女' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-emerald-50 p-3 relative overflow-hidden border border-emerald-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-emerald-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-emerald-600">配偶</div>
                <p className="font-bold text-sm text-emerald-800">王小红</p>
                <p className="text-[10px] text-emerald-400 mt-1">24岁 女</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '张大爷', relation: '爷爷', gender: '男' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-amber-50 p-3 relative overflow-hidden border border-amber-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-amber-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-amber-600">爷爷</div>
                <p className="font-bold text-sm text-amber-800">张大爷</p>
                <p className="text-[10px] text-amber-400 mt-1">78岁 男</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { patient: { name: '李大妈', relation: '奶奶', gender: '女' } })}
                className="flex-shrink-0 w-32 h-20 rounded-xl bg-purple-50 p-3 relative overflow-hidden border border-purple-100 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <div className="absolute top-0 right-0 bg-purple-100 text-[10px] px-1.5 py-0.5 rounded-bl-lg text-purple-600">奶奶</div>
                <p className="font-bold text-sm text-purple-800">李大妈</p>
                <p className="text-[10px] text-purple-400 mt-1">75岁 女</p>
              </div>
              <div 
                onClick={() => onNavigate('add-member', { from: 'profile' })}
                className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 cursor-pointer active:scale-95 transition-transform select-none"
              >
                <Plus size={24} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
          <h3 className="font-bold text-lg mb-6 text-slate-800">常用工具</h3>
          <div className="grid grid-cols-5 gap-y-6 text-center">
            {[
              { label: '在线客服', icon: Headphones, id: 'customer-service' },
              { label: '修改密码', icon: Lock },
              { label: '申请发票', icon: FileText, id: 'invoice-list' },
              { label: '扫一扫', icon: QrCode },
              { label: '反馈', icon: MessageSquare, id: 'feedback' },
              { label: '分销中心', icon: Share2, id: 'distribution-center' },
            ].map((tool, i) => (
              <div 
                key={i} 
                onClick={() => tool.id && onNavigate(tool.id as Page)}
                className="flex flex-col items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity"
              >
                <tool.icon size={24} className="text-rose-300" />
                <span className="text-[10px] text-slate-600">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllSpecialtiesPage = ({ onNavigate, onBack }: { onNavigate: (id: Page, params?: any) => void, onBack: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const specialties = [
    { label: '肿瘤科', icon: Microscope, color: 'bg-rose-50 text-rose-500' },
    { label: '神经内科', icon: Brain, color: 'bg-indigo-50 text-indigo-500' },
    { label: '神经外科', icon: Stethoscope, color: 'bg-cyan-50 text-cyan-500' },
    { label: '心内科', icon: Heart, color: 'bg-red-50 text-red-500' },
    { label: '血液科', icon: Droplets, color: 'bg-blue-50 text-blue-500' },
    { label: '肾病内科', icon: Activity, color: 'bg-emerald-50 text-emerald-500' },
    { label: '内分泌科', icon: Pill, color: 'bg-amber-50 text-amber-500' },
    { label: '消化内科', icon: Thermometer, color: 'bg-sky-50 text-sky-500' },
    { label: '呼吸科', icon: Wind, color: 'bg-blue-50 text-blue-500' },
    { label: '肝胆科', icon: Activity, color: 'bg-green-50 text-green-500' },
    { label: '骨科', icon: Activity, color: 'bg-orange-50 text-orange-500' },
    { label: '皮肤科', icon: User, color: 'bg-pink-50 text-pink-500' },
    { label: '妇产科', icon: Heart, color: 'bg-rose-50 text-rose-500' },
    { label: '儿科', icon: User, color: 'bg-yellow-50 text-yellow-500' },
    { label: '眼科', icon: Search, color: 'bg-blue-50 text-blue-500' },
    { label: '耳鼻喉科', icon: Headphones, color: 'bg-indigo-50 text-indigo-500' },
    { label: '口腔科', icon: ShieldCheck, color: 'bg-cyan-50 text-cyan-500' },
    { label: '康复科', icon: Activity, color: 'bg-emerald-50 text-emerald-500' },
    { label: '精神科', icon: Brain, color: 'bg-purple-50 text-purple-500' },
    { label: '老年科', icon: User, color: 'bg-slate-50 text-slate-500' },
    { label: '泌尿外科', icon: Droplets, color: 'bg-blue-50 text-blue-500' },
    { label: '胸外科', icon: Wind, color: 'bg-sky-50 text-sky-500' },
    { label: '普外科', icon: Stethoscope, color: 'bg-slate-50 text-slate-500' },
    { label: '血管外科', icon: Activity, color: 'bg-red-50 text-red-500' },
    { label: '烧伤科', icon: Thermometer, color: 'bg-orange-50 text-orange-500' },
    { label: '感染科', icon: ShieldCheck, color: 'bg-green-50 text-green-500' },
    { label: '风湿免疫', icon: Activity, color: 'bg-indigo-50 text-indigo-500' },
    { label: '变态反应', icon: Wind, color: 'bg-amber-50 text-amber-500' },
    { label: '疼痛科', icon: Zap, color: 'bg-rose-50 text-rose-500' },
    { label: '急诊科', icon: Bell, color: 'bg-red-50 text-red-500' },
  ];

  const filteredSpecialties = specialties.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-10">
      <Header title="全部科室" onBack={onBack} />
      
      <div className="p-4 space-y-6">
        {/* Filter Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="科室名称筛选"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-slate-600"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>

        {/* Specialty Grid */}
        {filteredSpecialties.length > 0 ? (
          <div className="grid grid-cols-4 gap-y-10">
            {filteredSpecialties.map((item, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('doctor-selection', item.label)}
                className="flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition-transform"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <item.icon size={26} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-slate-400">未找到相关科室</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<PageState>({ id: 'home' });
  const [history, setHistory] = useState<PageState[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [diaryItems, setDiaryItems] = useState<DiaryItem[]>([
    { title: '年度常规体检', date: '2023-11-05', desc: '在市中心医院进行了全身体检，结果基本正常。', icon: Stethoscope, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: '轻微感冒症状', date: '2023-10-24', desc: '嗓子疼，伴随轻微发烧。遵医嘱休息中。', icon: Thermometer, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { title: '眼科门诊复查', date: '2023-10-12', desc: '检查视力状况，眼压正常。建议减少手机使用。', icon: Eye, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: '压力管理咨询', date: '2023-09-28', desc: '近期睡眠质量不佳，与医生讨论了放松技巧。', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ]);

  const [medicationPlans, setMedicationPlans] = useState<MedicationPlan[]>([
    {
      name: '阿莫西林',
      dosage: '一天三次，饭后服用',
      cost: '25.00',
      startDate: '2026-02-02',
      endDate: '2026-02-09',
      images: [
        'https://picsum.photos/seed/med1/200/200',
        'https://picsum.photos/seed/med2/200/200'
      ]
    },
    {
      name: '维C泡腾片',
      dosage: '一天一次',
      cost: '15.00',
      startDate: '2026-02-02',
      endDate: '2026-02-15',
      images: [
        'https://picsum.photos/seed/med3/200/200'
      ]
    }
  ]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.title === item.title);
      if (existing) {
        return prev.map(i => i.title === item.title ? { ...i, count: i.count + 1 } : i);
      }
      return [...prev, { ...item, id: Date.now(), count: 1, selected: true }];
    });
    setToast('加入购物车成功');
  };

  const navigateTo = (id: Page, params?: any, replace = false) => {
    const isTab = ['home', 'records', 'steward', 'profile'].includes(id);
    
    if (isTab) {
      setHistory([]);
    } else if (!replace) {
      setHistory(prev => [...prev, view]);
    }
    
    setView({ id, params });
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevView = newHistory.pop()!;
      setHistory(newHistory);
      setView(prevView);
      window.scrollTo(0, 0);
    } else {
      setView({ id: 'home' });
      setHistory([]);
    }
  };

  const renderPage = () => {
    switch (view.id) {
      case 'home': return <HomePage onNavigate={navigateTo} />;
      case 'records': return <RecordsPage onNavigate={navigateTo} diaryItems={diaryItems} medicationPlans={medicationPlans} initialCategory={view.params?.category} />;
      case 'record-hww': return <HeightWeightWaistPage onBack={handleBack} />;
      case 'record-blood-sugar': return <EmptyRecordPage title="血糖" onBack={handleBack} />;
      case 'record-blood-pressure': return <BloodPressureListPage onBack={handleBack} onAdd={() => navigateTo('record-blood-pressure-entry')} />;
      case 'record-blood-pressure-entry': return <BloodPressureEntryPage onBack={handleBack} />;
      case 'record-blood-oxygen': return <EmptyRecordPage title="血氧" onBack={handleBack} />;
      case 'record-blood-lipid': return <BloodLipidListPage onBack={handleBack} onAdd={() => navigateTo('record-blood-lipid-entry')} />;
      case 'record-blood-lipid-entry': return <BloodLipidEntryPage onBack={handleBack} />;
      case 'record-heart-rate': return <EmptyRecordPage title="心率" onBack={handleBack} />;
      case 'record-diary-edit': return (
        <DiaryEditPage 
          onBack={handleBack} 
          onSave={(item) => {
            setDiaryItems(prev => [item, ...prev]);
            setToast('添加成功');
            navigateTo('records', { category: '看病日记' });
          }} 
        />
      );
      case 'record-diary-detail': return <DiaryDetailPage item={view.params} onBack={handleBack} />;
      case 'record-medication-add': return (
        <MedicationPlanAddPage 
          onBack={handleBack} 
          onSave={(plan) => {
            setMedicationPlans(prev => [plan, ...prev]);
            setToast('添加成功');
            navigateTo('records', { category: '用药方案' });
          }} 
        />
      );
      case 'steward': return <StewardPage />;
      case 'profile': return <ProfilePage onNavigate={navigateTo} />;
      case 'doctor-list': return <DoctorListPage onNavigate={navigateTo} onBack={handleBack} />;
      case 'hospital-list': return <HospitalListPage onBack={handleBack} />;
      case 'specialty-detail': return <SpecialtyDetailPage specialty={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'service-detail': return <ServiceDetailPage service={view.params} onNavigate={navigateTo} onBack={handleBack} addToCart={addToCart} />;
      case 'service-order': return <ServiceOrderPage service={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'service-order-detail': return <ServiceOrderDetailPage service={view.params} onBack={handleBack} />;
      case 'doctor-selection': return <DoctorSelectionPage specialty={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'doctor-detail': return <DoctorDetailPage doctor={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'appointment-registration': return <AppointmentRegistrationPage params={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'distribution-center': return <DistributionCenterPage onNavigate={navigateTo} onBack={handleBack} />;
      case 'withdraw': return <WithdrawPage onNavigate={navigateTo} onBack={handleBack} />;
      case 'withdrawal-records': return <WithdrawalRecordsPage onBack={handleBack} />;
      case 'promotion-stats': return <PromotionStatsPage onBack={handleBack} />;
      case 'distribution-orders': return <DistributionOrdersPage onBack={handleBack} />;
      case 'promotion-card': return <PromotionCardPage onBack={handleBack} />;
      case 'bank-card': return <BankCardPage onBack={handleBack} />;
      case 'patient-management': return <PatientManagementPage params={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'add-member': return <AddMemberPage params={view.params} onBack={handleBack} />;
      case 'cart': return <CartPage items={cart} setItems={setCart} onBack={handleBack} />;
      case 'invoice-list': return <InvoiceListPage onNavigate={navigateTo} onBack={handleBack} />;
      case 'invoice-form': return <InvoiceFormPage onBack={handleBack} />;
      case 'order-list': return <OrderListPage onNavigate={navigateTo} onBack={handleBack} />;
      case 'feedback': return <FeedbackPage onBack={handleBack} />;
      case 'customer-service': return <CustomerServicePage onBack={handleBack} />;
      case 'account-points': return <AccountPage initialTab="points" onBack={handleBack} />;
      case 'account-coupons': return <AccountPage initialTab="coupons" onBack={handleBack} />;
      case 'account-services': return <AccountPage initialTab="services" onBack={handleBack} />;
      case 'payment-confirm': return <PaymentConfirmPage service={view.params} onNavigate={navigateTo} onBack={handleBack} />;
      case 'payment-success': return <PaymentSuccessPage service={view.params} onNavigate={navigateTo} />;
      case 'payment-failure': return <PaymentFailurePage service={view.params} onNavigate={navigateTo} />;
      case 'all-specialties': return <AllSpecialtiesPage onNavigate={navigateTo} onBack={handleBack} />;
      default: return <HomePage onNavigate={navigateTo} />;
    }
  };

  const isTab = ['home', 'records', 'steward', 'profile'].includes(view.id);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={view.id + (view.params?.title || '')}
          initial={{ opacity: 0, x: isTab ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isTab ? 0 : -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      {isTab && <BottomNav activeTab={view.id} setActiveTab={(id) => navigateTo(id as Page)} />}
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
