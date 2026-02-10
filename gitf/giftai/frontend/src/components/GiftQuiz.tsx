"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface GiftQuizProps {
  onComplete: (data: QuizData) => void;
  isLoading?: boolean;
}

export interface QuizData {
  age: string;
  gender: string;
  relationship: string;
  hobby: string;
  budget: string;
  occasion: string;
  styleImage?: File;
}

const GiftQuiz: React.FC<GiftQuizProps> = ({
  onComplete,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [cardParticles, setCardParticles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
    }>
  >([]);
  const [quizData, setQuizData] = useState<QuizData>({
    age: "",
    gender: "女性",
    relationship: "",
    hobby: "",
    budget: "",
    occasion: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate card particles only on client-side
  useEffect(() => {
    setIsMounted(true);
    setCardParticles(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
      })),
    );
  }, []);

  // Focus input khi chuyển step mà không cuộn trang
  useEffect(() => {
    // Đợi animation hoàn thành rồi mới focus
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const steps = [
    {
      id: "relationship",
      question: t("quiz.steps.relationship.question"),
      subtitle: t("quiz.steps.relationship.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.relationship.placeholder"),
      icon: "💕",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      id: "age",
      question: t("quiz.steps.age.question"),
      subtitle: t("quiz.steps.age.subtitle"),
      type: "number",
      placeholder: t("quiz.steps.age.placeholder"),
      icon: "👤",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      id: "gender",
      question: t("quiz.steps.gender.question"),
      subtitle: t("quiz.steps.gender.subtitle"),
      type: "select",
      options: [
        {
          value: "女性",
          label: t("quiz.steps.gender.options.female"),
          icon: "🌸",
        },
        {
          value: "男性",
          label: t("quiz.steps.gender.options.male"),
          icon: "⚡",
        },
      ],
      icon: "⚧",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: "hobby",
      question: t("quiz.steps.hobby.question"),
      subtitle: t("quiz.steps.hobby.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.hobby.placeholder"),
      icon: "✨",
      bgGradient: "from-yellow-50 to-amber-50",
    },
    {
      id: "occasion",
      question: t("quiz.steps.occasion.question"),
      subtitle: t("quiz.steps.occasion.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.occasion.placeholder"),
      icon: "🎊",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      id: "budget",
      question: t("quiz.steps.budget.question"),
      subtitle: t("quiz.steps.budget.subtitle"),
      type: "number",
      placeholder: t("quiz.steps.budget.placeholder"),
      icon: "💎",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      id: "styleImage",
      question: t("quiz.steps.styleImage.question"),
      subtitle: t("quiz.steps.styleImage.subtitle"),
      type: "image",
      icon: "🖼️",
      bgGradient: "from-teal-50 to-cyan-50",
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(quizData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setQuizData({ ...quizData, [currentStepData.id]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuizData({ ...quizData, styleImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form về giá trị mặc định
  const handleClearForm = () => {
    // Mở Modal xác nhận thay vì window.confirm
    setIsResetModalOpen(true);
  };

  // Thực hiện reset sau khi xác nhận
  const confirmClearForm = () => {
    setQuizData({
      age: "",
      gender: "女性",
      relationship: "",
      hobby: "",
      budget: "",
      occasion: "",
      styleImage: undefined,
    });
    setImagePreview("");
    setCurrentStep(0);
    setIsResetModalOpen(false);
  };

  const isStepValid = () => {
    const value = quizData[currentStepData.id as keyof QuizData];
    // Image step is optional
    if (currentStepData.id === "styleImage") return true;
    return value !== "" && value !== undefined;
  };

  return (
    <>
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Progress Bar - Glassmorphism */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            {t("quiz.progress.step")} {currentStep + 1} / {steps.length}
          </span>
          <span className="text-sm font-medium text-[#FFD700] gold-text-glow">
            {Math.round(progress)}% {t("quiz.progress.complete")}
          </span>
        </div>
        <div className="h-3 glass-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] gold-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Quiz Card - Cosmic Glassmorphism with Border Beam */}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          className="glass-card-strong border-beam rounded-3xl p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Nút Reset ở góc trên bên phải */}
          <motion.button
            onClick={handleClearForm}
            disabled={isLoading}
            className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 border-[#001f3f] bg-white/10 text-gray-200 hover:bg-[#001f3f] hover:text-[#FFD700] hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 入力をクリア
          </motion.button>

          {/* Cosmic particles inside card */}
          {isMounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {cardParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-[#FFD700] rounded-full animate-float-cosmic opacity-30"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Question Section */}
          <div className="relative z-10">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-6xl gold-glow">{currentStepData.icon}</div>
            </motion.div>

            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white text-center mb-3 gold-text-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {currentStepData.question}
            </motion.h2>
            <motion.p
              className="text-center text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {currentStepData.subtitle}
            </motion.p>

            {/* Input Section */}
            <div className="mb-6">
              {currentStepData.type === "text" && (
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={
                    quizData[currentStepData.id as keyof QuizData] as string
                  }
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  disabled={isLoading}
                  className="w-full p-4 border-2 border-[#FFD700]/20 rounded-2xl focus:outline-none focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/30 transition-all text-lg text-white bg-white/5 backdrop-blur-xl placeholder-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
              )}

              {currentStepData.type === "number" && (
                <motion.input
                  ref={inputRef}
                  type="number"
                  value={
                    quizData[currentStepData.id as keyof QuizData] as string
                  }
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  disabled={isLoading}
                  className="w-full p-4 border-2 border-[#FFD700]/20 rounded-2xl focus:outline-none focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/30 transition-all text-lg text-white bg-white/5 backdrop-blur-xl placeholder-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
              )}

              {currentStepData.type === "select" && currentStepData.options && (
                <div className="grid grid-cols-2 gap-4">
                  {currentStepData.options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleInputChange(option.value)}
                      disabled={isLoading}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                        quizData[currentStepData.id as keyof QuizData] ===
                        option.value
                          ? "border-[#FFD700] bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 backdrop-blur-xl shadow-lg shadow-[#FFD700]/20"
                          : "border-[#FFD700]/10 glass-card hover:border-[#FFD700]/50 hover:scale-105"
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="text-4xl mb-2"
                        animate={{
                          rotate:
                            quizData[currentStepData.id as keyof QuizData] ===
                            option.value
                              ? [0, -10, 10, -10, 0]
                              : 0,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {option.icon}
                      </motion.div>
                      <div
                        className={`font-bold ${
                          quizData[currentStepData.id as keyof QuizData] ===
                          option.value
                            ? "text-[#FFD700] gold-text-glow"
                            : "text-gray-200"
                        }`}
                      >
                        {option.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStepData.type === "image" && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label className="block">
                    <div className="border-2 border-dashed border-[#FFD700]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FFD700] hover:bg-white/10 transition-all glass-card group">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <motion.img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-xl shadow-lg shadow-[#FFD700]/20 border border-[#FFD700]/30"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <p className="text-sm text-gray-300">
                            {t("quiz.steps.styleImage.changeImage")}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <motion.div
                            className="text-5xl mb-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            📷
                          </motion.div>
                          <p className="text-lg font-medium text-gray-200 mb-2">
                            {t("quiz.steps.styleImage.uploadImage")}
                          </p>
                          <p className="text-sm text-gray-400">
                            {t("quiz.steps.styleImage.dragDrop")}
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </div>
                  </label>
                  <p className="text-xs text-gray-400 text-center">
                    ⚡ AIが画像を分析して、より適切なギフトを提案します
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            className="flex gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.button
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                currentStep === 0 || isLoading
                  ? "glass-card text-gray-500 cursor-not-allowed opacity-50"
                  : "glass-card border-2 border-[#FFD700]/30 text-gray-200 hover:border-[#FFD700] hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/20"
              }`}
              whileHover={
                currentStep !== 0 && !isLoading ? { scale: 1.05 } : {}
              }
              whileTap={currentStep !== 0 && !isLoading ? { scale: 0.95 } : {}}
            >
              {t("quiz.buttons.back")}
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                !isStepValid() || isLoading
                  ? "glass-card text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#030712] hover:scale-105 hover:shadow-xl gold-glow"
              }`}
              whileHover={isStepValid() && !isLoading ? { scale: 1.05 } : {}}
              whileTap={isStepValid() && !isLoading ? { scale: 0.95 } : {}}
            >
              {!isStepValid() || isLoading ? null : (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              )}
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#030712]"></div>
                    {t("quiz.buttons.processing")}
                  </div>
                ) : currentStep === steps.length - 1 ? (
                  t("quiz.buttons.complete")
                ) : (
                  t("quiz.buttons.next")
                )}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] gold-glow"
                  : index < currentStep
                    ? "w-2 bg-[#FFD700]/60"
                    : "w-2 bg-gray-600"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-[#001f3f] rounded-3xl shadow-2xl shadow-[#FFD700]/20 p-8 max-w-md w-full border border-[#FFD700]/30 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Glow Effect */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FFD700]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#FFA500]/20 rounded-full blur-3xl" />

              {/* Icon */}
              <motion.div
                className="relative flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700]/30 to-[#FFA500]/30 rounded-full flex items-center justify-center border-2 border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/30">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 w-20 h-20 bg-[#FFD700]/20 rounded-full animate-ping" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="relative text-2xl font-bold text-white text-center mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                入力をクリアしますか？
              </motion.h3>

              {/* Description */}
              <motion.p
                className="relative text-gray-300 text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                すべての入力内容が削除され、最初からやり直すことになります。
                <br />
                <span className="text-[#FFD700]/80 text-sm">この操作は取り消せません。</span>
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="relative flex gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {/* Cancel Button */}
                <motion.button
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-200 border-2 border-gray-500 hover:border-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  キャンセル
                </motion.button>

                {/* Confirm Button */}
                <motion.button
                  onClick={confirmClearForm}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-[#001f3f] bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:shadow-lg hover:shadow-[#FFD700]/40 transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shine Effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">🔄 リセットする</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiftQuiz;
