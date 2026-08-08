import React, { useEffect, useState } from 'react';
import { Search, Mail, MailOpen, Archive, Eye, X, Loader2 } from 'lucide-react';
import { ContactMessage } from '../../types';
import { fetchAdminMessages, updateAdminMessageStatus } from '../../api/contactApi';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Read' | 'Archived'>('All');

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('elpida_admin_token') || '';
      const data = await fetchAdminMessages(token);
      setMessages(data);
    } catch (err) {
      setError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: number, newStatus: 'Unread' | 'Read' | 'Archived') => {
    try {
      const token = localStorage.getItem('elpida_admin_token') || '';
      const updatedMessage = await updateAdminMessageStatus(id, newStatus, token);
      
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: updatedMessage.status } : msg))
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: updatedMessage.status });
      }
    } catch (err) {
      alert('Failed to update message status');
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'Unread') {
      handleStatusChange(message.id, 'Read');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = filter === 'All' ? true : msg.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(searchLower) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.subject.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#2D1424]">Contact Messages</h1>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C6B73]" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#D8CCC4] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#C9A227] sm:w-64"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none transition focus:border-[#C9A227]"
          >
            <option value="All">All Messages</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-[#E4DAD2] bg-white">
          <Loader2 className="animate-spin text-[#C9A227]" size={32} />
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-[#E4DAD2] bg-white text-center text-red-600">
          <p>{error}</p>
          <button onClick={loadMessages} className="mt-2 text-sm font-medium underline">
            Try again
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-[#E4DAD2] bg-white text-center text-[#7C6B73]">
          <p>No messages found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#E4DAD2] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E4DAD2] bg-[#F7F3EE]">
                <tr className="text-[#7C6B73]">
                  <th className="px-4 py-3 font-semibold">Sender</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DAD2]">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`transition hover:bg-[#F7F3EE] ${
                      msg.status === 'Unread' ? 'bg-[#F1EAE4] font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-[#2D1424]">{msg.name}</div>
                      <div className="text-xs text-[#7C6B73]">{msg.email}</div>
                    </td>
                    <td className="px-4 py-3 text-[#2D1424]">{msg.subject}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          msg.status === 'Unread'
                            ? 'bg-blue-100 text-blue-700'
                            : msg.status === 'Archived'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {msg.status === 'Unread' && <Mail size={12} />}
                        {msg.status === 'Read' && <MailOpen size={12} />}
                        {msg.status === 'Archived' && <Archive size={12} />}
                        {msg.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#7C6B73]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value as any)}
                          className="rounded border border-[#D8CCC4] bg-white px-2 py-1 text-xs outline-none focus:border-[#C9A227]"
                        >
                          <option value="Unread">Unread</option>
                          <option value="Read">Read</option>
                          <option value="Archived">Archive</option>
                        </select>
                        <button
                          onClick={() => handleViewMessage(msg)}
                          className="rounded-md p-1.5 text-[#5F4E58] transition hover:bg-[#E4DAD2] hover:text-[#2D1424]"
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E4DAD2] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#2D1424]">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-md p-1 text-[#7C6B73] transition hover:bg-[#F1EAE4] hover:text-[#2D1424]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Name</span>
                  <span className="text-[#2D1424]">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Email</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Phone</span>
                  <span className="text-[#2D1424]">{selectedMessage.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Date Submitted</span>
                  <span className="text-[#2D1424]">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#E4DAD2] pt-4">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Subject</span>
                <span className="mt-1 block font-medium text-[#2D1424]">{selectedMessage.subject}</span>
              </div>

              <div className="mt-4">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#7C6B73]">Message Content</span>
                <div className="mt-2 rounded-lg bg-[#F7F3EE] p-4 text-sm text-[#2D1424] whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E4DAD2] bg-[#F7F3EE] px-6 py-4 rounded-b-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#7C6B73]">Change Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as any)}
                  className="rounded-md border border-[#D8CCC4] bg-white px-3 py-1.5 text-sm outline-none focus:border-[#C9A227]"
                >
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                  <option value="Archived">Archive</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-md bg-[#2D1424] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A1A2E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
