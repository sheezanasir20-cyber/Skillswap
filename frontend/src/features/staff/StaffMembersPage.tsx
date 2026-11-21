import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Edit, Check, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Select } from '../../components/ui/Select.js';
import { Modal } from '../../components/ui/Modal.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { User } from '../../types/index.js';

export const StaffMembersPage: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<'member' | 'moderator' | 'admin'>('member');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended' | 'deleted'>('active');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/staff/members', {
        search,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setMembers(res.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [roleFilter, statusFilter]);

  const handleEditClick = (m: User) => {
    setSelectedMember(m);
    setEditRole(m.role);
    setEditStatus(m.status as any);
    setReason('');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !reason.trim()) return;

    setSaving(true);
    try {
      await api.patch(`/staff/members/${selectedMember.id}`, {
        role: editRole,
        status: editStatus,
        reason: reason.trim(),
      });
      setSelectedMember(null);
      loadMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to update member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>
          Member & Role Management
        </h1>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Manage user permissions, assign staff roles, and audit account status changes.
        </p>
      </div>

      {/* Filter toolbar */}
      <div
        className="paper-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          alignItems: 'flex-end',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <Input
            label="Search Members"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadMembers()}
          />
        </div>
        <div style={{ width: '150px' }}>
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'All roles' },
              { value: 'member', label: 'Member' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>
        <div style={{ width: '150px' }}>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'deleted', label: 'Deleted' },
            ]}
          />
        </div>
        <Button onClick={loadMembers} style={{ height: '42px' }}>
          <Search size={16} /> Filter
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading member directory..." />
      ) : (
        <div
          className="paper-card"
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line)', backgroundColor: 'var(--color-paper-warm)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Member</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Email</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Role</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-line-subtle)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>
                      {m.displayName}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>
                      {m.email}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor:
                            m.role === 'admin'
                              ? 'rgba(208, 0, 0, 0.12)'
                              : m.role === 'moderator'
                              ? 'rgba(250, 163, 7, 0.18)'
                              : 'var(--color-paper-warm)',
                          color:
                            m.role === 'admin'
                              ? 'var(--color-crimson-600)'
                              : m.role === 'moderator'
                              ? '#b35300'
                              : 'var(--color-ink)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor:
                            m.status === 'active'
                              ? 'rgba(106, 4, 15, 0.08)'
                              : 'rgba(208, 0, 0, 0.12)',
                          color:
                            m.status === 'active'
                              ? 'var(--color-burgundy-700)'
                              : 'var(--color-danger)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                      <Button size="sm" variant="secondary" onClick={() => handleEditClick(m)}>
                        <Edit size={14} /> Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role / Status Modal */}
      {selectedMember ? (
        <Modal
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title={`Manage Account: ${selectedMember.displayName}`}
          description="Update permissions or active status. The reason provided will be recorded in the immutable audit trail."
        >
          <form onSubmit={handleSaveUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Select
              label="Account Role"
              value={editRole}
              onChange={(e: any) => setEditRole(e.target.value)}
              options={[
                { value: 'member', label: 'Member' },
                { value: 'moderator', label: 'Moderator' },
                { value: 'admin', label: 'Administrator' },
              ]}
            />

            <Select
              label="Account Status"
              value={editStatus}
              onChange={(e: any) => setEditStatus(e.target.value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'deleted', label: 'Deleted (Soft deleted)' },
              ]}
            />

            <Textarea
              label="Reason for Change (required for audit logging)"
              required
              placeholder="State the justification for role or status update..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedMember(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};
