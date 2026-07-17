import { useEffect, useState } from 'react';
import { Calendar, Clock, Stethoscope, CheckCircle2, Loader2, User, Mail, ArrowRight } from 'lucide-react';
import { supabase, type DoctorAppointment } from '../lib/supabase';
import { Modal, Field, inputCls, ErrorBox } from '../components/Modal';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function nextDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const STATUS_META: Record<string, { label: string; badge: string }> = {
  pending: { label: 'Beklemede', badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  confirmed: { label: 'Onaylandı', badge: 'bg-navy-50 text-navy-700 ring-navy-200' },
  cancelled: { label: 'İptal', badge: 'bg-red-50 text-red-700 ring-red-200' },
};

export function DoctorView() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [myEmail, setMyEmail] = useState('');

  const days = nextDays(14);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('doctor_appointments').select('*').order('appointment_date', { ascending: true });
    if (error) console.error(error);
    setAppointments((data as DoctorAppointment[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    const booked = new Set<string>();
    appointments.forEach((a) => { if (a.status !== 'cancelled') booked.add(`${a.appointment_date}_${a.appointment_time}`); });
    setBookedSlots(booked);
  }, [appointments]);

  const myAppointments = appointments.filter((a) => a.employee_email === myEmail);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 text-cream-50 p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-navy-500/20 flex items-center justify-center ring-1 ring-navy-400/30 shrink-0"><Stethoscope className="h-8 w-8 text-cream-100" /></div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold">Dr. Ayşe Şahin</h2>
          <p className="text-navy-200 text-sm">İş Yeri Hekimi · Dahiliye Uzmanı</p>
          <p className="text-navy-300 text-xs mt-1">Hafta içi 09:00 - 16:00 · Ana Merkez Sağlık Ocağı</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-5 py-2.5 rounded-xl bg-cream-50 text-navy-800 text-sm font-semibold hover:bg-cream-100 transition-colors">Randevu Oluştur</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-navy-500" /> Müsait Günler</h3>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const d = new Date(day);
              const active = selectedDate === day;
              return (
                <button key={day} onClick={() => { setSelectedDate(day); setSelectedTime(''); }} className={`flex flex-col items-center py-2.5 rounded-lg border transition-all ${active ? 'bg-navy-600 text-cream-50 border-navy-600' : 'bg-cream-50 text-navy-700 border-cream-300 hover:border-navy-300'}`}>
                  <span className="text-[10px] font-medium uppercase">{d.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                  <span className="text-lg font-bold leading-none mt-0.5">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-4 animate-fade-in">
              <h4 className="text-sm font-medium text-navy-700 mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-navy-400" /> {formatDate(selectedDate)} için saatler</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isBooked = bookedSlots.has(`${selectedDate}_${time}`);
                  const active = selectedTime === time;
                  return (
                    <button key={time} disabled={isBooked} onClick={() => setSelectedTime(time)} className={`py-2 rounded-lg text-sm font-medium transition-all ${isBooked ? 'bg-cream-100 text-navy-300 cursor-not-allowed line-through' : active ? 'bg-navy-600 text-cream-50' : 'bg-cream-50 text-navy-700 border border-cream-300 hover:border-navy-300'}`}>{time}</button>
                  );
                })}
              </div>
              {selectedTime && <button onClick={() => setShowForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-600 text-cream-50 text-sm font-semibold hover:bg-navy-700 transition-colors">{selectedTime} için randevu al <ArrowRight className="h-4 w-4" /></button>}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-navy-500" /> Randevularım</h3>
          <div className="mb-3">
            <input value={myEmail} onChange={(e) => setMyEmail(e.target.value)} placeholder="E-postanızla randevularınızı görün…" className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all" />
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-navy-400 py-4"><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…</div>
          ) : myAppointments.length === 0 ? (
            <div className="text-center py-10 text-navy-400 text-sm rounded-xl bg-cream-50 border border-cream-300">{myEmail ? 'Randevunuz bulunmuyor.' : 'E-posta girerek randevularınızı görüntüleyin.'}</div>
          ) : (
            <div className="space-y-2">
              {myAppointments.map((apt) => {
                const sm = STATUS_META[apt.status] || STATUS_META.pending;
                return (
                  <div key={apt.id} className="flex items-center gap-3 rounded-xl bg-cream-50 border border-cream-300 p-3 shadow-soft">
                    <div className="h-12 w-12 rounded-lg bg-navy-600 text-cream-50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-medium uppercase">{new Date(apt.appointment_date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                      <span className="text-sm font-bold leading-none">{new Date(apt.appointment_date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-navy-900">{apt.appointment_time}</p>{apt.reason && <p className="text-xs text-navy-500 line-clamp-1">{apt.reason}</p>}</div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1 ${sm.badge}`}>{sm.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && <AppointmentForm date={selectedDate} time={selectedTime} email={myEmail} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function AppointmentForm({ date, time, email, onClose, onSaved }: { date: string; time: string; email: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ employee_name: '', employee_email: email, appointment_date: date, appointment_time: time, reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from('doctor_appointments').insert({ ...form, status: 'pending' });
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  }

  return (
    <Modal title="Randevu Oluştur" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <ErrorBox message={error} />}
        <div className="rounded-xl bg-navy-50 border border-navy-200 p-3 text-sm text-navy-700">
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {date ? formatDate(date) : 'Tarih seçilmedi'}</p>
          <p className="flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> {time || 'Saat seçilmedi'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ad Soyad"><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" /><input required value={form.employee_name} onChange={(e) => setForm({ ...form, employee_name: e.target.value })} className={`${inputCls} pl-9`} /></div></Field>
          <Field label="E-posta"><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" /><input required type="email" value={form.employee_email} onChange={(e) => setForm({ ...form, employee_email: e.target.value })} className={`${inputCls} pl-9`} /></div></Field>
        </div>
        <Field label="Görüşme Nedeni (opsiyonel)"><textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} className={inputCls} placeholder="Örn: Aylık kontrol, iş güvenliği muayenesi…" /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-cream-200 transition-colors">İptal</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-600 text-cream-50 text-sm font-semibold hover:bg-navy-700 disabled:opacity-60 transition-colors">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Randevuyu Onayla</button>
        </div>
      </form>
    </Modal>
  );
}
