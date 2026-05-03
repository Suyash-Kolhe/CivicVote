import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '', type: 'suggestion' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!auth.currentUser) {
      setError("Please sign in to submit feedback.");
      setIsSubmitting(false);
      return;
    }

    try {
      const feedbackCollection = collection(db, 'feedback');
      await addDoc(feedbackCollection, {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', feedback: '', type: 'suggestion' });
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to submit feedback. Ensure you are signed in and all fields are valid.");
      handleFirestoreError(err, OperationType.WRITE, 'feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cv-dark/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            role="dialog"
            aria-labelledby="feedback-title"
          >
            {submitted ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter font-display">Feedback <span className="text-cv-blue">Stored</span></h3>
                <p className="text-cv-dark/60 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                  Thank you for contributing to <br/> the democratic interface.
                </p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-cv-dark/5 bg-cv-dark text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cv-blue rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 id="feedback-title" className="font-black text-sm uppercase tracking-widest leading-none">Citizens Feedback</h3>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">Improve the Democratic Interface</p>
                    </div>
                  </div>
                  <button onClick={onClose} aria-label="Close modal" className="p-2 hover:bg-white/10 rounded-full transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fb-name" className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Name</label>
                      <input 
                        id="fb-name"
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-cv-light rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none" 
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="fb-email" className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Email</label>
                      <input 
                        id="fb-email"
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-cv-light rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none" 
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Type</label>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Feedback type">
                      {['suggestion', 'issue'].map(type => (
                        <button 
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.type === type ? 'bg-cv-blue text-white shadow-lg' : 'bg-cv-light text-cv-dark/40 hover:text-cv-dark'}`}
                          aria-pressed={formData.type === type}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fb-msg" className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Message</label>
                    <textarea 
                      id="fb-msg"
                      required
                      value={formData.feedback}
                      onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                      rows={4}
                      className="w-full bg-cv-light rounded-2xl p-5 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none resize-none" 
                      placeholder="Share your thoughts or report an issue..."
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-cv-dark text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Dispatch
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
