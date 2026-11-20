import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Calendar, Flag, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { ReportModal } from '../reports/ReportModal.js';
import { api } from '../../services/apiClient.js';
import { Conversation, Message } from '../../types/index.js';

export const MessagesPage: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadConversations = async () => {
    try {
      const res: any = await api.get('/conversations');
      setConversations(res.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (cId: string) => {
    try {
      const res: any = await api.get(`/conversations/${cId}/messages?limit=100`);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
      const interval = setInterval(() => loadMessages(conversationId), 3000);
      return () => clearInterval(interval);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !inputText.trim() || sending) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res: any = await api.post(`/conversations/${conversationId}/messages`, {
        body: text,
      });
      setMessages((prev) => [...prev, res.message]);
    } catch (err) {
      console.error(err);
      setInputText(text); // Restore draft on failure
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === conversationId);

  if (loading) {
    return <LoadingSpinner message="Loading messages..." />;
  }

  return (
    <div
      className="paper-card"
      style={{
        display: 'flex',
        height: 'calc(100vh - 136px)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Conversations List (Left Panel) per design.md §10.7 */}
      <div
        style={{
          width: '320px',
          borderRight: '1px solid var(--color-line)',
          backgroundColor: 'rgba(255, 254, 250, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <MessageSquare size={18} color="var(--color-jade-700)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--color-forest-950)',
              }}
            >
              Conversations
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)' }}>
            {conversations.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
              No active conversations yet. Connect with learning partners to start chatting.
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = c.id === conversationId;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/app/messages/${c.id}`)}
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '1px solid rgba(228, 228, 217, 0.6)',
                    backgroundColor: isSelected ? 'var(--color-jade-100)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--color-jade-700)' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Avatar name={c.partner.displayName} avatarUrl={c.partner.avatarUrl} size={40} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '0.875rem',
                        color: 'var(--color-forest-950)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {c.partner.displayName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: isSelected ? 'var(--color-forest-900)' : 'var(--color-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}
                    >
                      {c.lastMessage ? c.lastMessage.body : 'No messages yet'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation Details (Right Panel) */}
      {activeConversation ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-paper)' }}>
          {/* Header */}
          <div
            style={{
              height: '64px',
              borderBottom: '1px solid var(--color-line)',
              padding: '0 var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 254, 250, 0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Avatar
                name={activeConversation.partner.displayName}
                avatarUrl={activeConversation.partner.avatarUrl}
                size={36}
              />
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-forest-950)', fontFamily: 'var(--font-display)' }}>
                  {activeConversation.partner.displayName}
                </span>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                  Active learning connection
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <Button size="sm" variant="secondary" onClick={() => navigate('/app/sessions')}>
                <Calendar size={14} /> Propose session
              </Button>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                aria-label="Report conversation"
                title="Report message or partner"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Flag size={16} />
              </button>
            </div>
          </div>

          {/* Messages Thread per design.md §10.7 */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              backgroundColor: 'rgba(245, 241, 232, 0.25)',
            }}
          >
            {messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '420px', padding: 'var(--space-8)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-sage-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-3)',
                  }}
                >
                  <MessageSquare size={22} color="var(--color-jade-700)" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-forest-950)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-1)' }}>
                  Start your conversation
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  This is the beginning of your direct conversation with {activeConversation.partner.displayName}. Say hello and discuss what topics you want to explore together!
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId !== activeConversation.partner.id;
                return (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '68%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isMe ? 'var(--color-jade-700)' : 'var(--color-paper)',
                        color: isMe ? 'var(--color-white)' : 'var(--color-forest-950)',
                        border: isMe ? '1px solid rgba(40, 117, 101, 0.3)' : '1px solid var(--color-line)',
                        padding: '10px 16px',
                        borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                        fontSize: '0.9375rem',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                        boxShadow: 'var(--shadow-soft)',
                      }}
                    >
                      {m.body}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--color-muted)',
                        marginTop: '3px',
                        padding: '0 4px',
                      }}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              borderTop: '1px solid var(--color-line)',
              backgroundColor: 'var(--color-paper)',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              aria-label="Write a message"
              placeholder={`Write a message to ${activeConversation.partner.displayName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                height: '44px',
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-line)',
                backgroundColor: 'var(--color-paper)',
                outline: 'none',
                fontSize: '0.9375rem',
                color: 'var(--color-ink)',
                boxShadow: 'var(--shadow-soft)',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputText.trim() || sending}
              style={{ height: '44px', padding: '0 var(--space-5)' }}
            >
              <Send size={16} />
            </Button>
          </form>

          {/* Report Modal */}
          <ReportModal
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            targetType="message"
            targetId={messages.length > 0 ? messages[messages.length - 1].id : activeConversation.id}
            targetName={`conversation with ${activeConversation.partner.displayName}`}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-paper)' }}>
          <EmptyState
            title="Select a conversation"
            description="Choose a learning partner from the left panel to review past messages and exchange ideas."
            icon={<MessageSquare size={32} />}
          />
        </div>
      )}
    </div>
  );
};
