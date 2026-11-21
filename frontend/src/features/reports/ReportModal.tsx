import React, { useState } from 'react';
import { Flag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Modal } from '../../components/ui/Modal.js';
import { Select } from '../../components/ui/Select.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { Button } from '../../components/ui/Button.js';
import { api } from '../../services/apiClient.js';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'profile' | 'message' | 'review';
  targetId: string;
  targetName?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}) => {
  const [reason, setReason] = useState('Inappropriate behavior');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reasons = [
    { value: 'Inappropriate behavior', label: 'Inappropriate behavior' },
    { value: 'Harassment or offensive language', label: 'Harassment or offensive language' },
    { value: 'Spam or commercial promotion', label: 'Spam or commercial promotion' },
    { value: 'Repeated session no-show', label: 'Repeated session no-show' },
    { value: 'Other policy violation', label: 'Other policy violation' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/reports', {
        targetType,
        targetId,
        reason,
        description,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Unable to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Report ${targetType}`}
      description={
        targetName
          ? `Submit a concern regarding ${targetName}. Reports are directly reviewed by human community moderators.`
          : 'Submit a concern to our community moderation team.'
      }
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(208, 0, 0, 0.08)',
              color: 'var(--color-crimson-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3) auto',
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-950)', marginBottom: 'var(--space-1)' }}>
            Report Submitted
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 'var(--space-6)', maxWidth: '380px', margin: '0 auto var(--space-6) auto' }}>
            Thank you for helping uphold our community code of conduct. A staff moderator will review this case shortly.
          </p>
          <Button onClick={handleClose}>Close Window</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error ? (
            <div
              role="alert"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(208, 0, 0, 0.08)',
                color: 'var(--color-crimson-600)',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          ) : null}

          <Select
            label="Primary Reason for Concern"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={reasons}
          />

          <Textarea
            label="Additional Context (optional)"
            placeholder="Please provide any specific dates, context, or details that will assist our staff in evaluating this situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" isLoading={loading}>
              <Flag size={14} /> Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
