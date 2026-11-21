import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Select } from '../../components/ui/Select.js';
import { Input } from '../../components/ui/Input.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { AvailabilitySlot } from '../../types/index.js';

export const AccountSettingsPage: React.FC = () => {
  const [slots, setSlots] = useState<Array<{ weekday: number; startMinute: number; endMinute: number }>>([]);
  const [newWeekday, setNewWeekday] = useState(1); // Monday
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('17:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const weekdays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const res: any = await api.get('/members/me');
        if (res.availability) {
          setSlots(
            res.availability.map((a: AvailabilitySlot) => ({
              weekday: a.weekday,
              startMinute: a.startMinute,
              endMinute: a.endMinute,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAvailability();
  }, []);

  const handleAddSlot = () => {
    const start = timeToMinutes(newStartTime);
    const end = timeToMinutes(newEndTime);
    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }
    setSlots([...slots, { weekday: newWeekday, startMinute: start, endMinute: end }]);
  };

  const handleRemoveSlot = (idx: number) => {
    setSlots(slots.filter((_, i) => i !== idx));
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/members/me/availability', slots);
      setSaved(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update availability.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading account settings..." />;
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
          Account & Availability Settings
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Configure weekly availability windows to make scheduling learning sessions effortless.
        </p>
      </div>

      {saved ? (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(250, 163, 7, 0.12)',
            color: 'var(--color-ink-950)',
            border: '1px solid rgba(250, 163, 7, 0.3)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} color="var(--color-amber-500)" />
          Availability windows updated successfully.
        </div>
      ) : null}

      <div
        className="paper-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--color-line)', paddingBottom: 'var(--space-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
            Weekly Recurring Availability
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Prospective exchange partners can see these windows when proposing sessions.
          </p>
        </div>

        {/* Add slot controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            alignItems: 'flex-end',
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(3, 7, 30, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-line)',
          }}
        >
          <div style={{ width: '160px' }}>
            <Select
              label="Day of week"
              value={newWeekday}
              onChange={(e) => setNewWeekday(parseInt(e.target.value, 10))}
              options={weekdays}
            />
          </div>

          <div style={{ width: '130px' }}>
            <Input
              label="From"
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
          </div>

          <div style={{ width: '130px' }}>
            <Input
              label="To"
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
          </div>

          <Button type="button" variant="secondary" onClick={handleAddSlot} style={{ height: '42px' }}>
            <Plus size={16} /> Add Window
          </Button>
        </div>

        {/* Current slots list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
            Configured Time Windows ({slots.length})
          </h3>

          {slots.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                backgroundColor: 'rgba(3, 7, 30, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--color-line)',
              }}
            >
              <Calendar size={24} style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0 }}>
                No regular availability windows configured. You can still coordinate session times directly in chat messages.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
              {slots.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-line)',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(208, 0, 0, 0.08)',
                        color: 'var(--color-crimson-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-ink-950)' }}>
                        {weekdays.find((w) => w.value === s.weekday)?.label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                        {minutesToTime(s.startMinute)} – {minutesToTime(s.endMinute)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    aria-label="Remove window"
                    title="Remove window"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-danger)',
                      padding: '6px',
                      borderRadius: 'var(--radius-control)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <Button onClick={handleSaveAvailability} isLoading={saving}>
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  );
};
