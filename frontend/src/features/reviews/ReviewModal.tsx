import React, { useState } from 'react';
import { Star, Sparkles, MessageSquare } from 'lucide-react';
import { Modal } from '../../components/ui/Modal.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { Button } from '../../components/ui/Button.js';
import { api } from '../../services/apiClient.js';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  partnerName: string;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  partnerName,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(`/sessions/${sessionId}/reviews`, {
        rating,
        body: body.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unable to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Post-Session Feedback"
      description={`Share your honest review of your learning exchange with ${partnerName}. Written feedback helps build community trust and reciprocity.`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {error ? (
          <div
            role="alert"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-control)',
              backgroundColor: 'rgba(179, 78, 74, 0.08)',
              color: 'var(--color-danger)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        ) : null}

        {/* Interactive Star rating selector */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(250, 163, 7, 0.08)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(250, 163, 7, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
            Overall Learning Experience
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? star <= hoverRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--space-1)',
                    transition: 'transform 0.15s ease',
                  }}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(null)}
                >
                  <Star
                    size={32}
                    fill={active ? '#FFBA08' : 'none'}
                    color={active ? '#FFBA08' : 'var(--color-line)'}
                  />
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 500 }}>
            {hoverRating ? `${hoverRating} of 5 Stars` : `${rating} of 5 Stars`}
          </div>
        </div>

        <Textarea
          label="Written Testimonial & Practical Takeaways (optional)"
          placeholder="Describe what you learned, how helpful your partner was, and any practical takeaways from this exchange..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};
