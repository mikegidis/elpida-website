import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { Product, QuizQuestion } from '../types';

interface ScentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What product category best fits your store portfolio?',
    subtitle: 'Select the primary focus for your retail inventory',
    options: [
      {
        label: 'Oriental & Fine Fragrance Oils',
        description: 'Rich, oriental sillage, oud, rose, and amber profiles.',
        categoryMatch: 'fragrances',
        noteMatch: 'oud'
      },
      {
        label: 'Skincare & Body Moisturization',
        description: 'Clere lotions, Kenta barrier cream, body glycerins.',
        categoryMatch: 'skincare'
      },
      {
        label: 'Haircare & Nourishing Oils',
        description: 'Sofn’free hair food, Argan oils, anti-frizz serums.',
        categoryMatch: 'haircare'
      },
      {
        label: 'Complete Personal Care Range',
        description: 'Balanced mix of skincare, haircare, and scents.',
        categoryMatch: 'skincare'
      }
    ]
  },
  {
    id: 2,
    question: 'What price point & volume fits your client base?',
    subtitle: 'How should the inventory be targeted in your market',
    options: [
      {
        label: 'High-Turnover Everyday Essentials',
        description: 'Accessible price points with high daily velocity.',
        categoryMatch: 'skincare'
      },
      {
        label: 'Premium Niche & Oriental Fragrance',
        description: 'High-margin prestige perfumes andconcentrated oils.',
        categoryMatch: 'fragrances'
      },
      {
        label: 'Salon & Haircare Specialists',
        description: 'Professional treatments and daily hair nourishment.',
        categoryMatch: 'haircare'
      },
      {
        label: 'Multicategory Superstore Stock',
        description: 'Broad variety covering all demographic segments.',
        categoryMatch: 'skincare'
      }
    ]
  },
  {
    id: 3,
    question: 'Which key brand line interests you most?',
    subtitle: 'Select your preferred brand family',
    options: [
      {
        label: 'Clere & Body Glycerin Line',
        description: 'Deep hydration and barrier nourishment.',
        categoryMatch: 'skincare'
      },
      {
        label: 'Swiss Arabian & Oriental Oils',
        description: 'Resinous oud, amber, and fine attars.',
        categoryMatch: 'fragrances'
      },
      {
        label: 'Sofn’free Haircare Formula',
        description: 'Rich oils and styling butter.',
        categoryMatch: 'haircare'
      },
      {
        label: 'Kenta & Specialized Care',
        description: 'Gentle protective barrier treatments.',
        categoryMatch: 'skincare'
      }
    ]
  }
];

export const ScentQuizModal: React.FC<ScentQuizModalProps> = ({
  isOpen,
  onClose,
  products,
  onQuickAdd,
  onSelectProduct,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = [...answers, optionIndex];
    setAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  // Calculate recommendation based on answers
  const getRecommendedProducts = () => {
    if (answers[0] === 0 || answers[2] === 1) {
      return products.filter((p) => p.category === 'fragrances').slice(0, 2);
    } else if (answers[0] === 1 || answers[2] === 0) {
      return products.filter((p) => p.category === 'skincare').slice(0, 2);
    } else if (answers[0] === 2 || answers[2] === 2) {
      return products.filter((p) => p.category === 'haircare').slice(0, 2);
    } else {
      return products.slice(0, 2);
    }
  };

  const recommendedList = getRecommendedProducts();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1424]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#3A1A2E] border border-[#C9A227]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          {!isCompleted ? (
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A227] mb-2 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Wholesale Inventory Diagnostic • Step {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                </div>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D6D2]">
                  {QUIZ_QUESTIONS[currentStep].question}
                </h3>
                <p className="text-xs text-[#E8D6D2]/70 mt-1">
                  {QUIZ_QUESTIONS[currentStep].subtitle}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#2D1424] h-1.5 rounded-full mb-8 overflow-hidden border border-[#C9A227]/20">
                <motion.div
                  className="bg-[#C9A227] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `EGP{((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full p-4 rounded-2xl bg-[#2D1424] border border-[#E8D6D2]/15 hover:border-[#C9A227] hover:bg-[#C9A227]/10 text-left transition-all duration-300 group flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#E8D6D2] group-hover:text-[#C9A227] transition-colors">
                        {option.label}
                      </h4>
                      <p className="text-xs text-[#E8D6D2]/70 mt-1 font-light leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[#E8D6D2]/20 group-hover:border-[#C9A227] flex items-center justify-center shrink-0 mt-1">
                      <ArrowRight className="w-3.5 h-3.5 text-transparent group-hover:text-[#C9A227] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Quiz Result */}
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-[#C9A227]/20 text-[#C9A227] mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D6D2]">
                  Recommended Wholesale Match
                </h3>
                <p className="text-xs text-[#E8D6D2]/80 mt-2 max-w-md mx-auto">
                  Based on your responses, Elpida recommends these high-velocity lines for your retail operation.
                </p>
              </div>

              {/* Recommended Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {recommendedList.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#2D1424] border border-[#C9A227]/30 flex flex-col justify-between"
                  >
                    <div className="flex gap-3 items-center mb-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold">
                          Matched Line
                        </span>
                        <h4 className="font-serif-editorial text-lg text-[#E8D6D2] leading-tight">
                          {prod.name}
                        </h4>
                        <span className="text-xs text-[#E8D6D2]/80 font-medium">EGP{prod.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="flex-1 py-2 text-xs border border-[#E8D6D2]/20 rounded-xl text-[#E8D6D2] hover:bg-white/5 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          onQuickAdd(prod);
                        }}
                        className="flex-1 py-2 text-xs bg-[#C9A227] text-[#3A1A2E] rounded-xl hover:bg-[#E5B82E] transition-colors flex items-center justify-center gap-1 font-bold"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E8D6D2]/15">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#C9A227] text-[#3A1A2E] text-xs uppercase tracking-wider font-bold hover:bg-[#E5B82E] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

