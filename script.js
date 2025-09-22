document.addEventListener('DOMContentLoaded', function() {
    // العناصر الأساسية
    const productImageInput = document.getElementById('productImage');
    const productNameInput = document.getElementById('productName');
    const originalPriceInput = document.getElementById('originalPrice');
    const discountPriceInput = document.getElementById('discountPrice');
    const generateBtn = document.getElementById('generateOffer');
    const downloadBtn = document.getElementById('downloadOffer');
    const offerPreview = document.getElementById('offerPreview');

    // متغيرات لحفظ البيانات
    let productImageSrc = '';

    // معالج رفع الصورة
    productImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImageSrc = e.target.result;
                updateUploadPlaceholder();
            };
            reader.readAsDataURL(file);
        }
    });

    // تحديث نص رفع الصورة
    function updateUploadPlaceholder() {
        const placeholder = document.querySelector('.upload-placeholder');
        if (productImageSrc) {
            placeholder.innerHTML = '<span style="color: #27ae60;">✅ تم اختيار الصورة</span>';
            placeholder.style.background = '#d5f4e6';
            placeholder.style.borderColor = '#27ae60';
        }
    }

    // تحديث المعاينة عند التغيير في المدخلات
    [productNameInput, originalPriceInput, discountPriceInput].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // زر إنشاء العرض
    generateBtn.addEventListener('click', generateOffer);

    // زر تحميل العرض
    downloadBtn.addEventListener('click', downloadOffer);

    function updatePreview() {
        const productName = productNameInput.value || 'اسم المنتج';
        const originalPrice = parseFloat(originalPriceInput.value) || 0;
        const discountPrice = parseFloat(discountPriceInput.value) || 0;

        // حساب التوفير والنسبة
        const savings = originalPrice - discountPrice;
        const savingsPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

        // تحديث اسم المنتج
        document.querySelector('.product-name').textContent = productName;

        // تحديث الأسعار
        document.querySelector('.original-price .price').textContent = `${originalPrice} ر.س`;
        document.querySelector('.discount-price .price').textContent = `${discountPrice} ر.س`;

        // تحديث التوفير
        const savingsElement = document.querySelector('.savings');
        savingsElement.innerHTML = `
            <span class="savings-text">توفر: ${savings.toFixed(2)} ر.س</span>
            <span class="savings-percent">(${savingsPercent}%)</span>
        `;

        // تحديث لون التوفير حسب النسبة
        if (savingsPercent > 30) {
            savingsElement.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        } else if (savingsPercent > 15) {
            savingsElement.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        } else {
            savingsElement.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        }
    }

    function generateOffer() {
        // التحقق من المدخلات
        if (!productNameInput.value.trim()) {
            alert('⚠️ يرجى إدخال اسم المنتج');
            productNameInput.focus();
            return;
        }

        if (!originalPriceInput.value || !discountPriceInput.value) {
            alert('⚠️ يرجى إدخال الأسعار');
            return;
        }

        const originalPrice = parseFloat(originalPriceInput.value);
        const discountPrice = parseFloat(discountPriceInput.value);

        if (discountPrice >= originalPrice) {
            alert('⚠️ السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي');
            return;
        }

        // تحديث الصورة في المعاينة
        const productImageContainer = document.querySelector('.product-image');
        if (productImageSrc) {
            productImageContainer.innerHTML = `<img src="${productImageSrc}" alt="صورة المنتج">`;
        }

        // تحديث المعاينة
        updatePreview();

        // إضافة تأثير نجاح
        generateBtn.innerHTML = '✅ تم إنشاء العرض';
        generateBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        
        setTimeout(() => {
            generateBtn.innerHTML = '🎨 إنشاء العرض';
            generateBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }, 2000);

        // إظهار زر التحميل
        downloadBtn.style.display = 'block';

        // التمرير إلى المعاينة
        document.querySelector('.preview-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    async function downloadOffer() {
        try {
            // إنشاء canvas لتحويل العرض إلى صورة
            const offerCard = document.querySelector('.offer-card');
            
            // استخدام html2canvas لتحويل العنصر إلى صورة
            if (typeof html2canvas === 'undefined') {
                // تحميل مكتبة html2canvas
                await loadHtml2Canvas();
            }

            const canvas = await html2canvas(offerCard, {
                scale: 2,
                backgroundColor: '#ffffff',
                allowTaint: true,
                useCORS: true,
                width: offerCard.offsetWidth,
                height: offerCard.offsetHeight
            });

            // تحويل Canvas إلى صورة وتحميلها
            const link = document.createElement('a');
            link.download = `عرض_${productNameInput.value || 'منتج'}_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // تأثير نجاح التحميل
            downloadBtn.innerHTML = '✅ تم التحميل';
            downloadBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            
            setTimeout(() => {
                downloadBtn.innerHTML = '📥 تحميل العرض';
                downloadBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            }, 2000);

        } catch (error) {
            console.error('خطأ في تحميل العرض:', error);
            alert('⚠️ حدث خطأ في تحميل العرض. يرجى المحاولة مرة أخرى.');
        }
    }

    // تحميل مكتبة html2canvas
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // إخفاء زر التحميل في البداية
    downloadBtn.style.display = 'none';

    // تحديث المعاينة الأولية
    updatePreview();

    // إضافة تأثيرات تفاعلية
    addInteractiveEffects();

    function addInteractiveEffects() {
        // تأثير hover على البطاقة
        const offerCard = document.querySelector('.offer-card');
        offerCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        offerCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // تأثير focus على المدخلات
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'all 0.3s ease';
            });

            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    // تحديث تلقائي للمعاينة كل ثانية
    setInterval(() => {
        if (document.activeElement.tagName === 'INPUT') {
            updatePreview();
        }
    }, 1000);

    // إضافة اختصارات لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter لإنشاء العرض
        if (e.ctrlKey && e.key === 'Enter') {
            generateOffer();
        }
        
        // Ctrl + D لتحميل العرض
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            if (downloadBtn.style.display !== 'none') {
                downloadOffer();
            }
        }
    });

    // إضافة نصائح للمستخدم
    showTips();

    function showTips() {
        const tips = [
            '💡 نصيحة: استخدم صورة واضحة وجذابة للمنتج',
            '💡 نصيحة: اجعل الخصم ملفت للنظر (15% أو أكثر)',
            '💡 نصيحة: استخدم أسماء منتجات واضحة ومفهومة',
            '💡 نصيحة: يمكنك استخدام Ctrl+Enter لإنشاء العرض بسرعة'
        ];

        let tipIndex = 0;
        const tipElement = document.createElement('div');
        tipElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 0.9rem;
            max-width: 300px;
            transform: translateY(100px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(tipElement);

        function showNextTip() {
            tipElement.innerHTML = tips[tipIndex];
            tipElement.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                tipElement.style.transform = 'translateY(100px)';
            }, 4000);

            tipIndex = (tipIndex + 1) % tips.length;
        }

        // إظهار أول نصيحة بعد 3 ثوان
        setTimeout(showNextTip, 3000);
        
        // إظهار نصيحة جديدة كل 10 ثوان
        setInterval(showNextTip, 10000);
    }
});